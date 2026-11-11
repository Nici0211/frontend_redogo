import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Locations from './pages/Locations'
import MenuSelection from './pages/MenuSelection'
import Menu from './pages/Menu'
import AdminDishes from './pages/AdminDishes'
import Account from './pages/Account'

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/menu" element={<MenuSelection />} />
                <Route path="/locations/:id/menu" element={<Menu />} />
                <Route path="/admin" element={<AdminDishes />} />
                <Route path="/account" element={<Account />} />
            </Routes>
        </BrowserRouter>
    )
}
