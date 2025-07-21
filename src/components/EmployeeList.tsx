import React from 'react';
import { Employee } from '@/types/directory';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EmployeeListProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  showEditButton?: boolean;
}

const EmployeeCard = ({ 
  employee, 
  onClick, 
  onEdit, 
  showEditButton = false 
}: { 
  employee: Employee;
  onClick: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
}) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            {employee.lastName} {employee.firstName} {employee.middleName}
          </h3>
          <p className="text-gray-600 mb-2">{employee.position}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Building2" size={16} className="text-gray-400" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={16} className="text-gray-400" />
              <span>{employee.workPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Smartphone" size={16} className="text-gray-400" />
              <span>{employee.mobilePhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={16} className="text-gray-400" />
              <span>{employee.email}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {employee.needsUpdate && (
            <Badge variant="destructive">
              Требует обновления
            </Badge>
          )}
          {showEditButton && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Icon name="Edit" size={16} />
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmployeeList = ({ 
  employees, 
  onEmployeeClick, 
  onEditEmployee, 
  showEditButton = false 
}: EmployeeListProps) => {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Users" size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Сотрудники не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onClick={() => onEmployeeClick(employee)}
          onEdit={onEditEmployee ? () => onEditEmployee(employee) : undefined}
          showEditButton={showEditButton}
        />
      ))}
    </div>
  );
};

export default EmployeeList;