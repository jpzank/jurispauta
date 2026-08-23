import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calendario from "./pages/Calendario";
import NotFound from "./pages/NotFound";

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
