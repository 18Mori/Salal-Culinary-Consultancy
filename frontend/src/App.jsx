import react from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Home from "./pages/Home"
import ClientDashboard from "./pages/ClientDashboard/client_index"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import About from "./pages/About"
import Services from "./pages/Services"
import Contact from "./pages/Contact"

function Logout() {
  localStorage.clear()
  window.location.href = '/login';
  return <div style={{ textAlign: 'center', padding: '50px' }}>Logging out...</div>;
}

function App() {
  
  return (
    <BrowserRouter>
    
      <main className="flex-1 pt-16 lg:pt-0 transition-all duration-300">
      <Routes>
        <Route
          path="/client_index"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App