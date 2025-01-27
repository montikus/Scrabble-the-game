// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h2>Witaj w grze Scrabble!</h2>
      <p>Wybierz opcję:</p>
      <ul>
        <li><Link href="/dashboard">Panel sterowania (Dashboard)</Link></li>
        <li><Link href="/api/words">Oglądać API słów (JSON)</Link></li>
      </ul>
    </div>
  );
}
