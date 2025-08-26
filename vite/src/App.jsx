import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import scrimbaLogo from './assets/img.png'
import './App.css'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'


function App() {
    const greeting = import.meta.env.VITE_GREETING
    const ipAddress = import.meta.env.VITE_API_URL
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
          <a href="https://scrimba.com" target="_blank">
              <img src={scrimbaLogo}/>
          </a>

      </div>
      <h1>Vite + React</h1>
        <h2>{greeting}</h2>
        <h3>{ipAddress}</h3>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
          <Header/>
          <Footer/>
      </p>
    </>
  )
}

export default App
