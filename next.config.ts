import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    domains: ['ukwsebzgjwpsjkepppac.supabase.co', 'localhost'],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
