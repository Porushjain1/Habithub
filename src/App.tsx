import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Spreadsheet } from "./pages/Spreadsheet";
import { Analytics } from "./pages/Analytics";
import { Calendar } from "./pages/Calendar";
import { Heatmap } from "./pages/Heatmap";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="spreadsheet" element={<Spreadsheet />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="heatmap" element={<Heatmap />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


