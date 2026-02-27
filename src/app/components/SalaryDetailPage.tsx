import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { getStorageData, initSalaryData, initPerformanceData, mockEmployees, type Salary, type Performance } from '../lib/mockData';

export function SalaryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [salary, setSalary] = useState<Salary | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);

  useEffect(() => {
    const salaries = getStorageData<Salary[]>('salaries', initSalaryData);
    const sal = salaries.find(s => s.id === Number(id));
    if (sal) {
      setSalary(sal);
      
      // 查找对应的绩效记录
      const performances = getStorageData<Performance[]>('performances', initPerformanceData);
      const perf = performances.find(p => p.employeeId === sal.employeeId && p.yearMonth === sal.yearMonth);
      setPerformance(perf || null);
    }
  }, [id]);

  if (!salary) {
    return <div className="p-4">加载中...</div>;
  }

  const employee = mockEmployees.find(e => e.id === salary.employeeId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{salary.yearMonth || ''} 薪资</h1>
            <p className="text-xs text-gray-500">{employee?.name || ''}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* 总金额 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
          <div className="text-sm opacity-90 mb-2">实发工资</div>
          <div className="text-4xl font-bold mb-1">¥{((salary.netSalary || 0) as number).toLocaleString()}</div>
          <div className="text-xs opacity-75">已于 {salary.yearMonth || ''} 月底发放</div>
        </div>

        {/* 工资构成 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            💰 工资构成
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">基本工资</span>
              <span className="text-base font-semibold text-gray-900">¥{((salary.baseSalary || 0) as number).toLocaleString()}</span>
            </div>

            <div className="py-2 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">绩效奖金</span>
                <span className="text-base font-semibold text-gray-900">¥{((salary.actualPerformance || 0) as number).toLocaleString()}</span>
              </div>
              <div className="ml-4 space-y-1 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span>├─ 绩效基数</span>
                  <span>¥{((salary.performanceBase || 0) as number).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>├─ 领导评分</span>
                  <span>{(salary.leaderScore || 0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>└─ 自评分数</span>
                  <span>{(salary.selfScore || 0)}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">医社保（12.5%）</span>
              <span className="text-base font-semibold text-red-600">-¥{((salary.insurance || 0) as number).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">公积金（8%）</span>
              <span className="text-base font-semibold text-red-600">-¥{((salary.providentFund || 0) as number).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">计税工资</span>
              <span className="text-base font-semibold text-gray-900">¥{((salary.taxableIncome || 0) as number).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">个人所得税</span>
              <span className="text-base font-semibold text-red-600">-¥{((salary.taxAmount || 0) as number).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-3 mt-3">
              <span className="text-base font-semibold text-gray-900">实发工资</span>
              <span className="text-xl font-bold text-green-600">¥{((salary.netSalary || 0) as number).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 绩效详情 */}
        {performance && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📊 绩效详情
            </h3>

            <div className="space-y-4">
              {/* 自评 */}
              {performance.selfScore && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">员工自评</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{performance.selfScore}分</span>
                    </div>
                  </div>
                  {performance.selfComment && (
                    <div className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-200">
                      "{performance.selfComment}"
                    </div>
                  )}
                </div>
              )}

              {/* 领导评估 */}
              {performance.leaderScore && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">领导评估</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
                      <span className="text-lg font-bold text-gray-900">{performance.leaderScore}分</span>
                    </div>
                  </div>
                  {performance.leaderComment && (
                    <div className="text-sm text-gray-700 mt-2 pt-2 border-t border-blue-200">
                      "{performance.leaderComment}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 员工信息 */}
        {employee && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              👤 员工信息
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">姓名</div>
                <div className="font-medium text-gray-900">{employee.name}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">工号</div>
                <div className="font-medium text-gray-900">{employee.employeeNo}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">部门</div>
                <div className="font-medium text-gray-900">{employee.department}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">职位</div>
                <div className="font-medium text-gray-900">{employee.position}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
