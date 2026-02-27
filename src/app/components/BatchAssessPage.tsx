import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Edit2 } from 'lucide-react';
import { getStorageData, setStorageData, initPerformanceData, getCurrentYearMonth, mockEmployees, type Performance } from '../lib/mockData';
import { canEvaluatePerformance } from '../lib/auth';

export function BatchAssessPage() {
  const navigate = useNavigate();
  const currentMonth = getCurrentYearMonth();
  const [performances, setPerformances] = useState(() => 
    getStorageData<Performance[]>('performances', initPerformanceData)
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState(0);
  const [editComment, setEditComment] = useState('');

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

  const handleSelectAll = () => {
    if (selectedIds.length === pendingPerformances.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingPerformances.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleEdit = (perf: Performance) => {
    setEditingId(perf.id);
    setEditScore(perf.leaderScore || perf.selfScore || 80);
    setEditComment(perf.leaderComment || '表现良好，继续保持。');
  };

  const handleSaveEdit = () => {
    if (editingId === null) return;

    const updatedPerformances = performances.map(p => {
      if (p.id === editingId) {
        return {
          ...p,
          leaderScore: editScore,
          leaderComment: editComment,
        };
      }
      return p;
    });

    setPerformances(updatedPerformances);
    setEditingId(null);
  };

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) {
      alert('请先选择要评估的员工');
      return;
    }

    const updatedPerformances = performances.map(p => {
      if (selectedIds.includes(p.id)) {
        return {
          ...p,
          leaderScore: p.leaderScore || p.selfScore,
          leaderComment: p.leaderComment || '表现良好，继续保持。',
          leaderId: 2,
          leaderAssessedAt: new Date().toISOString(),
          status: 'completed' as const,
        };
      }
      return p;
    });

    setStorageData('performances', updatedPerformances);
    alert(`已成功评估 ${selectedIds.length} 人`);
    navigate('/');
  };

  const totalBonus = selectedIds.reduce((sum, id) => {
    const perf = performances.find(p => p.id === id);
    if (!perf) return sum;
    const score = perf.leaderScore || perf.selfScore || 0;
    return sum + (5000 * (score / 100));
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">批量绩效评估</h1>
          </div>
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 font-medium"
          >
            {selectedIds.length === pendingPerformances.length ? '取消全选' : '全选'}
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-900">已选 <strong>{selectedIds.length}</strong> 人</span>
          <span className="text-blue-700">预计绩效支出: <strong>¥{totalBonus.toFixed(0)}</strong></span>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 pb-24">
        {pendingPerformances.map((perf) => {
          const employee = mockEmployees.find(e => e.id === perf.employeeId);
          if (!employee) return null;

          const isSelected = selectedIds.includes(perf.id);
          const isEditing = editingId === perf.id;
          const displayScore = perf.leaderScore || perf.selfScore || 0;

          return (
            <div
              key={perf.id}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
                isSelected ? 'border-blue-600' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleSelect(perf.id)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{employee.name}</div>
                      <div className="text-xs text-gray-500">
                        {employee.department} | {employee.position}
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => handleEdit(perf)}
                        className="text-blue-600 text-sm flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        修改
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">领导评分</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editScore}
                          onChange={(e) => setEditScore(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">评语</label>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-xs text-gray-500">自评</div>
                        <div className="text-lg font-semibold text-gray-900">{perf.selfScore}</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2">
                        <div className="text-xs text-blue-600">领导</div>
                        <div className="text-lg font-semibold text-gray-900">{displayScore}</div>
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                      {perf.leaderComment || '默认跟随自评'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleBatchApprove}
          disabled={selectedIds.length === 0}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          批量通过 ({selectedIds.length}人)
        </button>
      </div>
    </div>
  );
}
