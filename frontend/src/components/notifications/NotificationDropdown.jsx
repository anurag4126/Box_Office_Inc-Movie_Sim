import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await api.get("/notifications");
      const list = Array.isArray(res.data?.notifications)
        ? res.data.notifications
        : [];

      setNotifications(list.slice(0, 6));
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, [loadNotifications]);

  return (
    <div
      className="
      absolute
      right-0
      top-12
      w-96
      bg-[#0f172a]
      border
      border-slate-800
      rounded-2xl
      shadow-2xl
      z-50
      overflow-hidden
    "
    >
      <div className="p-4 border-b border-slate-800">
        <h2 className="font-bold text-white">Notifications</h2>
      </div>

      <div className="max-h-112.5 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-slate-400">Loading...</p>
        ) : error ? (
          <p className="p-4 text-sm text-slate-400">
            Couldn't load notifications. Please try again.
          </p>
        ) : notifications.length === 0 ? (
          <p className="p-4 text-sm text-slate-400">You're all caught up.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className="
              p-4
              border-b
              border-slate-800
              hover:bg-slate-800/50
            "
            >
              <p className="text-sm text-white">{n.message}</p>

              <p className="text-xs text-slate-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <Link
        to="/notifications"
        className="block p-3 text-center text-sm text-violet-400 hover:text-violet-300 border-t border-slate-800"
      >
        View all notifications
      </Link>
    </div>
  );
};

export default NotificationDropdown;
