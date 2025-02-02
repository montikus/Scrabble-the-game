// app/page.js
"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function HomePage() {
  const router = useRouter();

  const handlePlay = () => {
    router.push('/auth');
  };
  return (
    <div>
      <h2>Welcome to Scrabble!</h2>
      <button onClick={handlePlay} style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
          PLAY
        </button>
      <p>OR:</p>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/api/words">Dictionary</Link></li>
      </ul>
    </div>
  );
}
