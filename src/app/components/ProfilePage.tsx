import { useNavigate } from 'react-router';
import { getCurrentUser, logout } from '../lib/auth';
import { mockEmployees } from '../lib/mockData';
import { User, Briefcase, Calendar, Phone, LogOut, ChevronRight } from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  if (!currentUser) return null;

  const employee = mockEmployees.find(e => e.id === currentUser.id);
  
  if (!employee) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'employee':
        return { text: '员工', color: 'bg-gray-100 text-gray-800' };
      case 'leader':
        return { text: '领导', color: 'bg-purple-100 text-purple-800' };
      case 'finance':
        return { text: '财务', color: 'bg-green-100 text-green-800' };
      default:
        return { text: '未知', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const roleDisplay = getRoleDisplay(employee.role);

  return (
    <div className="p-4 space-y-4">
      {/* 个人信息卡片 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{employee.name}</h2>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${roleDisplay.color}`}>
                {roleDisplay.text}
              </span>
              <span className="text-sm opacity-90">{employee.employeeNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">基本信息</h3>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="px-4 py-3 flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">部门</div>
              <div className="text-sm font-medium text-gray-900">{employee.department}</div>
            </div>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">职位</div>
              <div className="text-sm font-medium text-gray-900">{employee.position}</div>
            </div>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">手机号</div>
              <div className="text-sm font-medium text-gray-900">{employee.phone}</div>
            </div>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">入职日期</div>
              <div className="text-sm font-medium text-gray-900">{employee.entryDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      {currentUser.role === 'leader' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">管理功能</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-900">团队管理</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-900">绩效设置</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {currentUser.role === 'finance' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">财务功能</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-900">薪资设置</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => alert('导出Excel报表功能（演示）')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-900">数据导出</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* 退出登录 */}
      <button
        onClick={handleLogout}
        className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">退出登录</span>
      </button>

      {/* 版本信息 */}
      <div className="text-center text-xs text-gray-400 py-4">
        <div>员工绩效薪资管理系统 v1.0</div>
        <div className="mt-1">演示版本 · 数据仅保存在本地</div>
      </div>
    </div>
  );
}
