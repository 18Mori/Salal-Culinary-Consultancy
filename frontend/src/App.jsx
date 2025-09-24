import react from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import ClientDashboard from "./pages/ClientDashboard/client_index"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import About from "./pages/About"
import Services from "./pages/Services"
import Contact from "./pages/Contact"
import Booking from "./pages/ClientDashboard/components/page/Booking"
import Bill from "./pages/ClientDashboard/components/page/Bill"
import Chat from "./pages/ClientDashboard/components/page/Chat"
import LoadingIndicator from "./components/LoadingIndicator"
import { Suspense, lazy } from "react";


function Logout() {
  localStorage.clear();
  window.location.href = '/login';
  return <div style={{ textAlign: 'center', padding: '50px' }}>Logging out...</div>;
}
const Home = lazy(() => import("./pages/Home"));

function MainLayout({ children }) {
  return (
    <main className="flex-1 pt-16 lg:pt-0 transition-all duration-300">
      {children}
    </main>
  );
}

function App() {
  
  return (
    <BrowserRouter>
    
      <Routes>
      <Route
          path="/client_index"
          element={
            <MainLayout>
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <MainLayout>
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/bill"
          element={
            <MainLayout>
              <ProtectedRoute>
                <Bill />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <MainLayout>
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingIndicator />}>
              <MainLayout>
                <Home />
              </MainLayout>
            </Suspense>
          }
        />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/logout" element={<MainLayout><Logout /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App