import { useState } from "react";
import { useNavigate } from "react-router";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { useNotifications, useMarkRead, useMarkAllRead } from "../hooks/useNotifications";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data } = useNotifications();
  const markReadMutation = useMarkRead();
  const markAllReadMutation = useMarkAllRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleClick = (n) => {
    if (!n.read) markReadMutation.mutate(n._id);
    if (n.link) {
      setOpen(false);
      navigate(n.link);
    }
  };

  return (
    <div className="relative">
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <div className="indicator">
          <BellIcon className="size-5" />
          {unreadCount > 0 && (
            <span className="badge badge-xs badge-error indicator-item">{unreadCount}</span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-base-100 rounded-box shadow-xl border border-base-300 z-50">
          <div className="flex items-center justify-between p-3 border-b border-base-300">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <button
                className="btn btn-ghost btn-xs gap-1"
                onClick={() => markAllReadMutation.mutate()}
              >
                <CheckCheckIcon className="size-3" /> Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm opacity-60">No notifications yet</div>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`w-full text-left p-3 border-b border-base-200 hover:bg-base-200 ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.message && <p className="text-xs opacity-70">{n.message}</p>}
                    <p className="text-[10px] opacity-50 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
