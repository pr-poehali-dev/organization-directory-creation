import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types/directory';
import { useAuth } from '@/context/AuthContext';
import { mockSettings } from '@/data/mockData';

interface AddEmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'>) => void;
}

const AddEmployeeForm = ({ isOpen, onClose, onSave }: AddEmployeeFormProps) => {
  const { user, hasRole } = useAuth();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    position: '',
    department: '',
    ministry: '',
    workPhone: '',
    internalPhone: '',
    mobilePhone: '',
    street: '',
    building: '',
    office: '',
    email: ''
  });

  const availableDepartments = hasRole('admin') 
    ? mockSettings.departments 
    : user?.departmentAccess || [];

  const availableMinistries = hasRole('admin')
    ? mockSettings.ministries
    : [mockSettings.organizationName];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEmployee: Omit<Employee, 'id'> = {
      lastName: formData.lastName,
      firstName: formData.firstName,
      middleName: formData.middleName,
      position: formData.position,
      department: formData.department,
      ministry: formData.ministry,
      workPhone: formData.workPhone,
      internalPhone: formData.internalPhone,
      mobilePhone: formData.mobilePhone,
      address: {
        street: formData.street,
        building: formData.building,
        office: formData.office
      },
      email: formData.email,
      lastUpdated: new Date(),
      needsUpdate: false
    };

    onSave(newEmployee);
    onClose();
    setFormData({
      lastName: '',
      firstName: '',
      middleName: '',
      position: '',
      department: '',
      ministry: '',
      workPhone: '',
      internalPhone: '',
      mobilePhone: '',
      street: '',
      building: '',
      office: '',
      email: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить сотрудника</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lastName">Фамилия *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="firstName">Имя *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="middleName">Отчество *</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="position">Должность *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Структурное подразделение *</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleInputChange('department', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите подразделение" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Министерство *</Label>
              <Select 
                value={formData.ministry} 
                onValueChange={(value) => handleInputChange('ministry', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите министерство" />
                </SelectTrigger>
                <SelectContent>
                  {availableMinistries.map((ministry) => (
                    <SelectItem key={ministry} value={ministry}>
                      {ministry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="workPhone">Рабочий телефон *</Label>
              <Input
                id="workPhone"
                value={formData.workPhone}
                onChange={(e) => handleInputChange('workPhone', e.target.value)}
                placeholder="+7 (495) 123-45-67"
                required
              />
            </div>
            <div>
              <Label htmlFor="internalPhone">Внутренний номер</Label>
              <Input
                id="internalPhone"
                value={formData.internalPhone}
                onChange={(e) => handleInputChange('internalPhone', e.target.value)}
                placeholder="1001"
              />
            </div>
            <div>
              <Label htmlFor="mobilePhone">Мобильный телефон</Label>
              <Input
                id="mobilePhone"
                value={formData.mobilePhone}
                onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                placeholder="+7 (915) 123-45-67"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="street">Улица *</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="building">Дом *</Label>
              <Input
                id="building"
                value={formData.building}
                onChange={(e) => handleInputChange('building', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="office">Кабинет *</Label>
              <Input
                id="office"
                value={formData.office}
                onChange={(e) => handleInputChange('office', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeForm;