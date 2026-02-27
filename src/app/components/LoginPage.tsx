import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockEmployees } from '../lib/mockData';
import { login } from '../lib/auth';
import { Smartphone, LogIn } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [selectedPhone, setSelectedPhone] = useState('');

  const handleLogin = () => {
    const user = mockEmployees.find(emp => emp.phone === selectedPhone);
    if (user) {
      login(user);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            员工绩效薪资管理系统
          </h1>
          <p className="text-gray-600">选择手机号一键登录（演示模式）</p>
        </div>

        <div className="space-y-4">
          {mockEmployees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedPhone(emp.phone)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedPhone === emp.phone
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.phone}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {emp.department} · {emp.position}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      emp.role === 'employee'
                        ? 'bg-gray-100 text-gray-800'
                        : emp.role === 'leader'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {emp.role === 'employee'
                      ? '员工'
                      : emp.role === 'leader'
                      ? '领导'
                      : '财务'}
                  </span>
                  {selectedPhone === emp.phone && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogin}
          disabled={!selectedPhone}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <LogIn className="w-5 h-5" />
          一键登录
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          💡 演示提示：选择不同账号体验不同角色功能
        </p>
      </div>
    </div>
  );
}
