// 模拟数据和类型定义

export type Role = 'employee' | 'leader' | 'finance';

export type PerformanceStatus = 'pending_self' | 'pending_leader' | 'completed';

export interface Employee {
  id: number;
  employeeNo: string;
  name: string;
  phone: string;
  department: string;
  position: string;
  entryDate: string;
  status: number;
  role: Role;
  leaderId?: number;
  idCard?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  bankBranchCode?: string;
}

export interface Performance {
  id: number;
  employeeId: number;
  yearMonth: string;
  selfScore?: number;
  selfComment?: string;
  selfSubmittedAt?: string;
  leaderScore?: number;
  leaderComment?: string;
  leaderId?: number;
  leaderAssessedAt?: string;
  status: PerformanceStatus;
}

export interface Salary {
  id: number;
  employeeId: number;
  yearMonth: string;
  baseSalary: number;
  performanceBase: number;
  selfScore: number;
  leaderScore: number;
  actualPerformance: number;
  insurance: number;
  providentFund: number;
  taxableIncome: number;
  taxAmount: number;
  netSalary: number;
  status: 'draft' | 'confirmed' | 'paid';
}

// 模拟员工数据
export const mockEmployees: Employee[] = [
  {
    id: 1,
    employeeNo: '天1001',
    name: '张三',
    phone: '13800138001',
    department: '产品部',
    position: '产品经理',
    entryDate: '2023-01-15',
    status: 1,
    role: 'employee',
    leaderId: 2,
    idCard: '110101199001011234',
    bankAccount: '6228480010000000001',
    bankName: '中国农业银行',
    bankBranch: '北京市朝阳区支行',
    bankBranchCode: '103100000011',
  },
  {
    id: 2,
    employeeNo: '天1002',
    name: '李经理',
    phone: '13800138002',
    department: '产品部',
    position: '部门经理',
    entryDate: '2021-03-20',
    status: 1,
    role: 'leader',
    idCard: '110101198501011234',
    bankAccount: '6228480010000000002',
    bankName: '中国农业银行',
    bankBranch: '北京市海淀区支行',
    bankBranchCode: '103100000022',
  },
  {
    id: 3,
    employeeNo: '天1003',
    name: '王财务',
    phone: '13800138003',
    department: '财务部',
    position: '财务主管',
    entryDate: '2020-06-10',
    status: 1,
    role: 'finance',
    idCard: '110101198801011234',
    bankAccount: '6228480010000000003',
    bankName: '中国农业银行',
    bankBranch: '北京市西城区支行',
    bankBranchCode: '103100000033',
  },
  {
    id: 4,
    employeeNo: '天1004',
    name: '李四',
    phone: '13800138004',
    department: '技术部',
    position: '前端工程师',
    entryDate: '2022-08-05',
    status: 1,
    role: 'employee',
    leaderId: 2,
    idCard: '110101199201011234',
    bankAccount: '6228480010000000004',
    bankName: '中国农业银行',
    bankBranch: '北京市朝阳区支行',
    bankBranchCode: '103100000011',
  },
  {
    id: 5,
    employeeNo: '天1005',
    name: '王五',
    phone: '13800138005',
    department: '产品部',
    position: '产品助理',
    entryDate: '2023-11-01',
    status: 1,
    role: 'employee',
    leaderId: 2,
    idCard: '110101199301011234',
    bankAccount: '6228480010000000005',
    bankName: '中国农业银行',
    bankBranch: '北京市海淀区支行',
    bankBranchCode: '103100000022',
  },
  {
    id: 6,
    employeeNo: '天1006',
    name: '赵六',
    phone: '13800138006',
    department: '技术部',
    position: '后端工程师',
    entryDate: '2022-05-15',
    status: 1,
    role: 'employee',
    leaderId: 2,
    idCard: '110101199101011234',
    bankAccount: '6228480010000000006',
    bankName: '中国农业银行',
    bankBranch: '北京市朝阳区支行',
    bankBranchCode: '103100000011',
  },
  {
    id: 7,
    employeeNo: '天1007',
    name: '孙七',
    phone: '13800138007',
    department: '技术部',
    position: 'UI设计师',
    entryDate: '2023-03-20',
    status: 1,
    role: 'employee',
    leaderId: 2,
    idCard: '110101199401011234',
    bankAccount: '6228480010000000007',
    bankName: '中国农业银行',
    bankBranch: '北京市朝阳区支行',
    bankBranchCode: '103100000011',
  },
];

// 当前年月
export const getCurrentYearMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// 初始化绩效数据
export const initPerformanceData = (): Performance[] => {
  const currentMonth = getCurrentYearMonth();
  return mockEmployees
    .filter(emp => emp.role === 'employee')
    .map((emp, index) => ({
      id: index + 1,
      employeeId: emp.id,
      yearMonth: currentMonth,
      selfScore: index === 0 ? 85 : index === 1 ? 90 : undefined,
      selfComment: index === 0 ? '本月完成了产品V2.0的需求分析和原型设计，用户反馈良好。' : index === 1 ? '完成了3个核心功能模块的开发，代码质量优秀。' : undefined,
      selfSubmittedAt: index === 0 ? '2026-02-10T10:30:00' : index === 1 ? '2026-02-12T14:20:00' : undefined,
      leaderScore: index === 0 ? 85 : index === 1 ? 88 : undefined,
      leaderComment: index === 0 ? '表现良好，继续保持。' : index === 1 ? '技术能力强，本月表现优秀。' : undefined,
      leaderId: index < 2 ? 2 : undefined,
      leaderAssessedAt: index < 2 ? '2026-02-15T16:00:00' : undefined,
      status: index === 0 ? 'completed' : index === 1 ? 'completed' : index === 2 ? 'pending_leader' : 'pending_self',
    }));
};

// 计算到职日的实际基本工资
const calculateProRatedSalary = (baseSalary: number, entryDate: string): number => {
  const date = new Date(entryDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysWorked = daysInMonth - date.getDate() + 1;
  return Math.round((baseSalary / daysInMonth) * daysWorked);
};

// 计算个人所得税
const calculateTax = (taxableIncome: number, isTaiwanese: boolean = false): number => {
  const threshold = isTaiwanese ? 10000 : 5000;
  const taxableAmount = Math.max(0, taxableIncome - threshold);
  return Math.round(taxableAmount * 0.03);
};

// 初始化薪资数据
export const initSalaryData = (): Salary[] => {
  const lastMonth = '2026-01';
  return mockEmployees
    .filter(emp => emp.role === 'employee')
    .map((emp, index) => {
      const baseSalary = [8000, 12000, 6000, 11000, 7500][index] || 8000;
      const performanceBase = [5000, 6000, 4000, 6000, 4500][index] || 5000;
      const selfScore = [85, 90, 75, 88, 80][index] || 80;
      const leaderScore = [85, 88, 75, 90, 82][index] || 80;
      
      // 计算实际基本工资（根据到职日）
      const proRatedBaseSalary = calculateProRatedSalary(baseSalary, emp.entryDate);
      
      // 计算实际绩效奖金
      const actualPerformance = Math.round(performanceBase * (leaderScore / 100));
      
      // 计算应付薪资
      const grossSalary = proRatedBaseSalary + actualPerformance;
      
      // 计算扣除项
      const insurance = Math.round(grossSalary * 0.125);
      const providentFund = Math.round(grossSalary * 0.08);
      
      // 计算计税工资
      const taxableIncome = grossSalary - insurance - providentFund;
      
      // 计算个人所得税
      const taxAmount = calculateTax(taxableIncome);
      
      // 计算实发工资
      const netSalary = taxableIncome - taxAmount;

      return {
        id: index + 1,
        employeeId: emp.id,
        yearMonth: lastMonth,
        baseSalary: proRatedBaseSalary,
        performanceBase,
        selfScore,
        leaderScore,
        actualPerformance,
        insurance,
        providentFund,
        taxableIncome,
        taxAmount,
        netSalary,
        status: 'paid',
      };
    });
};

// 获取或初始化数据
export const getStorageData = <T>(key: string, initializer: () => T): T => {
  // 强制使用初始数据，修复薪资计算问题
  const data = initializer();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

export const setStorageData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
