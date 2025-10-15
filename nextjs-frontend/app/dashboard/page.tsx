'use client';

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashHeader from "@/components/dashboard/dash-header";
import DashSidebar from "@/components/dashboard/dash-sidebar";

function DashboardContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <DashHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex h-[calc(100vh-4rem)]">
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-14"
          } transition-all duration-300 overflow-hidden border-r border-border`}
        >
          <DashSidebar collapsed={!sidebarOpen} />
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {!tab && (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Welcome to LearnUp Admin Panel
                </h1>
                <p className="text-muted-foreground">
                  Select an option from the sidebar to get started
                </p>
              </div>
            )}

            {tab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <p className="text-muted-foreground">Dashboard content goes here</p>
              </div>
            )}

            {tab === "transfers" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Mutual Transfer</h2>
                <p className="text-muted-foreground">Transfer management content</p>
              </div>
            )}

            {tab === "grade" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Grade Management</h2>
                <p className="text-muted-foreground">Grade management content</p>
              </div>
            )}

            {tab === "medium" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Medium Management</h2>
                <p className="text-muted-foreground">Medium management content</p>
              </div>
            )}

            {tab === "districts" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Districts Management</h2>
                <p className="text-muted-foreground">Districts management content</p>
              </div>
            )}

            {tab === "zones" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Zones Management</h2>
                <p className="text-muted-foreground">Zones management content</p>
              </div>
            )}

            {tab === "student-attendance" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Student Attendance</h2>
                <p className="text-muted-foreground">Attendance tracking content</p>
              </div>
            )}

            {tab === "exam" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Exams Creation</h2>
                <p className="text-muted-foreground">Exam creation content</p>
              </div>
            )}

            {tab === "allocations" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Allocations</h2>
                <p className="text-muted-foreground">Allocation management content</p>
              </div>
            )}

            {tab === "seminar" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Seminar</h2>
                <p className="text-muted-foreground">Seminar management content</p>
              </div>
            )}

            {tab === "publications" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Publications</h2>
                <p className="text-muted-foreground">Publications content</p>
              </div>
            )}

            {tab === "class-management" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Class Management</h2>
                <p className="text-muted-foreground">Class management content</p>
              </div>
            )}

            {tab === "subject-management" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Subject Management</h2>
                <p className="text-muted-foreground">Subject management content</p>
              </div>
            )}

            {tab === "student-enrollment" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Student Enrollment</h2>
                <p className="text-muted-foreground">Student enrollment content</p>
              </div>
            )}

            {tab === "student-profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
                <p className="text-muted-foreground">Student profile content</p>
              </div>
            )}

            {tab === "admin-chat" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Admin Chat</h2>
                <p className="text-muted-foreground">Admin chat content</p>
              </div>
            )}

            {tab === "approve-chat" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Approve Chat</h2>
                <p className="text-muted-foreground">Chat approval content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
