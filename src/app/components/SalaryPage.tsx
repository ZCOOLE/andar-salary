import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../lib/auth';
import { getStorageData, initSalaryData, mockEmployees, type Salary } from '../lib/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function SalaryPage() {
  const currentUser = getCurrentUser();
  const salaries = getStorageData<Salary[]>('salaries', initSalaryData);

  if (!currentUser) return null;

  if (currentUser.role === 'employee') {
    const mySalaries = salaries.filter(s => s.employeeId === currentUser.id);
    return <EmployeeSalaryList salaries={mySalaries} />;
  }

  return <LeaderSalaryList salaries={salaries} />;
}

function EmployeeSalaryList({ salaries }: { salaries: Salary[] }) {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">我的薪资记录</h2>
      
      <div className="space-y-3">
        {salaries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-3">📊</div>
            <div className="text-gray-600">暂无薪资记录</div>
          </div>
        ) : (
          salaries.map((salary) => {
            if (!salary) return null;
            return (
              <button
                key={salary.id}
                onClick={() => navigate(`/salary/${salary.id}`)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{salary.yearMonth || ''}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    已发放
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ¥{(salary.netSalary || 0).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">实发工资</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500 mb-1">基本工资</div>
                    <div className="font-semibold text-gray-900">¥{(salary.baseSalary || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">绩效奖金</div>
                    <div className="font-semibold text-gray-900">¥{(salary.actualPerformance || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">领导评分</div>
                    <div className="font-semibold text-gray-900">{(salary.leaderScore || 0)}%</div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function LeaderSalaryList({ salaries }: { salaries: Salary[] }) {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('2026-01');

  const filteredSalaries = salaries.filter(s => s && s.yearMonth === selectedMonth);
  const totalAmount = filteredSalaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const avgPerformanceRatio = filteredSalaries.length > 0 ? filteredSalaries.reduce((sum, s) => sum + (s.leaderScore || 0), 0) / filteredSalaries.length : 0;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">薪资管理</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value="2026-01">2026-01</option>
          <option value="2025-12">2025-12</option>
          <option value="2025-11">2025-11</option>
          <option value="2025-10">2025-10</option>
          <option value="2025-09">2025-09</option>
          <option value="2025-08">2025-08</option>
          <option value="2025-07">2025-07</option>
          <option value="2025-06">2025-06</option>
          <option value="2025-05">2025-05</option>
          <option value="2025-04">2025-04</option>
          <option value="2025-03">2025-03</option>
          <option value="2025-02">2025-02</option>
          <option value="2025-01">2025-01</option>
        </select>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-xs opacity-90 mb-1">总发放金额</div>
          <div className="text-2xl font-bold">¥{totalAmount.toLocaleString()}</div>
          <div className="text-xs opacity-75 mt-1">{filteredSalaries.length} 人</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-xs opacity-90 mb-1">平均绩效系数</div>
          <div className="text-2xl font-bold">{avgPerformanceRatio.toFixed(1)}%</div>
          <div className="text-xs opacity-75 mt-1">部门平均</div>
        </div>
      </div>

      {/* 员工列表 */}
      <div className="space-y-3">
        {filteredSalaries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-3">💰</div>
            <div className="text-gray-600">暂无薪资记录</div>
          </div>
        ) : (
          filteredSalaries.map((salary) => {
            if (!salary) return null;
            const employee = mockEmployees.find(e => e && e.id === salary.employeeId);
            if (!employee) return null;

            return (
              <button
                key={salary.id}
                onClick={() => navigate(`/salary/${salary.id}`)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.department} · {employee.position}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">¥{(salary.netSalary || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">绩效 {(salary.leaderScore || 0)}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>基本 ¥{(salary.baseSalary || 0).toLocaleString()}</span>
                  <span>绩效 ¥{(salary.actualPerformance || 0).toLocaleString()}</span>
                  <span className="text-red-600">-社保 ¥{(salary.insurance || 0).toLocaleString()}</span>
                  <span className="text-red-600">-公积金 ¥{(salary.providentFund || 0).toLocaleString()}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
