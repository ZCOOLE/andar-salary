import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';
import { getStorageData, initPerformanceData, getCurrentYearMonth, mockEmployees, type Performance } from '../lib/mockData';
import { canEvaluatePerformance } from '../lib/auth';

export function AssessListPage() {
  const navigate = useNavigate();
  const currentMonth = getCurrentYearMonth();
  const [performances] = useState(() => 
    getStorageData<Performance[]>('performances', initPerformanceData)
  );

  if (!canEvaluatePerformance()) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">无权限访问</h2>
        <p className="text-gray-600">只有领导可以访问绩效评估页面</p>
      </div>
    );
  }

  const pendingPerformances = performances.filter(
    p => p.yearMonth === currentMonth && p.status === 'pending_leader'
  );

  const handleAssess = (perfId: number) => {
    navigate(`/performance/assess/${perfId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">逐个评估</h1>
            <p className="text-xs text-gray-500">待评估 {pendingPerformances.length} 人</p>
          </div>
        </div>
      </header>

      {/* List */}
      <div className="p-4 space-y-3">
        {pendingPerformances.map((perf) => {
          const employee = mockEmployees.find(e => e.id === perf.employeeId);
          if (!employee) return null;

          return (
            <div
              key={perf.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{employee.name}</div>
                  <div className="text-xs text-gray-500">
                    {employee.department} · {employee.position}
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  待评估
                </span>
              </div>

              {perf.selfScore && (
                <>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">自评分数</span>
                      <span className="text-lg font-semibold text-gray-900">{perf.selfScore}分</span>
                    </div>
                    {perf.selfComment && (
                      <div className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-200">
                        {perf.selfComment}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAssess(perf.id)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    开始评估
                  </button>
                </>
              )}

              {!perf.selfScore && (
                <div className="text-center text-sm text-gray-500 py-2">
                  员工尚未完成自评
                </div>
              )}
            </div>
          );
        })}

        {pendingPerformances.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-3">✓</div>
            <div className="text-gray-600">暂无待评估的员工</div>
          </div>
        )}
      </div>
    </div>
  );
}
