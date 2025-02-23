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

    // データベースを更新
    await prisma.word.update({
      where: { id: wordId },
      data: { imageUrl: data?.path },
    });

    return NextResponse.json({ success: true, imageUrl: data?.path });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
} 