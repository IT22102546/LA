import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashBoard from "./Pages/DashBoard";
import DashBooking from "./Components/DashBooking";
import TeacherSignIn from "./Pages/TeacherSignIn";
import ChatApprove from "./Components/Pages/chat/ChatApprove";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/teacher-sign-in" element={<TeacherSignIn />} />
        <Route path="/bookings" element={<DashBooking />} />
         <Route path="/approve-chat" element={<ChatApprove />} />
      </Routes>
    </BrowserRouter>
  );
}
