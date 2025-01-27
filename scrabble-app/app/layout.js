// app/layout.js
export const metadata = {
    title: 'Scrabble App',
    description: 'Gra "Scrabble" z Next.js',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="ru">
        <body>
          <header style={{ backgroundColor: '#eee', padding: '1rem' }}>
            <h1>Scrabble</h1>
          </header>
          
          <main style={{ margin: '1rem' }}>
            {children}
          </main>
  
          <footer style={{ backgroundColor: '#eee', padding: '1rem', marginTop: '2rem' }}>
            <small>2025 Scrabble Inc.</small>
          </footer>
        </body>
      </html>
    );
  }
  