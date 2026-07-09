import { Navbar }        from '../components/public/Navbar'
import { Hero }          from '../components/public/Hero'
import { About }         from '../components/public/About'
import { Achievements }  from '../components/public/Achievements'
import { Gallery }       from '../components/public/Gallery'
import { Staff }         from '../components/public/Staff'
import { Reviews }       from '../components/public/Reviews'
import { Contact }       from '../components/public/Contact'
import { Footer }        from '../components/public/Footer'
import { ChatbotWidget } from '../components/public/ChatbotWidget'

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Achievements />
        <Gallery />
        <Staff />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  )
}
