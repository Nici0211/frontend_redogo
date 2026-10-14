import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Locations from './pages/Locations'
import MenuSelection from './pages/MenuSelection'
import Menu from './pages/Menu'

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/menu" element={<MenuSelection />} />
                <Route path="/locations/:id/menu" element={<Menu />} />
            </Routes>
        </BrowserRouter>
    )
}
