import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockEmployees } from '../lib/mockData';
import { login } from '../lib/auth';
import { Smartphone, LogIn, Send } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [selectedPhone, setSelectedPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    const user = mockEmployees.find(emp => emp.phone === selectedPhone);
    if (user) {
      // 模拟一键登录流程
      setIsLoading(true);
      setTimeout(() => {
        login(user);
        navigate('/');
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleOneClickLogin = (emp: any) => {
    setSelectedPhone(emp.phone);
    // 模拟一键登录流程
    setIsLoading(true);
    setTimeout(() => {
      login(emp);
      navigate('/');
      setIsLoading(false);
    }, 1000);
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
          <p className="text-gray-600">手机号一键登录</p>
        </div>

        <div className="space-y-4">
          {mockEmployees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => handleOneClickLogin(emp)}
              className="w-full p-4 rounded-lg border-2 transition-all border-gray-200 hover:border-blue-400 hover:bg-blue-50"
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
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>登录说明：</strong>
          </div>
          <div className="text-xs text-blue-700 mt-2 space-y-1">
            <div>• 选择任意账号即可一键登录</div>
            <div>• 不同账号对应不同角色权限</div>
            <div>• 演示模式，无需真实手机号验证</div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 员工绩效薪资管理系统
        </p>
      </div>
    </div>
  );
}
