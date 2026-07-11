import { BrowserRouter, Routes, Route } from "react-router-dom";
import FIRLodging from "./pages/FIRLodging";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FIRLodging />} />
        <Route path="/fir" element={<FIRLodging />} />
      </Routes>
    </BrowserRouter>
  );
}
