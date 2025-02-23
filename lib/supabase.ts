import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 

export const getImageUrl = async (filePath: string) => {
  const { data, error } = await supabase.storage.from('images').createSignedUrl(filePath, 600);
  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }
  return data?.signedUrl;
};
