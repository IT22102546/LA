import { Search, Bell, Menu, X } from "lucide-react";
import SxButton from "./ui/SxButton";

import PropTypes from "prop-types";

const DashHeader = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4">
      {/* Left side - Toggle and Logo */}
      <div className="flex items-center gap-4">
        <SxButton
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className=""
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </SxButton>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-white transform rotate-45 rounded-sm"></div>
          </div>
          <span className="text-lg font-semibold text-foreground">
            Learn App
          </span>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            placeholder="Ctrl + K"
            className="pl-10 bg-muted/50 border-0 focus:bg-background w-full h-10 rounded-md outline-none"
          />
        </div>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-3">
        <SxButton variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </SxButton>

        <SxButton variant="ghost" size="icon" className="relative">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-sm font-medium">SB</span>
          </div>
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
            ✓
          </span>
        </SxButton>
      </div>
    </header>
  );
};

export default DashHeader;

DashHeader.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
