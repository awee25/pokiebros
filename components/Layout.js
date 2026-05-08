import Navbar from './Navbar'
import Head from 'next/head'

export default function Layout({ children, title = 'PokéStore' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-poke-dark text-white">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-poke-border mt-20 py-8 text-center text-poke-muted text-sm">
          <p>© {new Date().getFullYear()} PokéStore. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
