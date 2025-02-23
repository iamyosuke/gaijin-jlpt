import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const wordId = parseInt(url.pathname.split('/').slice(-2, -1)[0]);

  if (isNaN(wordId)) {
    return NextResponse.json({ error: 'Invalid word ID' }, { status: 400 });
  }

  const formData = await request.formData();
  const imageFile = formData.get('image') as File;

  if (!imageFile) {
    return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
  }

  try {
    // Supabase Storageに画像をアップロード
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`words/${Date.now()}_word_image`, imageFile);
    console.log(data);
    if (error) {
      throw error;
    }

    // 公開URLを取得
    const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.path);
    const imageUrl = publicData.publicUrl;

    // データベースを更新
    await prisma.word.update({
      where: { id: wordId },
      data: { imageUrl },
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
} 