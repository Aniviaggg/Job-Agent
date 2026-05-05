import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const links: Array<any> = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/job-postings', label: '投递记录', icon: 'briefcase' },
  { to: '/resumes', label: '简历管理', icon: 'file' },
  {
    label: '面试',
    icon: 'calendar',
    children: [
      { to: '/interview-prep', label: '面试准备', icon: 'calendar' },
      { to: '/mock-interview', label: '模拟面试', icon: 'play' },
    ],
  },
  { to: '/career-plan', label: '职业规划', icon: 'compass' },
];

const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const common = `w-5 h-5 ${className || ''}`;
  switch (name) {
    case 'dashboard':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 3H8v4h8V3z" />
        </svg>
      );
    case 'file':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case 'play':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case 'compass':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8l-6 4-4 6 6-4 4-6z" />
        </svg>
      );
    default:
      return null;
  }
};

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = (to: string) => {
    if (!to) return false;
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((s) => ({ ...s, [label]: !s[label] }));
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r transition-width duration-150 flex flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && <h1 className="text-lg font-semibold">面试准备平台</h1>}
          <button
            aria-label="折叠侧边栏"
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setCollapsed((s) => !s)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" transform={collapsed ? 'rotate(180 12 12)' : undefined} />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.name ? user.name.slice(0,1).toUpperCase() : '访'}
              </div>
            )}

            {!collapsed && (
              <div>
                <div className="font-medium">{user?.name || '访客'}</div>
                <div className="text-xs text-gray-500 truncate" style={{ maxWidth: 160 }}>{user?.email || ''}</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => logout()} className="text-sm text-red-500 hover:underline">登出</button>
              <div className="text-xs text-gray-500">v1.0</div>
            </div>
          )}
        </div>

        <nav className="p-2 flex-1 overflow-auto">
          <ul className="space-y-1">
            {links.map((l) => {
              if (l.children) {
                const open = openGroups[l.label];
                return (
                  <li key={l.label}>
                    <div
                      onClick={() => toggleGroup(l.label)}
                      className={`group flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${open ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                    >
                      <Icon name={l.icon} className={`text-gray-600 group-hover:text-gray-800 transition-transform ${open ? 'transform rotate-3' : ''}`} />
                      {!collapsed && <span className="flex-1 font-medium">{l.label}</span>}
                      {!collapsed && (
                        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      )}
                    </div>
                    <ul className={`${open ? 'block' : 'hidden'} mt-1 pl-6`}> 
                      {l.children.map((c: any) => {
                        const active = isActive(c.to);
                        return (
                          <li key={c.to}>
                            <Link
                              to={c.to}
                              title={c.label}
                              className={`group flex items-center gap-3 px-3 py-2 rounded ${active ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              <Icon name={c.icon} className={`text-gray-500 group-hover:text-gray-700 ${active ? 'text-white' : ''} transition-transform`} />
                              {!collapsed && <span className="flex-1">{c.label}</span>}
                              {!collapsed && active && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Active</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }

              const active = isActive(l.to);
              return (
                <li key={l.to} className="relative group">
                  <Link
                    to={l.to}
                    title={l.label}
                    className={`flex items-center gap-3 px-3 py-2 rounded ${active ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Icon name={l.icon} className={`text-gray-600 ${active ? 'text-white' : ''} transition-transform group-hover:translate-x-0.5`} />
                    {!collapsed && <span className="flex-1">{l.label}</span>}
                    {!collapsed && active && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Active</span>}
                  </Link>

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-10">
                      <div className="bg-black text-white text-xs rounded px-2 py-1 shadow">{l.label}</div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
