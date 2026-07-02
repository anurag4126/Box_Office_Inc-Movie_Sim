import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

import api from "../api/axios";
import Sidebar from "../components/common/Sidebar";
import NotificationBell from "../components/notifications/NotificationBell";
import NotificationDropdown from "../components/notifications/NotificationDropdown";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationsRef = useRef(null);

  const loadUnreadCount = useCallback(async () => {
    try {
      const res = await api.get("/notifications/unread-count");

      setUnreadCount(res.data?.unreadCount || 0);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    if (!isNotificationsOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isNotificationsOpen]);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation: notifications on every screen, sidebar toggle on mobile */}
        <header
          className="flex items-center justify-between gap-4 p-4 shrink-0"
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 cursor-pointer md:hidden"
              style={{ color: "var(--muted)" }}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            <h1
              className="text-2xl font-bold md:hidden"
              style={{ color: "var(--primary)" }}
            >
              CineVerse
            </h1>
          </div>

          <div className="relative" ref={notificationsRef}>
            <NotificationBell
              unreadCount={unreadCount}
              onClick={() => setIsNotificationsOpen((open) => !open)}
            />

            {isNotificationsOpen && <NotificationDropdown />}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
