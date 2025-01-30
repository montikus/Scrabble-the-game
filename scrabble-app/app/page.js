// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h2>Witaj w grze Scrabble!</h2>
      <Link href="/connect">
        <button style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
          PLAY
        </button>
      </Link>
      <p>OR:</p>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/api/words">Dictionary</Link></li>
      </ul>
    </div>
  );
}
