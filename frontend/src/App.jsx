import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Home from "./pages/Home"
import ClientDashboard from "./pages/ClientDashboard/client_index"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

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