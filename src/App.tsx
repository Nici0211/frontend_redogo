import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Standorte from './pages/Standorte'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrieren" element={<Register />} />
        <Route path="/standorte" element={<Standorte />} />
      </Routes>
    </BrowserRouter>
  )
}