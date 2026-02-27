import { mockEmployees, type Salary } from './mockData';

// 生成CSV文件并下载
const downloadCSV = (data: any[], filename: string, headers: string[]) => {
  // 生成CSV内容
  const csvContent = [
    headers.join(','), // 表头
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // 处理包含逗号或引号的值
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 导出工资总表
export const exportSalarySummary = (yearMonth: string, format: string) => {
  // 模拟API调用
  console.log('导出工资总表', { yearMonth, format });
  
  // 模拟生成数据
  const salaries = JSON.parse(localStorage.getItem('salaries') || '[]') as Salary[];
  const data = salaries.map((salary, index) => {
    const employee = mockEmployees.find(e => e.id === salary.employeeId);
    return {
      '月份': yearMonth.replace('-', ''),
      '员工编号': employee?.employeeNo || '',
      '姓名': employee?.name || '',
      '到职日': employee?.entryDate || '',
      '基本工资': salary.baseSalary,
      '绩效奖金': salary.performanceBase,
      '自评(%)': `${salary.selfScore}%`,
      '公司评估(%)': `${salary.leaderScore}%`,
      '应付薪资': salary.baseSalary + salary.actualPerformance,
      '医社保（12.5%）': salary.insurance,
      '公积金（8%）': salary.providentFund,
      '计税工资': salary.taxableIncome,
      '个人所得税': salary.taxAmount,
      '实发工资': salary.netSalary,
      '身份证号码': employee?.idCard || '',
      '银行卡号码': employee?.bankAccount || '',
      '银行支行名称': employee?.bankBranch || '',
      '联系方式': employee?.phone || ''
    };
  });
  
  // 计算汇总数据
  const totalSalary = data.reduce((sum, item) => sum + item['实发工资'], 0);
  const totalTax = data.reduce((sum, item) => sum + item['个人所得税'], 0);
  
  // 添加汇总行
  data.push({
    '月份': '',
    '员工编号': '',
    '姓名': '单月薪酬累计',
    '到职日': '',
    '基本工资': '',
    '绩效奖金': '',
    '自评(%)': '',
    '公司评估(%)': '',
    '应付薪资': '',
    '医社保（12.5%）': '',
    '公积金（8%）': '',
    '计税工资': '',
    '个人所得税': '',
    '实发工资': totalSalary,
    '身份证号码': '',
    '银行卡号码': '',
    '银行支行名称': '',
    '联系方式': ''
  });
  
  data.push({
    '月份': '',
    '员工编号': '',
    '姓名': '零用金拨补',
    '到职日': '',
    '基本工资': '',
    '绩效奖金': '',
    '自评(%)': '',
    '公司评估(%)': '',
    '应付薪资': '',
    '医社保（12.5%）': '',
    '公积金（8%）': '',
    '计税工资': '',
    '个人所得税': '',
    '实发工资': 0,
    '身份证号码': '',
    '银行卡号码': '',
    '银行支行名称': '',
    '联系方式': ''
  });
  
  data.push({
    '月份': '',
    '员工编号': '',
    '姓名': '总计',
    '到职日': '',
    '基本工资': '',
    '绩效奖金': '',
    '自评(%)': '',
    '公司评估(%)': '',
    '应付薪资': '',
    '医社保（12.5%）': '',
    '公积金（8%）': '',
    '计税工资': '',
    '个人所得税': '',
    '实发工资': totalSalary,
    '身份证号码': '',
    '银行卡号码': '',
    '银行支行名称': '',
    '联系方式': ''
  });
  
  // 导出CSV文件
  const headers = Object.keys(data[0]);
  downloadCSV(data, `公司工资总表_${yearMonth.replace('-', '')}.csv`, headers);
  
  // 提示导出成功
  alert(`工资总表导出成功！共 ${data.length - 3} 条记录`);
  console.log('导出数据', data);
};

// 导出银行代发文件
export const exportBankTransfer = (yearMonth: string, bank: string, format: string) => {
  // 模拟API调用
  console.log('导出银行代发文件', { yearMonth, bank, format });
  
  // 模拟生成数据
  const salaries = JSON.parse(localStorage.getItem('salaries') || '[]') as Salary[];
  const data = salaries.map((salary, index) => {
    const employee = mockEmployees.find(e => e.id === salary.employeeId);
    return {
      '编号': index + 1,
      '收款方账号': employee?.bankAccount || '',
      '收款方户名': employee?.name || '',
      '开户银行（行别）': employee?.bankName || '',
      '开户行大额行号': employee?.bankBranchCode || '',
      '开户行支行名称': employee?.bankBranch || '',
      '金额': salary.netSalary,
      '备注（附言）': `${yearMonth.split('-')[1]}月工资`
    };
  });
  
  // 导出CSV文件
  const headers = Object.keys(data[0]);
  downloadCSV(data, `银行代发工资_${yearMonth.replace('-', '')}_${bank}.csv`, headers);
  
  // 提示导出成功
  alert(`银行代发文件导出成功！共 ${data.length} 条记录`);
  console.log('导出数据', data);
};