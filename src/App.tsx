import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./components/StudentDashboard";
import ExamInterface from "./components/ExamInterface";
import MultiSectionExamInterface from "./components/MultiSectionExamInterface";
import AdminDashboard from "./components/AdminDashboard";
import StudentRankings from "./components/StudentRankings";
import ExamResults from "./components/ExamResults";
import LoginPage from "./components/LoginPage";
import NotFound from "./pages/NotFound";

// Mock components
import { AuthProvider } from "./hooks/useMockAuth";
import MockProtectedRoute from "./components/MockProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient} data-id="q3ku8sq86" data-path="src/App.tsx">
      <TooltipProvider data-id="plzlqo56o" data-path="src/App.tsx">
        <AuthProvider data-id="wbyul6f8a" data-path="src/App.tsx">
          <Toaster data-id="pzogw5pvl" data-path="src/App.tsx" />
          <BrowserRouter data-id="hlthanrq1" data-path="src/App.tsx">
            <div className="min-h-screen bg-gray-50" data-id="og97kqs2w" data-path="src/App.tsx">
              <Routes data-id="c5ehvaf57" data-path="src/App.tsx">
                <Route path="/" element={<Navigate to="/login" data-id="knpfhate0" data-path="src/App.tsx" />} data-id="6pyo1sv8s" data-path="src/App.tsx" />
                <Route path="/login" element={<LoginPage data-id="ylldmwpb5" data-path="src/App.tsx" />} data-id="y0mmqfvdw" data-path="src/App.tsx" />
                
                <Route path="/dashboard" element={
                <MockProtectedRoute data-id="m3n14p8xr" data-path="src/App.tsx">
                    <StudentDashboard data-id="ppz1hr7kl" data-path="src/App.tsx" />
                  </MockProtectedRoute>
                } data-id="xtbmseuho" data-path="src/App.tsx" />
                
                <Route path="/exam/:examId" element={
                <MockProtectedRoute data-id="6zho35qis" data-path="src/App.tsx">
                    <MultiSectionExamInterface data-id="jv7lpqooo" data-path="src/App.tsx" />
                  </MockProtectedRoute>
                } data-id="wfpx904t0" data-path="src/App.tsx" />
                
                <Route path="/results/:examId" element={
                <MockProtectedRoute data-id="150h50s2b" data-path="src/App.tsx">
                    <ExamResults data-id="3g29mkye6" data-path="src/App.tsx" />
                  </MockProtectedRoute>
                } data-id="gqtcieuqc" data-path="src/App.tsx" />
                
                <Route path="/rankings" element={
                <MockProtectedRoute data-id="9g668m41q" data-path="src/App.tsx">
                    <StudentRankings data-id="ecmsvl70z" data-path="src/App.tsx" />
                  </MockProtectedRoute>
                } data-id="cqfpd7tqz" data-path="src/App.tsx" />
                
                <Route path="/admin" element={
                <MockProtectedRoute requireAdmin={true} data-id="962r01vus" data-path="src/App.tsx">
                    <AdminDashboard data-id="88v1326fx" data-path="src/App.tsx" />
                  </MockProtectedRoute>
                } data-id="qzew9ia05" data-path="src/App.tsx" />

                <Route path="*" element={<NotFound data-id="dyocrvtok" data-path="src/App.tsx" />} data-id="n5br2k8wf" data-path="src/App.tsx" />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>);

};

export default App;