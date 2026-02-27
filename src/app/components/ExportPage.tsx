import { useState } from 'react';
import { exportSalarySummary, exportBankTransfer } from '../lib/exportService';
import { canExportReports } from '../lib/auth';

export function ExportPage() {
  const [yearMonth, setYearMonth] = useState('2026-01');
  const [bank, setBank] = useState('abc');

  if (!canExportReports()) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">无权限访问</h2>
        <p className="text-gray-600">只有财务可以访问导出页面</p>
      </div>
    );
  }

  const handleExportSalarySummary = () => {
    exportSalarySummary(yearMonth, 'xlsx');
  };

  const handleExportBankTransfer = () => {
    exportBankTransfer(yearMonth, bank, 'xls');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">财务导出</h2>
      
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">导出设置</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">月份</label>
          <input
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">银行</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="abc">农业银行</option>
            <option value="icbc">工商银行</option>
            <option value="ccb">建设银行</option>
            <option value="boc">中国银行</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={handleExportSalarySummary}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          导出公司工资总表 (xlsx)
        </button>
        
        <button
          onClick={handleExportBankTransfer}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          导出银行代发工资文件 (xls)
        </button>
      </div>
    </div>
  );
}