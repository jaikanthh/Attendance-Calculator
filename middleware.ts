import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only intercept sitemap.xml requests
  if (pathname === '/sitemap.xml') {
    // Create a custom sitemap with correct dates and format
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://klattendance.vercel.app</loc>
    <lastmod>2023-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://klattendance.vercel.app/welcome</loc>
    <lastmod>2023-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://klattendance.vercel.app/simple</loc>
    <lastmod>2023-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://klattendance.vercel.app/ltps</loc>
    <lastmod>2023-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
    
    // Return the custom sitemap with proper content type
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/sitemap.xml']
} 