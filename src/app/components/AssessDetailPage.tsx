import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';
import { getCurrentUser } from '../lib/auth';
import { getStorageData, setStorageData, initPerformanceData, mockEmployees, type Performance } from '../lib/mockData';

export function AssessDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [leaderScore, setLeaderScore] = useState(80);
  const [leaderComment, setLeaderComment] = useState('');

  useEffect(() => {
    const performances = getStorageData<Performance[]>('performances', initPerformanceData);
    const perf = performances.find(p => p.id === Number(id));
    if (perf) {
      setPerformance(perf);
      setLeaderScore(perf.leaderScore || perf.selfScore || 80);
      setLeaderComment(perf.leaderComment || '表现良好，继续保持。');
    }
  }, [id]);

  const handleSubmit = () => {
    if (!performance || !currentUser) return;

    const performances = getStorageData<Performance[]>('performances', initPerformanceData);
    const updatedPerformances = performances.map(p => {
      if (p.id === performance.id) {
        return {
          ...p,
          leaderScore,
          leaderComment,
          leaderId: currentUser.id,
          leaderAssessedAt: new Date().toISOString(),
          status: 'completed' as const,
        };
      }
      return p;
    });

    setStorageData('performances', updatedPerformances);
    alert('评估提交成功！');
    navigate('/performance');
  };

  if (!performance) {
    return <div className="p-4">加载中...</div>;
  }

  const employee = mockEmployees.find(e => e.id === performance.employeeId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">绩效评估</h1>
            <p className="text-xs text-gray-500">{employee?.name}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* 员工信息 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 text-lg">{employee?.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {employee?.department} · {employee?.position}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                工号: {employee?.employeeNo}
              </div>
            </div>
          </div>
        </div>

        {/* 员工自评 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">员工自评</h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">自评分数</span>
              <span className="text-2xl font-bold text-gray-900">{performance.selfScore}分</span>
            </div>
            
            {performance.selfComment && (
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">工作成果描述</div>
                <div className="text-sm text-gray-700">{performance.selfComment}</div>
              </div>
            )}
          </div>
        </div>

        {/* 领导评估 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">领导评估</h3>
          
          {/* 评分 */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              领导评分
            </label>
            
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">{leaderScore}分</div>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`text-3xl ${i < Math.floor(leaderScore / 20) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </div>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={leaderScore}
              onChange={(e) => setLeaderScore(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0分</span>
              <span>50分</span>
              <span>100分</span>
            </div>
          </div>

          {/* 评语 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              评语
            </label>
            <textarea
              value={leaderComment}
              onChange={(e) => setLeaderComment(e.target.value)}
              placeholder="请输入对该员工本月表现的评价..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* 绩效预览 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-900 mb-2">绩效金额预览</div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-blue-600 mb-1">绩效基数</div>
              <div className="font-semibold text-blue-900">¥5,000</div>
            </div>
            <div>
              <div className="text-blue-600 mb-1">绩效系数</div>
              <div className="font-semibold text-blue-900">{leaderScore}%</div>
            </div>
            <div>
              <div className="text-blue-600 mb-1">实发绩效</div>
              <div className="font-semibold text-blue-900">¥{(5000 * leaderScore / 100).toFixed(0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleSubmit}
          disabled={!leaderComment.trim()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          提交评估
        </button>
      </div>
    </div>
  );
}
