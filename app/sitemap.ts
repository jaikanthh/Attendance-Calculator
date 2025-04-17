import { MetadataRoute } from 'next'

// Force static generation
// export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://klattendance.vercel.app'
  
  // @ts-ignore - Next.js expects changeFrequency but Google expects changefreq
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changefreq: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/welcome`,
      lastModified: new Date(),
      changefreq: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/simple`,
      lastModified: new Date(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ltps`,
      lastModified: new Date(),
      changefreq: 'monthly',
      priority: 0.8,
    },
  ]
} 