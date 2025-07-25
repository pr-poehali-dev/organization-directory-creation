import React, { useState, useMemo } from 'react';
import { Employee, Organization } from '@/types/directory';
import SearchBar from '@/components/SearchBar';
import EmployeeList from '@/components/EmployeeList';
import UpdateReminder from '@/components/UpdateReminder';
import AddEmployeeForm from '@/components/AddEmployeeForm';
import AddOrganizationForm from '@/components/AddOrganizationForm';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { mockEmployees } from '@/data/mockData';
import Icon from '@/components/ui/icon';

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReminder, setShowReminder] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddOrganization, setShowAddOrganization] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { user, logout, hasRole, canEditDepartment } = useAuth();

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    
    const term = searchTerm.toLowerCase();
    return employees.filter(employee =>
      employee.lastName.toLowerCase().includes(term) ||
      employee.firstName.toLowerCase().includes(term) ||
      employee.middleName.toLowerCase().includes(term) ||
      employee.workPhone.includes(term) ||
      employee.mobilePhone.includes(term)
    );
  }, [searchTerm, employees]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleUpdateConfirm = () => {
    setShowReminder(false);
  };

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
    };
    setEmployees(prev => [...prev, employee]);
  };

  const handleAddOrganization = (newOrganization: Omit<Organization, 'id'>) => {
    const organization: Organization = {
      ...newOrganization,
      id: Date.now().toString(),
    };
    setOrganizations(prev => [...prev, organization]);
  };

  const handleUpdateOrganization = (id: string, updates: Partial<Organization>) => {
    setOrganizations(prev => 
      prev.map(org => org.id === id ? { ...org, ...updates } : org)
    );
  };

  const handleDeleteOrganization = (id: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== id));
  };

  const canEditEmployee = (employee: Employee) => {
    if (!user) return false;
    if (hasRole('admin')) return true;
    if (hasRole('department_head')) return canEditDepartment(employee.department);
    if (hasRole('user')) return employee.id === user.employeeId;
    return false;
  };

  if (selectedEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedEmployee(null)}
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад к списку
            </Button>
            <h1 className="text-2xl font-bold">Карточка сотрудника</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedEmployee.lastName} {selectedEmployee.firstName} {selectedEmployee.middleName}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Должность</label>
                  <p className="text-gray-900">{selectedEmployee.position}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Структурное подразделение</label>
                  <p className="text-gray-900">{selectedEmployee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Министерство</label>
                  <p className="text-gray-900">{selectedEmployee.ministry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Рабочий телефон</label>
                  <p className="text-gray-900">{selectedEmployee.workPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Внутренний номер</label>
                  <p className="text-gray-900">{selectedEmployee.internalPhone}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Мобильный телефон</label>
                  <p className="text-gray-900">{selectedEmployee.mobilePhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Адрес нахождения</label>
                  <p className="text-gray-900">
                    {selectedEmployee.address.street}, д. {selectedEmployee.address.building}, каб. {selectedEmployee.address.office}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Электронная почта</label>
                  <p className="text-gray-900">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Последнее обновление</label>
                  <p className="text-gray-900">{selectedEmployee.lastUpdated.toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </div>
            
            {canEditEmployee(selectedEmployee) && (
              <div className="mt-6 pt-6 border-t">
                <Button>
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon name="Users" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold">Телефонный справочник</h1>
            </div>
            <div className="flex items-center gap-4">
              {(hasRole('admin') || hasRole('department_head')) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShowAddEmployee(true)}>
                      <Icon name="UserPlus" size={16} className="mr-2" />
                      Сотрудника
                    </DropdownMenuItem>
                    {hasRole('admin') && (
                      <>
                        <DropdownMenuItem onClick={() => setShowAddOrganization(true)}>
                          <Icon name="Building2" size={16} className="mr-2" />
                          Организацию
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowAdminPanel(true)}>
                          <Icon name="Settings" size={16} className="mr-2" />
                          Управление
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <span className="text-sm text-gray-600">
                {user?.role === 'admin' && 'Администратор'}
                {user?.role === 'department_head' && 'Руководитель'}
                {user?.role === 'user' && 'Пользователь'}
              </span>
              <Button variant="outline" onClick={logout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {showReminder && (
          <UpdateReminder
            onConfirm={handleUpdateConfirm}
            onClose={() => setShowReminder(false)}
          />
        )}
        
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Найдено сотрудников: {filteredEmployees.length}
          </p>
        </div>

        <EmployeeList
          employees={filteredEmployees}
          onEmployeeClick={handleEmployeeClick}
          onEditEmployee={canEditEmployee ? handleEmployeeClick : undefined}
          showEditButton={hasRole('admin') || hasRole('department_head')}
        />

        <AddEmployeeForm
          isOpen={showAddEmployee}
          onClose={() => setShowAddEmployee(false)}
          onSave={handleAddEmployee}
        />

        <AddOrganizationForm
          isOpen={showAddOrganization}
          onClose={() => setShowAddOrganization(false)}
          onSave={handleAddOrganization}
        />

        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          organizations={organizations}
          onUpdateOrganization={handleUpdateOrganization}
          onDeleteOrganization={handleDeleteOrganization}
        />
      </main>
    </div>
  );
};

export default DirectoryPage;