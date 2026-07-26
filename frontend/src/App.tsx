import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CitizenPortal from "./pages/CitizenPortal";
import OfficerDashboard from "./pages/OfficerDashboard";
import CaseDetail from "./pages/CaseDetail";
import FIRLodging from "./pages/FIRLodging";
import Dashboard from "./pages/Dashboard";
import GenerateReport from "./pages/GenerateReport";
import BNSRecommend from "./pages/BNSRecommendation";
import ExplainAI from "./pages/ExplainableAI";
import TrackFIR from "./pages/TrackFirStatus";

export default function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route
          path="/citizen"
          element={
            user?.role === "citizen" ? <CitizenPortal /> : <Navigate to="/" />
          }
        />
        <Route
          path="/officer/dashboard"
          element={
            user?.role === "officer" ? (
              <OfficerDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/officer/case/:id"
          element={
            user?.role === "officer" ? <CaseDetail /> : <Navigate to="/" />
          }
        />
        <Route path="/fir-chat" element={<FIRLodging />} />
        <Route path="/generate-report" element={<GenerateReport />} />
        <Route path="/bns" element={<BNSRecommend />} />
        <Route path="/explain" element={<ExplainAI />} />
        <Route path="/track" element={<TrackFIR />} />
      </Routes>
    </BrowserRouter>
  );
}
