import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashHeader from "../Components/DashHeader";
import DashTransfers from "../Components/Pages/Registration/DashTransfers";
import DashSideBar from "../Components/DashSideBar";
import DashGrade from "../Components/Pages/Registration/DashGrade";
import DashMedium from "../Components/Pages/Registration/DashMedium";
import DashDistricts from "../Components/Pages/Registration/DashDistricts";
import DashZones from "../Components/Pages/Registration/DashZones";
import DashStudentAttendance from "../Components/Pages/Academic/DashStudentAttendance";
import DashExams from "../Components/Pages/Academic/DashExams";
import DashAllocations from "../Components/Pages/Academic/DashAllocations";
import DashSeminar from "../Components/Pages/Academic/DashSeminar";
import DashPublications from "../Components/Pages/Academic/DashPublications";
import DashClassManagement from "../Components/Pages/Academic/DashClassManagement";
import DashSubjects from "../Components/Pages/Academic/DashSubjects";
import DashStudentEnrollement from "../Components/Pages/Academic/DashStudentEnrollement";
import DashStudentProfile from "../Components/Pages/Academic/DashStudentProfile";
import AdminChat from "../Components/Pages/chat/AdminChat";
import ChatApprove from "../Components/Pages/chat/ChatApprove";

export default function DashBoard() {
  const location = useLocation();
  const [tab, setTab] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-background">
      <DashHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-14"
          } transition-all duration-300 overflow-hidden border-r border-border`}
        >
          <DashSideBar collapsed={!sidebarOpen} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {tab === "transfers" && <DashTransfers />}
          {tab === "grade" && <DashGrade />}
          {tab === "medium" && <DashMedium />}
          {tab === "districts" && <DashDistricts />}
          {tab === "zones" && <DashZones />}
          {tab === "student-attendance" && <DashStudentAttendance />}
          {tab === "exam" && <DashExams />}
          {tab === "allocations" && <DashAllocations />}
          {tab === "seminar" && <DashSeminar />}
          {tab === "publications" && <DashPublications />}
          {tab === "class-management" && <DashClassManagement />}
          {tab === "subject-management" && <DashSubjects />}
          {tab === "student-enrollment" && <DashStudentEnrollement />}
          {tab === "student-profile" && <DashStudentProfile />}
          {tab === "admin-chat" && <AdminChat />}
          {tab === "approve-chat" && <ChatApprove/>}
        </div>
      </div>
    </div>
  );
}
