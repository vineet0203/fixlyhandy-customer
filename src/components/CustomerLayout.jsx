import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { useState, useEffect } from 'react';
import { getCustomerUnreadCount } from '../api/customerPortal';

const SIDEBAR_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', roles: ['customer'], icon: 'dashboard' },
  { path: '/quotes', label: 'Quotes', roles: ['customer'], icon: 'quotes' },
  { path: '/service-requests', label: 'Service Requests', roles: ['customer'], icon: 'service-requests' },
  { path: '/jobs', label: 'Jobs', roles: ['customer'], icon: 'jobs' },
  { path: '/invoices', label: 'Invoices', roles: ['customer'], icon: 'invoices' },
  { path: '/messages', label: 'Messages', roles: ['customer'], icon: 'messages' },
];

const CustomerLayout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'customer';
  const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem('customer_profile') || '{}'));
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const sync = () => {
    const fresh = JSON.parse(localStorage.getItem('customer_profile') || '{}');
    setCustomer(fresh);
  };
  sync();
  window.addEventListener('customer_profile_updated', sync);
  window.addEventListener('storage', sync);
  return () => {
    window.removeEventListener('customer_profile_updated', sync);
    window.removeEventListener('storage', sync);
  };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await getCustomerUnreadCount();
      setUnreadCount(data.data?.count || 0);
    } catch (e) {
      console.error('Error fetching unread count:', e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    
    const handleUpdate = () => {
      fetchUnreadCount();
    };
    window.addEventListener('customer-messages-updated', handleUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('customer-messages-updated', handleUpdate);
    };
  }, []);

  const allowedItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_profile');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  return (
    <div className="customer-app-layout">
      <aside className="customer-sidebar">
        <div className="customer-brand">FIXLYHANDY</div>

        <nav className="customer-nav">
          {allowedItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `customer-nav-item${isActive ? ' is-active' : ''}`
              }
            >
              <span className="customer-nav-icon" aria-hidden="true">
                {item.icon === 'dashboard' && (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                )}
                {item.icon === 'quotes' && (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M4 4h16v12H7l-3 3V4zm3 5h10v2H7V9zm0-3h10v2H7V6zm0 6h6v2H7v-2z" />
                  </svg>
                )}
                {item.icon === 'service-requests' && (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                )}
                {item.icon === 'jobs' && (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M10 4h4a2 2 0 012 2v2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 012-2h4V6a2 2 0 012-2zm0 4h4V6h-4v2z" />
                  </svg>
                )}
                {item.icon === 'invoices' && (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
                  </svg>
                )}
                {item.icon === 'messages' && (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                  </svg>
                )}
              </span>
              {item.label}
              {item.icon === 'messages' && unreadCount > 0 && (
                <span className="customer-unread-badge" style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginLeft: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '12px',
                  height: '14px'
                }}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button className="customer-logout" type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="customer-main-layout">
        <header className="customer-topbar">
          <div />
          <div className="customer-topbar-actions">
            <NotificationDropdown />
            <div className="customer-profile-pill">
              <span className="customer-profile-avatar">
                {customer?.profile_photo
                  ? <img src={customer.profile_photo} alt="avatar" style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} />
                  : (customer?.name || 'C').slice(0, 1).toUpperCase()
                }
              </span>
              <span className="customer-profile-text">
                <span className="customer-profile-name">{customer?.name || 'Customer'}</span>
                <span className="customer-profile-email">{customer?.email || 'customer@fixlyhandy.com'}</span>
              </span>
            </div>
          </div>
        </header>

        <section className="customer-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default CustomerLayout;
