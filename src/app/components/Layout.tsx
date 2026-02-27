import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, FileText, DollarSign, User, LogOut } from 'lucide-react';
import { getCurrentUser, logout } from '../lib/auth';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/performance', icon: FileText, label: '绩效' },
    { path: '/salary', icon: DollarSign, label: '薪资' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">绩效薪资系统</h1>
            <p className="text-xs text-gray-500">
              {currentUser?.name} · {currentUser?.role === 'employee' ? '员工' : currentUser?.role === 'leader' ? '领导' : '财务'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="退出登录"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center py-2 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
