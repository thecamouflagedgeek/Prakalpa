import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
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
import Right from "./pages/Rights";
import Emer from "./pages/Emergency";
import About from "./pages/About";
import District from "./pages/District";

export default function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
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
        <Route path="/right" element={<Right />} />
        <Route path="/emergency" element={<Emer />} />
        <Route path="/about" element={<About />} />
        <Route path="/dis" element={<District />} />
      </Routes>
    </BrowserRouter>
  );
}
