'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  ArrowLeftRight,
  History,
  Clock,
  Calendar,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserPlus,
  BookOpen,
  BookCopy,
  BookOpenText,
  BookAIcon,
  UserCheck,
  MessageCircle,
} from "lucide-react";

export default function DashSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const { signOut } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    registration: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const navigationItems = [
    {
      id: "profile",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard?tab=profile",
    },
    {
      id: "transfers",
      label: "Mutual Transfer",
      icon: ArrowLeftRight,
      href: "/dashboard?tab=transfers",
    },
    { id: "bookings", label: "History", icon: History, href: "/dashboard?tab=bookings" },
  ];

  const chatItems = [
    {
      id: "admin-chat",
      label: "Admin Chat",
      icon: MessageCircle,
      href: "/dashboard?tab=admin-chat",
    },
    {
      id: "approve-chat",
      label: "Approve Chat",
      icon: MessageCircle,
      href: "/dashboard?tab=approve-chat",
    },
  ];

  const registrationItems = [
    {
      id: "student-enrollment",
      label: "Student Enrollment",
      icon: UserCheck,
      href: "/dashboard?tab=student-enrollment",
    },
    {
      id: "grade",
      label: "Grade",
      icon: ChevronRight,
      href: "/dashboard?tab=grade",
    },
    {
      id: "medium",
      label: "Medium",
      icon: ChevronRight,
      href: "/dashboard?tab=medium",
    },
    {
      id: "districts",
      label: "Districts",
      icon: ChevronRight,
      href: "/dashboard?tab=districts",
    },
    {
      id: "zones",
      label: "Zones",
      icon: ChevronRight,
      href: "/dashboard?tab=zones",
    },
  ];

  const academicItems = [
    {
      id: "student-attendance",
      label: "Student Attendance",
      icon: Clock,
      href: "/dashboard?tab=student-attendance",
    },
    {
      id: "exam",
      label: "Exams Creation",
      icon: BookOpen,
      href: "/dashboard?tab=exam",
    },
    {
      id: "allocations",
      label: "Allocations",
      icon: Calendar,
      href: "/dashboard?tab=allocations",
    },
    {
      id: "seminar",
      label: "Seminar",
      icon: Users,
      href: "/dashboard?tab=seminar",
    },
    {
      id: "publications",
      label: "Publications",
      icon: BookCopy,
      href: "/dashboard?tab=publications",
    },
    {
      id: "class-management",
      label: "Class Management",
      icon: BookOpenText,
      href: "/dashboard?tab=class-management",
    },
    {
      id: "subject-management",
      label: "Subject Management",
      icon: BookAIcon,
      href: "/dashboard?tab=subject-management",
    },
  ];

  if (collapsed) {
    return null;
  }

  return (
    <div className="w-full md:w-64 bg-background border-r border-border h-full flex flex-col">
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Navigations
          </h3>
          <div className="space-y-0.5">
            {navigationItems.map((item) => (
              <Link key={item.id} href={item.href} className="block">
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all duration-200 ${
                    tab === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Registration
          </h3>
          <div className="space-y-0.5">
            <div
              className="cursor-pointer"
              onClick={() => toggleSection("registration")}
            >
              <div className="flex items-center justify-between w-full px-4 py-2 rounded-lg transition-all duration-200 hover:bg-muted">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm">Registration</span>
                </div>
                {expandedSections.registration ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>

            {expandedSections.registration && (
              <div className="ml-4 space-y-0.5 border-l border-border pl-2">
                {registrationItems.map((item) => (
                  <Link key={item.id} href={item.href} className="block">
                    <div
                      className={`flex items-center gap-3 w-full px-4 py-1.5 rounded-lg transition-all duration-200 ${
                        tab === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Chats
          </h3>
          <div className="space-y-0.5">
            {chatItems.map((item) => (
              <Link key={item.id} href={item.href} className="block">
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all duration-200 ${
                    tab === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Academic
          </h3>
          <div className="space-y-0.5">
            {academicItems.map((item) => (
              <Link key={item.id} href={item.href} className="block">
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all duration-200 ${
                    tab === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border sticky bottom-0 bg-background">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
