import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'KL University Attendance Calculator'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  // Font
  const interSemiBold = fetch(
    new URL('https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap')
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          color: 'white',
        }}
      >
        <div 
          style={{
            fontSize: 64,
            fontWeight: 600,
            background: 'linear-gradient(to bottom right, #ef4444, #dc2626)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 24
          }}
        >
          KL University
        </div>
        <div 
          style={{
            fontSize: 48,
            fontWeight: 600,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          Attendance Calculator
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.8,
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          Calculate your attendance percentage and check exam eligibility
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
} 