import { useState, useEffect, useRef } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api/customerPortal';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const dropRef = useRef(null);

  const load = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnread(data.unread_count || 0);
    } catch {}
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnread(0);
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  return (
    <div className="notif-wrap" ref={dropRef}>
      <button className="customer-icon-button notif-bell-btn" onClick={() => setOpen(o => !o)} aria-label="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Notifications</span>
            {unread > 0 && <button className="notif-read-all" onClick={handleReadAll}>Mark all read</button>}
          </div>
          <div className="notif-list">
            {notifications.length === 0 && (
              <div className="notif-empty">No notifications yet</div>
            )}
            {notifications.map(n => (
              <div key={n.id} className={`notif-item${n.is_read ? '' : ' notif-unread'}`}
                onClick={() => !n.is_read && handleRead(n.id)}>
                <div className="notif-dot" />
                <div className="notif-content">
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-msg">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
