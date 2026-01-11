import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import StudentPage from "./pages/StudentPage";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
