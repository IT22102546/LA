import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  History,
  Clock,
  Calendar,
  Car,
  Users,
  DollarSign,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserPlus,
  BookOpen,
  Group,
  BookCopy,
  PersonStandingIcon,
  PersonStanding,
  BookOpenText,
  BookAIcon,
  UserCheck,
  MessageCircle,
} from "lucide-react";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState();
  const [expandedSections, setExpandedSections] = useState({
    employees: false,
    finance: false,
    registration: false,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    dispatch(signOut());
    navigate("/");
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigationItems = [
    {
      id: "profile",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/?tab=profile",
    },
    {
      id: "transfers",
      label: "Mutual Transfer",
      icon: ArrowLeftRight,
      href: "/?tab=transfers",
    },
    { id: "bookings", label: "History", icon: History, href: "/?tab=bookings" },
  ];

  const chatItems = [
    {
      id: "chat",
      label: "Admin Chat",
      icon: MessageCircle,
      href: "/?tab=admin-chat",
    },
    {
      id: "approve-chat",  
      label: "Approve Chat",
      icon: MessageCircle,
      href: "/?tab=approve-chat",
    },
  ];

  const registrationItems = [
    {
      id: "student-enrollment",
      label: "Student Enrollment",
      icon: UserCheck,
      href: "/?tab=student-enrollment",
    },
    {
      id: "grade",
      label: "Grade",
      icon: ChevronRight,
      href: "/?tab=grade",
    },
    {
      id: "medium",
      label: "Medium",
      icon: ChevronRight,
      href: "/?tab=medium",
    },
    {
      id: "districts",
      label: "Districts",
      icon: ChevronRight,
      href: "/?tab=districts",
    },
    {
      id: "zones",
      label: "Zones",
      icon: ChevronRight,
      href: "/?tab=zones",
    },
  ];

  const academicItems = [
    {
      id: "student-attendance",
      label: "Student Attendance",
      icon: Clock,
      href: "/?tab=student-attendance",
    },
    {
      id: "exam",
      label: "Exams Creation",
      icon: BookOpen,
      href: "/?tab=exam",
    },
    {
      id: "allocations",
      label: "Allocations",
      icon: Calendar,
      href: "/?tab=allocations",
    },
    {
      id: "seminar",
      label: "Seminar",
      icon: Users,
      href: "/?tab=seminar",
    },
    {
      id: "publications",
      label: "Publications",
      icon: BookCopy,
      href: "/?tab=publications",
    },
    {
      id: "class-management",
      label: "Class Management",
      icon: BookOpenText,
      href: "/?tab=class-management",
    },
    {
      id: "subject-management",
      label: "Subject Management",
      icon: BookAIcon,
      href: "/?tab=subject-management",
    },
  ];

  const SidebarItem = ({ item, isActive }) => {
    const content = (
      <div
        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-sidebar-active text-primary font-medium"
            : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
        }`}
        onClick={item.expandable ? () => toggleSection(item.id) : undefined}
      >
        <div className="flex items-center gap-3">
          <item.icon
            className={`h-5 w-5 ${
              isActive
                ? "text-primary"
                : "text-sidebar-text-muted group-hover:text-sidebar-text"
            }`}
          />
          <span className="text-sm">{item.label}</span>
        </div>
        {item.expandable &&
          (item.expanded ? (
            <ChevronDown className="h-4 w-4 text-sidebar-text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-sidebar-text-muted" />
          ))}
      </div>
    );

    if (item.expandable) {
      return <div className="cursor-pointer">{content}</div>;
    }

    return (
      <Link to={item.href} className="block">
        {content}
      </Link>
    );
  };

  SidebarItem.propTypes = {
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      href: PropTypes.string,
      expandable: PropTypes.bool,
      expanded: PropTypes.bool,
    }).isRequired,
    isActive: PropTypes.bool.isRequired,
  };

  return (
    <div className="w-full md:w-64 bg-sidebar-background border-r border-border h-full flex flex-col">
      {/* Navigation Content */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Navigations Section */}
        <div>
          <h3 className="text-xs font-medium text-sidebar-section uppercase tracking-wider mb-2 px-2">
            Navigations
          </h3>
          <div className="space-y-0.5">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={tab === item.id}
              />
            ))}
          </div>
        </div>

        {/* New Registration Section */}
        <div>
          <h3 className="text-xs font-medium text-sidebar-section uppercase tracking-wider mb-2 px-2">
            Registration
          </h3>
          <div className="space-y-0.5">
            {/* Registration Main Item (Expandable) */}
            <div
              className="cursor-pointer"
              onClick={() => toggleSection("registration")}
            >
              <div
                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-all duration-200 group ${
                  tab?.startsWith("registration")
                    ? "bg-sidebar-active text-primary font-medium"
                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserPlus
                    className={`h-5 w-5 ${
                      tab?.startsWith("registration")
                        ? "text-primary"
                        : "text-sidebar-text-muted group-hover:text-sidebar-text"
                    }`}
                  />
                  <span className="text-sm">Registration</span>
                </div>
                {expandedSections.registration ? (
                  <ChevronDown className="h-4 w-4 text-sidebar-text-muted" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-sidebar-text-muted" />
                )}
              </div>
            </div>

            {/* Registration Dropdown Items */}
            {expandedSections.registration && (
              <div className="ml-4 space-y-0.5 border-l border-border pl-2">
                {registrationItems.map((item) => (
                  <Link key={item.id} to={item.href} className="block">
                    <div
                      className={`flex items-center gap-3 w-full px-4 py-1.5 rounded-lg transition-all duration-200 group ${
                        tab === item.id
                          ? "bg-sidebar-active text-primary font-medium"
                          : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 ${
                          tab === item.id
                            ? "text-primary"
                            : "text-sidebar-text-muted group-hover:text-sidebar-text"
                        }`}
                      />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Chat Section */}
        <div>
          <h3 className="text-xs font-medium text-sidebar-section uppercase tracking-wider mb-2 px-2">
            Chats
          </h3>
          <div className="space-y-0.5">
            {chatItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={tab === item.id}
              />
            ))}
          </div>
        </div>

        {/* Academic Section */}
        <div>
          <h3 className="text-xs font-medium text-sidebar-section uppercase tracking-wider mb-2 px-2">
            Academic
          </h3>
          <div className="space-y-0.5">
            {academicItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={tab === item.id}
              />
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="pt-4 border-t border-border sticky bottom-0 bg-sidebar-background">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 text-sidebar-text-muted group-hover:text-sidebar-text" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}