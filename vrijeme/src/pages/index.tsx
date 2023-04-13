import Footer from '@/components/Footer'
import NavigacioniBar from '@/components/NavigacioniBar'
import Weather from '@/components/Vrijeme'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Vrijeme</title>
        <link rel="icon" href={"/sunce.png"} />
      </Head>
      <main>
        <NavigacioniBar />
        <Weather />
        <Footer />
      </main>
    </>
  )
}

