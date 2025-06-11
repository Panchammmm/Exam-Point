
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth Pages
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import AdminLogin from '@/pages/auth/AdminLogin';

// User Pages
import Dashboard from '@/pages/user/Dashboard';
import ExamPage from '@/pages/user/ExamPage';
import Profile from '@/pages/user/Profile';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import CreateExam from '@/pages/admin/CreateExam';
import ExamManagement from '@/pages/admin/ExamManagement';

// Landing Page Component
const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace data-id="yy2ra1dti" data-path="src/App.tsx" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" data-id="po7l6dc6e" data-path="src/App.tsx">
      <div className="text-center max-w-md" data-id="mm0q9gy5e" data-path="src/App.tsx">
        <div className="mb-8" data-id="fdwb56im5" data-path="src/App.tsx">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-id="3y8j2q0gh" data-path="src/App.tsx">Exam Point</h1>
          <p className="text-xl text-gray-600 mb-8" data-id="8tdh6dy6f" data-path="src/App.tsx">
            A comprehensive online examination platform for students and educators
          </p>
        </div>
        
        <div className="space-y-4" data-id="6qpksc97p" data-path="src/App.tsx">
          <div className="grid grid-cols-1 gap-4" data-id="i0sdgriu2" data-path="src/App.tsx">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors" data-id="qv9vpeja0" data-path="src/App.tsx">

              Student Login
            </a>
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors" data-id="u35y2rf5i" data-path="src/App.tsx">

              Create Student Account
            </a>
            <a
              href="/admin/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors" data-id="qlaa25z8m" data-path="src/App.tsx">

              Admin Access
            </a>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-md" data-id="fs3dtgt7z" data-path="src/App.tsx">
          <h3 className="text-lg font-semibold text-gray-900 mb-2" data-id="ndrsxcmie" data-path="src/App.tsx">Features</h3>
          <ul className="text-sm text-gray-600 space-y-1" data-id="k5nrzkorc" data-path="src/App.tsx">
            <li data-id="yq7ln6oq1" data-path="src/App.tsx">• Secure authentication system</li>
            <li data-id="gpwy8y8k8" data-path="src/App.tsx">• Timer-based examinations</li>
            <li data-id="388bte8aa" data-path="src/App.tsx">• Real-time score calculation</li>
            <li data-id="mu3jfpk70" data-path="src/App.tsx">• Admin dashboard for exam management</li>
            <li data-id="qhkm24914" data-path="src/App.tsx">• Student progress tracking</li>
          </ul>
        </div>
      </div>
    </div>);

};

const AppRoutes: React.FC = () => {
  return (
    <Routes data-id="9o2om1vsd" data-path="src/App.tsx">
      {/* Public Routes */}
      <Route path="/" element={<LandingPage data-id="xwcwr6xcn" data-path="src/App.tsx" />} data-id="5s5v1hf0n" data-path="src/App.tsx" />
      <Route path="/login" element={<Login data-id="doopuouaa" data-path="src/App.tsx" />} data-id="yc3cgsvch" data-path="src/App.tsx" />
      <Route path="/signup" element={<Signup data-id="c8rbu7ung" data-path="src/App.tsx" />} data-id="xlbqswroz" data-path="src/App.tsx" />
      <Route path="/admin/login" element={<AdminLogin data-id="5zqe5xuf8" data-path="src/App.tsx" />} data-id="ee7q2airw" data-path="src/App.tsx" />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
        <ProtectedRoute requiredRole="user" data-id="tdgq14a54" data-path="src/App.tsx">
            <Dashboard data-id="b40i37iks" data-path="src/App.tsx" />
          </ProtectedRoute>
        } data-id="hkef8hco9" data-path="src/App.tsx" />

      <Route
        path="/exam/:id"
        element={
        <ProtectedRoute requiredRole="user" data-id="n15xwjycs" data-path="src/App.tsx">
            <ExamPage data-id="p12l16ih8" data-path="src/App.tsx" />
          </ProtectedRoute>
        } data-id="mgmgseku8" data-path="src/App.tsx" />

      <Route
        path="/profile"
        element={
        <ProtectedRoute requiredRole="user" data-id="5s6bjaodp" data-path="src/App.tsx">
            <Profile data-id="dnhr09ldu" data-path="src/App.tsx" />
          </ProtectedRoute>
        } data-id="o6avov4sb" data-path="src/App.tsx" />


      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
        <ProtectedRoute requiredRole="admin" data-id="rvzlpagkm" data-path="src/App.tsx">
            <AdminDashboard data-id="e0l13uqq7" data-path="src/App.tsx" />
          </ProtectedRoute>
        } data-id="2a0fy5fvv" data-path="src/App.tsx" />

      <Route
        path="/admin/create-exam"
        element={
        <ProtectedRoute requiredRole="admin" data-id="3ej3q3f4l" data-path="src/App.tsx">
            <CreateExam data-id="s8i2e9xm2" data-path="src/App.tsx" />
          </ProtectedRoute>
        } data-id="fbdnq2ccn" data-path="src/App.tsx" />

      <Route
        path="/admin/exams"
        element={
        <ProtectedRoute requiredRole="admin" data-id="9tefapkc9" data-path="src/App.tsx">
            <ExamManagement data-id="d4ba7ds9x" data-path="src/App.tsx" />
          </ProtectedRoute>
        } data-id="372zz46j2" data-path="src/App.tsx" />


      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace data-id="fwk0a3mbt" data-path="src/App.tsx" />} data-id="vk0hc5bx0" data-path="src/App.tsx" />
    </Routes>);

};

const App: React.FC = () => {
  return (
    <AuthProvider data-id="oew4y77j1" data-path="src/App.tsx">
      <BrowserRouter data-id="ekeoortjj" data-path="src/App.tsx">
        <div className="App" data-id="o49ifxqmp" data-path="src/App.tsx">
          <AppRoutes data-id="eg9xu37mg" data-path="src/App.tsx" />
          <Toaster data-id="kdqcl8lwk" data-path="src/App.tsx" />
        </div>
      </BrowserRouter>
    </AuthProvider>);

};

export default App;