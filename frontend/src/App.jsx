import react from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClientDashboard from "./pages/ClientDashboard/client_index"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Booking from "./pages/ClientDashboard/components/page/Booking"
import Bill from "./pages/ClientDashboard/components/page/Bill"
import Loader from "./components/Loader";
import { Suspense, lazy } from "react";


function Logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('sidebarCollapsed');
  window.location.href = '/login';
  return <div style={{ textAlign: 'center', padding: '50px' }}>Logging out...</div>;
}
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const About = lazy(() => import("./pages/About"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));


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
  path="/admin-dashboard"
  element={
    <MainLayout>
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    </MainLayout>
  }
/>
      <Route
          path="/client_dashboard"
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
            <Suspense fallback={<Loader.Section />}>
              <MainLayout>
                <Home />
              </MainLayout>
            </Suspense>
          }
        />
        <Route path="/about" element={
          <Suspense fallback={<Loader.Section />}>
            <MainLayout><About /></MainLayout>
          </Suspense>
          } />
        <Route path="/services" element={
          <Suspense fallback={<Loader.Section />}>
            <MainLayout><Services /></MainLayout>
          </Suspense>
          } />
        <Route path="/portfolio" element={
          <Suspense fallback={<Loader.Section />}>
            <MainLayout><Portfolio /></MainLayout>
          </Suspense>
          } />
        <Route path="/login" element={
          <Suspense fallback={<Loader.Section />}>
          <MainLayout><Login /></MainLayout>
          </Suspense>
          } />
        <Route path="/logout" element={
          <Suspense fallback={<Loader.Section />}>
          <MainLayout><Logout /></MainLayout>
          </Suspense>
          } />
        <Route path="/register" element={
          <Suspense fallback={<Loader.Section />}>
          <MainLayout><Register /></MainLayout>
          </Suspense>
          } />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App