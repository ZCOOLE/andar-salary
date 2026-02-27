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
  performanceBonus: number;
  actualPerformance: number;
  performanceRatio: number;
  allowance: number;
  deduction: number;
  totalAmount: number;
  status: 'draft' | 'confirmed';
}

// 模拟员工数据
export const mockEmployees: Employee[] = [
  {
    id: 1,
    employeeNo: 'E001',
    name: '张三',
    phone: '13800138001',
    department: '产品部',
    position: '产品经理',
    entryDate: '2023-01-15',
    status: 1,
    role: 'employee',
    leaderId: 2,
  },
  {
    id: 2,
    employeeNo: 'E002',
    name: '李经理',
    phone: '13800138002',
    department: '产品部',
    position: '部门经理',
    entryDate: '2021-03-20',
    status: 1,
    role: 'leader',
  },
  {
    id: 3,
    employeeNo: 'E003',
    name: '王财务',
    phone: '13800138003',
    department: '财务部',
    position: '财务主管',
    entryDate: '2020-06-10',
    status: 1,
    role: 'finance',
  },
  {
    id: 4,
    employeeNo: 'E004',
    name: '李四',
    phone: '13800138004',
    department: '技术部',
    position: '前端工程师',
    entryDate: '2022-08-05',
    status: 1,
    role: 'employee',
    leaderId: 2,
  },
  {
    id: 5,
    employeeNo: 'E005',
    name: '王五',
    phone: '13800138005',
    department: '产品部',
    position: '产品助理',
    entryDate: '2023-11-01',
    status: 1,
    role: 'employee',
    leaderId: 2,
  },
  {
    id: 6,
    employeeNo: 'E006',
    name: '赵六',
    phone: '13800138006',
    department: '技术部',
    position: '后端工程师',
    entryDate: '2022-05-15',
    status: 1,
    role: 'employee',
    leaderId: 2,
  },
  {
    id: 7,
    employeeNo: 'E007',
    name: '孙七',
    phone: '13800138007',
    department: '技术部',
    position: 'UI设计师',
    entryDate: '2023-03-20',
    status: 1,
    role: 'employee',
    leaderId: 2,
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

// 初始化薪资数据
export const initSalaryData = (): Salary[] => {
  const lastMonth = '2026-01';
  return mockEmployees
    .filter(emp => emp.role === 'employee')
    .map((emp, index) => {
      const baseSalary = [8000, 12000, 6000, 11000, 7500][index] || 8000;
      const performanceBonus = [5000, 6000, 4000, 6000, 4500][index] || 5000;
      const performanceRatio = [85, 88, 75, 90, 80][index] || 80;
      const actualPerformance = Math.round(performanceBonus * (performanceRatio / 100));
      const allowance = 500;
      const deduction = [650, 800, 400, 900, 500][index] || 500;
      const totalAmount = baseSalary + actualPerformance + allowance - deduction;

      return {
        id: index + 1,
        employeeId: emp.id,
        yearMonth: lastMonth,
        baseSalary,
        performanceBonus,
        actualPerformance,
        performanceRatio,
        allowance,
        deduction,
        totalAmount,
        status: 'confirmed',
      };
    });
};

// 获取或初始化数据
export const getStorageData = <T>(key: string, initializer: () => T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // 如果解析失败，使用初始数据
    }
  }
  const data = initializer();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

export const setStorageData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
