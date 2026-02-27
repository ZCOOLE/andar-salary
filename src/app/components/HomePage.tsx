import { useNavigate } from 'react-router';
import { getCurrentUser } from '../lib/auth';
import { getStorageData, initPerformanceData, getCurrentYearMonth, mockEmployees, type Performance } from '../lib/mockData';
import { FileText, DollarSign, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const performances = getStorageData<Performance[]>('performances', initPerformanceData);
  const currentMonth = getCurrentYearMonth();

  if (!currentUser) return null;

  // 根据角色显示不同内容
  if (currentUser.role === 'employee') {
    return <EmployeeHome performances={performances} currentMonth={currentMonth} userId={currentUser.id} />;
  } else if (currentUser.role === 'leader') {
    return <LeaderHome performances={performances} currentMonth={currentMonth} />;
  } else if (currentUser.role === 'finance') {
    return <FinanceHome performances={performances} />;
  }

  return null;
}

function EmployeeHome({ performances, currentMonth, userId }: { performances: Performance[]; currentMonth: string; userId: number }) {
  const navigate = useNavigate();
  const myPerformance = performances.find(p => p.employeeId === userId && p.yearMonth === currentMonth);

  const getStatusDisplay = () => {
    if (!myPerformance) {
      return { icon: AlertCircle, text: '待初始化', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
    if (myPerformance.status === 'pending_self') {
      return { icon: Clock, text: '待自评', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    }
    if (myPerformance.status === 'pending_leader') {
      return { icon: Clock, text: '待领导评估', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    }
    return { icon: CheckCircle, text: '已完成', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div className="p-4 space-y-4">
      {/* 问候 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-1">👋 你好，{getCurrentUser()?.name}</h2>
        <p className="text-blue-100 text-sm">今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* 本月绩效 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">📋 本月绩效</h3>
          <span className="text-xs text-gray-500">{currentMonth}</span>
        </div>
        
        <div className={`${status.bgColor} rounded-lg p-4 mb-4`}>
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
            <span className={`font-medium ${status.color}`}>状态: {status.text}</span>
          </div>
          
          {myPerformance?.selfScore && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">自评分数</span>
                <span className="font-semibold text-gray-900">{myPerformance.selfScore}分</span>
              </div>
              {myPerformance.leaderScore && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">领导评分</span>
                  <span className="font-semibold text-gray-900">{myPerformance.leaderScore}分</span>
                </div>
              )}
            </div>
          )}
        </div>

        {myPerformance?.status === 'pending_self' && (
          <button
            onClick={() => navigate('/performance/self-evaluate')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            立即填写
          </button>
        )}

        {myPerformance?.status === 'pending_leader' && (
          <div className="text-center text-sm text-gray-600 py-2">
            等待领导评估中...
          </div>
        )}

        {myPerformance?.status === 'completed' && (
          <button
            onClick={() => navigate('/performance')}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            查看详情
          </button>
        )}
      </div>

      {/* 快捷入口 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">📈 快捷入口</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/salary')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">工资历史</div>
          </button>
          <button
            onClick={() => navigate('/performance')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">绩效历史</div>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">个人信息</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function LeaderHome({ performances, currentMonth }: { performances: Performance[]; currentMonth: string }) {
  const navigate = useNavigate();
  const currentMonthPerf = performances.filter(p => p.yearMonth === currentMonth);
  const pendingCount = currentMonthPerf.filter(p => p.status === 'pending_leader').length;
  const completedCount = currentMonthPerf.filter(p => p.status === 'completed').length;
  const totalCount = currentMonthPerf.length;

  return (
    <div className="p-4 space-y-4">
      {/* 问候 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-1">👋 你好，{getCurrentUser()?.name}</h2>
        <p className="text-purple-100 text-sm">今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* 待办事项 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">⚡ 待办事项</h3>
          <span className="text-xs text-gray-500">{currentMonth}</span>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 mb-4">
          <div className="text-2xl font-bold text-yellow-900 mb-1">
            本月待评估: {pendingCount}人
          </div>
          <div className="flex items-center gap-4 text-sm text-yellow-700">
            <span>已评估: {completedCount}人</span>
            <span>|</span>
            <span>未评估: {pendingCount}人</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/performance/batch-assess')}
            className="py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            一键审批
          </button>
          <button
            onClick={() => navigate('/performance/assess-list')}
            className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            逐个审批
          </button>
        </div>
      </div>

      {/* 团队概览 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">👥 团队概览</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/performance')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">部门绩效</div>
          </button>
          <button
            onClick={() => navigate('/salary')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">薪资查询</div>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">员工管理</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function FinanceHome({ performances }: { performances: Performance[] }) {
  const navigate = useNavigate();
  const employees = mockEmployees.filter(e => e.role === 'employee');
  const confirmedCount = 60;
  const pendingCount = 26;

  return (
    <div className="p-4 space-y-4">
      {/* 问候 */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-1">👋 你好，{getCurrentUser()?.name}</h2>
        <p className="text-green-100 text-sm">今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* 数据概览 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">📊 数据概览</h3>
          <span className="text-xs text-gray-500">2026-02</span>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <div className="text-2xl font-bold text-green-900 mb-1">
            本月待确认薪资: {pendingCount}人
          </div>
          <div className="flex items-center gap-4 text-sm text-green-700">
            <span>已确认: {confirmedCount}人</span>
            <span>|</span>
            <span>待确认: {pendingCount}人</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/salary')}
            className="py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            查看详情
          </button>
          <button
            onClick={() => alert('导出Excel功能（演示）')}
            className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            导出报表
          </button>
        </div>
      </div>

      {/* 快捷操作 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">🛠️ 快捷操作</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/salary')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">薪资录入</div>
          </button>
          <button
            onClick={() => navigate('/salary')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">数据修改</div>
          </button>
          <button
            onClick={() => alert('导出Excel模板功能（演示）')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xs text-gray-900 font-medium">Excel导出</div>
          </button>
        </div>
      </div>
    </div>
  );
}
