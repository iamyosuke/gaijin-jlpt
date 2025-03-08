import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { OpenAI } from 'openai';

// OpenAIのAPIキーを設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

export async function POST() {
  try {
    // 画像がない単語をデータベースから取得
    const wordsWithoutImages = await prisma.word.findMany({
      where: { imageUrl: null },
      orderBy: {
        id: 'asc',
      },
      include: {
        meanings: {
          where: {
            language: {
              code: 'en'
            }
          }
        },
      },
    });

    if (wordsWithoutImages.length === 0) {
      return NextResponse.json({ message: 'No words without images found' });
    }

    for (const word of wordsWithoutImages) {
      // DALL-E 2 APIを使用して画像を生成
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: word.meanings[0].meaning,
        n: 1,
        size: "256x256",
      });

      const imageUrl = response.data[0].url;

      if (!imageUrl) {
        console.error(`No image URL found for word: ${word.text}`);
        continue;
      }

      // Supabase Storageに画像をアップロード
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`words/${Date.now()}_word_image`, imageBlob);

      if (uploadError) {
        console.error(`Failed to upload image for word: ${word.text}`, uploadError);
        continue;
      }

      // 公開URLを取得
      const { data: publicData } = supabase.storage.from('images').getPublicUrl(uploadData.path);
      const publicImageUrl = publicData.publicUrl;

      // データベースを更新
      await prisma.word.update({
        where: { id: word.id },
        data: { imageUrl: publicImageUrl },
      });

      console.log(`Image added for word: ${word.text}`);
    }

    return NextResponse.json({ success: true, message: 'Images added for words without images' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch and upload images' }, { status: 500 });
  }
}
