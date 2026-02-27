import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { getCurrentUser } from '../lib/auth';
import { getStorageData, setStorageData, initPerformanceData, getCurrentYearMonth, type Performance } from '../lib/mockData';

export function SelfEvaluatePage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const currentMonth = getCurrentYearMonth();
  const [score, setScore] = useState(80);
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 加载已有的自评数据
    const performances = getStorageData<Performance[]>('performances', initPerformanceData);
    const myPerf = performances.find(p => p.employeeId === currentUser?.id && p.yearMonth === currentMonth);
    if (myPerf?.selfScore) {
      setScore(myPerf.selfScore);
      setComment(myPerf.selfComment || '');
    }
  }, [currentUser, currentMonth]);

  const handleSave = (submit: boolean = false) => {
    if (!currentUser) return;

    setIsSaving(true);
    const performances = getStorageData<Performance[]>('performances', initPerformanceData);
    const perfIndex = performances.findIndex(p => p.employeeId === currentUser.id && p.yearMonth === currentMonth);

    if (perfIndex >= 0) {
      performances[perfIndex] = {
        ...performances[perfIndex],
        selfScore: score,
        selfComment: comment,
        selfSubmittedAt: submit ? new Date().toISOString() : performances[perfIndex].selfSubmittedAt,
        status: submit ? 'pending_leader' : performances[perfIndex].status,
      };
    } else {
      // 创建新记录
      performances.push({
        id: performances.length + 1,
        employeeId: currentUser.id,
        yearMonth: currentMonth,
        selfScore: score,
        selfComment: comment,
        selfSubmittedAt: submit ? new Date().toISOString() : undefined,
        status: submit ? 'pending_leader' : 'pending_self',
      });
    }

    setStorageData('performances', performances);
    
    setTimeout(() => {
      setIsSaving(false);
      if (submit) {
        alert('自评提交成功！');
        navigate('/');
      } else {
        alert('草稿保存成功！');
      }
    }, 500);
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
            <h1 className="text-lg font-semibold text-gray-900">{currentMonth} 绩效自评</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* 评分 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            自评分数
          </label>
          
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-blue-600 mb-2">{score}分</div>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`text-3xl ${i < Math.floor(score / 20) ? 'text-yellow-400' : 'text-gray-300'}`}
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
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0分</span>
            <span>50分</span>
            <span>100分</span>
          </div>
        </div>

        {/* 工作成果描述 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            工作成果描述
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="请描述本月的主要工作成果、亮点及需要改进的地方..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="text-xs text-gray-500 mt-2">
            {comment.length} / 500 字
          </div>
        </div>

        {/* 提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            💡 <strong>提示：</strong>提交后可在领导评估前继续修改
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            保存草稿
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || !comment.trim()}
            className="py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            提交自评
          </button>
        </div>
      </div>
    </div>
  );
}
