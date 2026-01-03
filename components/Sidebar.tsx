// components/Sidebar.tsx
import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-4">AI Business OS</h1>
      <nav className="flex flex-col gap-2">
        <Link href="/">Home</Link>
        <Link href="/phase1">Phase 1</Link>
        <Link href="/phase2">Phase 2</Link>
        <Link href="/phase3">Phase 3</Link>
        <Link href="/phase4">Phase 4</Link>
        <Link href="/phase5">Phase 5</Link>
      </nav>
    </aside>
  )
}
