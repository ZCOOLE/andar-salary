import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../lib/auth';
import { getStorageData, initPerformanceData, mockEmployees, getCurrentYearMonth, type Performance } from '../lib/mockData';
import { ArrowLeft, Star, Clock, CheckCircle } from 'lucide-react';

export function PerformancePage() {
  const currentUser = getCurrentUser();
  const performances = getStorageData<Performance[]>('performances', initPerformanceData);

  if (!currentUser) return null;

  if (currentUser.role === 'employee') {
    const myPerformances = performances.filter(p => p.employeeId === currentUser.id);
    return <EmployeePerformanceList performances={myPerformances} />;
  }

  return <LeaderPerformanceList performances={performances} />;
}

function EmployeePerformanceList({ performances }: { performances: Performance[] }) {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">我的绩效记录</h2>
      
      <div className="space-y-3">
        {performances.map((perf) => {
          const employee = mockEmployees.find(e => e.id === perf.employeeId);
          return (
            <div key={perf.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">{perf.yearMonth}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    perf.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : perf.status === 'pending_leader'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {perf.status === 'completed'
                    ? '已完成'
                    : perf.status === 'pending_leader'
                    ? '待评估'
                    : '待自评'}
                </span>
              </div>

              {perf.selfScore && (
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">自评分数</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{perf.selfScore}分</span>
                    </div>
                  </div>
                  {perf.leaderScore && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">领导评分</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
                        <span className="font-semibold text-gray-900">{perf.leaderScore}分</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {perf.selfComment && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-3">
                  <div className="text-xs text-gray-500 mb-1">自评说明</div>
                  {perf.selfComment}
                </div>
              )}

              {perf.leaderComment && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700 mb-3">
                  <div className="text-xs text-blue-600 mb-1">领导评语</div>
                  {perf.leaderComment}
                </div>
              )}

              {perf.status === 'pending_self' && (
                <button
                  onClick={() => navigate('/performance/self-evaluate')}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  立即自评
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderPerformanceList({ performances }: { performances: Performance[] }) {
  const navigate = useNavigate();
  const currentMonth = getCurrentYearMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const filteredPerf = performances.filter(p => p.yearMonth === selectedMonth);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">绩效管理</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value={currentMonth}>{currentMonth}</option>
          <option value="2026-01">2026-01</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate('/performance/batch-assess')}
          className="py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          批量评估
        </button>
        <button
          onClick={() => navigate('/performance/assess-list')}
          className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          逐个评估
        </button>
      </div>

      <div className="space-y-3">
        {filteredPerf.map((perf) => {
          const employee = mockEmployees.find(e => e.id === perf.employeeId);
          if (!employee) return null;

          return (
            <div key={perf.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{employee.name}</div>
                  <div className="text-xs text-gray-500">{employee.department} · {employee.position}</div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    perf.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : perf.status === 'pending_leader'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {perf.status === 'completed'
                    ? '已评估'
                    : perf.status === 'pending_leader'
                    ? '待评估'
                    : '待自评'}
                </span>
              </div>

              {perf.selfScore && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">自评分数</div>
                    <div className="text-lg font-semibold text-gray-900">{perf.selfScore}分</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-600 mb-1">领导评分</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {perf.leaderScore || '-'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
