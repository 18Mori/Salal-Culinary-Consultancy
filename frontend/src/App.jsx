import react from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClientDashboard from "./pages/ClientDashboard/client_index"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Booking from "./pages/ClientDashboard/components/page/Booking"
import Bill from "./pages/ClientDashboard/components/page/Bill"
import LoadingIndicator from "./components/LoadingIndicator"
import { Suspense, lazy } from "react";


function Logout() {
  localStorage.clear();
  window.location.href = '/login';
  return <div style={{ textAlign: 'center', padding: '50px' }}>Logging out...</div>;
}
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const About = lazy(() => import("./pages/About"));


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
          path="/"
          element={
            <Suspense fallback={<LoadingIndicator />}>
              <MainLayout>
                <Home />
              </MainLayout>
            </Suspense>
          }
        />
        <Route path="/about" element={
          <Suspense fallback={<LoadingIndicator />}>
            <MainLayout><About /></MainLayout>
          </Suspense>
          } />
        <Route path="/login" element={
          <Suspense fallback={<LoadingIndicator />}>
          <MainLayout><Login /></MainLayout>
          </Suspense>
          } />
        <Route path="/logout" element={
          <Suspense fallback={<LoadingIndicator />}>
          <MainLayout><Logout /></MainLayout>
          </Suspense>
          } />
        <Route path="/register" element={
          <Suspense fallback={<LoadingIndicator />}>
          <MainLayout><Register /></MainLayout>
          </Suspense>
          } />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App