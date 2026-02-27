import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">页面不存在</h1>
        <p className="text-gray-600 mb-6">抱歉，您访问的页面不存在</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          <Home className="w-5 h-5" />
          返回首页
        </button>
      </div>
    </div>
  );
}
