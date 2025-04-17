'use client'

import { redirect } from 'next/navigation'

// Force static generation for export
export const dynamic = "force-static"

export default function Home() {
  redirect('/welcome')
}
