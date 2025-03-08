import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { supabase } from '@/lib/supabase';

const PIXABAY_API_KEY = '45056603-00fe9b2d5ded8a95b6d6f62ac'; // ここにPixabayのAPIキーを入力してください

export async function POST() {
  try {
    // 画像がない単語をデータベースから取得
    const wordsWithoutImages = await prisma.word.findMany({
      where: { imageUrl: null },
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
      // Pixabay APIを使用して画像を取得
      const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word.meanings[0].meaning)}&image_type=photo`);
      const data = await response.json();

      if (data.hits.length === 0) {
        console.log(`No images found for word: ${word.meanings[0].meaning}`);
        continue;
      }

      const imageUrl = data.hits[0].webformatURL;

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