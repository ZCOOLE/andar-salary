import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { mockEmployees, type Employee } from '../lib/mockData';
import { hasRole } from '../lib/auth';
import { Plus, Edit, Trash2, Search, Save, X, ChevronLeft } from 'lucide-react';

export function EmployeeManagementPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    // 从localStorage获取员工数据，如果没有则使用mock数据
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(mockEmployees);
      localStorage.setItem('employees', JSON.stringify(mockEmployees));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      employeeNo: '',
      name: '',
      phone: '',
      department: '',
      position: '',
      entryDate: new Date().toISOString().split('T')[0],
      status: 1,
      role: 'employee',
    };
    setCurrentEmployee(newEmployee);
    setFormData(newEmployee);
    setIsEditing(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData(employee);
    setIsEditing(true);
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm('确定要删除这个员工吗？')) {
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(updatedEmployees);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.employeeNo || !formData.phone) {
      alert('请填写必填字段');
      return;
    }

    let updatedEmployees: Employee[];
    if (currentEmployee) {
      updatedEmployees = employees.map(emp => 
        emp.id === currentEmployee.id ? { ...emp, ...formData } as Employee : emp
      );
    } else {
      const newEmployee = {
        ...formData,
        id: employees.length + 1,
        status: 1,
        role: formData.role || 'employee',
      } as Employee;
      updatedEmployees = [...employees, newEmployee];
    }

    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setIsEditing(false);
    setCurrentEmployee(null);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentEmployee(null);
    setFormData({});
  };

  if (!hasRole(['leader', 'finance'])) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">无权限访问</h2>
        <p className="text-gray-600">只有领导和财务可以访问员工管理页面</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">员工管理</h2>
        <button
          onClick={handleAddEmployee}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加员工
        </button>
      </div>

      {/* 搜索框 */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="搜索员工姓名、工号或部门"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* 员工列表 */}
      <div className="space-y-3">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900">{employee.name}</div>
                <div className="text-xs text-gray-500">{employee.department} · {employee.position}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${employee.role === 'employee' ? 'bg-gray-100 text-gray-800' : employee.role === 'leader' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}
                >
                  {employee.role === 'employee' ? '员工' : employee.role === 'leader' ? '领导' : '财务'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3">
              <div>
                <span className="text-gray-500">工号：</span>
                {employee.employeeNo}
              </div>
              <div>
                <span className="text-gray-500">电话：</span>
                {employee.phone}
              </div>
              <div>
                <span className="text-gray-500">入职日期：</span>
                {employee.entryDate}
              </div>
              <div>
                <span className="text-gray-500">状态：</span>
                {employee.status === 1 ? '在职' : '离职'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEditEmployee(employee)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                编辑
              </button>
              <button
                onClick={() => handleDeleteEmployee(employee.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 编辑/添加表单 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 pt-8">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentEmployee ? '编辑员工' : '添加员工'}
              </h3>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">员工编号</label>
                <input
                  type="text"
                  name="employeeNo"
                  value={formData.employeeNo || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">入职日期</label>
                <input
                  type="date"
                  name="entryDate"
                  value={formData.entryDate || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select
                  name="role"
                  value={formData.role || 'employee'}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="employee">员工</option>
                  <option value="leader">领导</option>
                  <option value="finance">财务</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">身份证号</label>
                <input
                  type="text"
                  name="idCard"
                  value={formData.idCard || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">银行卡号</label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开户银行</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开户支行</label>
                <input
                  type="text"
                  name="bankBranch"
                  value={formData.bankBranch || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">大额行号</label>
                <input
                  type="text"
                  name="bankBranchCode"
                  value={formData.bankBranchCode || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}