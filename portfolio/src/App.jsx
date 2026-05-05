import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Veille from './components/Veille'
import Contact from './components/Contact'
import './App.css'

export default function App() {
    return (
        <div className="app">
            <Nav />
            <main>
                <Hero />
                <div className="section-divider" />
                <About />
                <div className="section-divider" />
                <Projects />
                <div className="section-divider" />
                <Veille />
                <div className="section-divider" />
                <Contact />
            </main>
            <footer className="footer">
                <p>© 2026 Virgile Allix — BTS SIO SLAM · LMG</p>
            </footer>
        </div>
    )
}
