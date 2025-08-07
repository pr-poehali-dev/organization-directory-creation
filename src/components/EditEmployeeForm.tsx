import React, { useState } from 'react';
import { Employee } from '@/types/directory';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface EditEmployeeFormProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Employee>) => void;
}

const EditEmployeeForm = ({ employee, isOpen, onClose, onSave }: EditEmployeeFormProps) => {
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    middleName: employee.middleName,
    position: employee.position,
    department: employee.department,
    ministry: employee.ministry,
    workPhone: employee.workPhone,
    internalPhone: employee.internalPhone,
    mobilePhone: employee.mobilePhone,
    email: employee.email,
    address: {
      street: employee.address.street,
      building: employee.address.building,
      office: employee.address.office
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Должность обязательна';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Подразделение обязательно';
    }
    if (!formData.workPhone.trim()) {
      newErrors.workPhone = 'Рабочий телефон обязателен';
    }
    if (!formData.mobilePhone.trim()) {
      newErrors.mobilePhone = 'Мобильный телефон обязателен';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updates = {
      ...formData,
      lastUpdated: new Date(),
      needsUpdate: false
    };

    onSave(employee.id, updates);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Edit" size={20} />
            Редактировать сотрудника
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Имя *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Отчество</Label>
            <Input
              id="middleName"
              value={formData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Должность *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className={errors.position ? 'border-red-500' : ''}
            />
            {errors.position && (
              <p className="text-sm text-red-600">{errors.position}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Структурное подразделение *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className={errors.department ? 'border-red-500' : ''}
            />
            {errors.department && (
              <p className="text-sm text-red-600">{errors.department}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ministry">Министерство</Label>
            <Select value={formData.ministry} onValueChange={(value) => handleInputChange('ministry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите министерство" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Министерство цифрового развития">Министерство цифрового развития</SelectItem>
                <SelectItem value="Министерство экономики">Министерство экономики</SelectItem>
                <SelectItem value="Министерство образования">Министерство образования</SelectItem>
                <SelectItem value="Министерство здравоохранения">Министерство здравоохранения</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workPhone">Рабочий телефон *</Label>
              <Input
                id="workPhone"
                value={formData.workPhone}
                onChange={(e) => handleInputChange('workPhone', e.target.value)}
                placeholder="+7 (495) 123-45-67"
                className={errors.workPhone ? 'border-red-500' : ''}
              />
              {errors.workPhone && (
                <p className="text-sm text-red-600">{errors.workPhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalPhone">Внутренний номер</Label>
              <Input
                id="internalPhone"
                value={formData.internalPhone}
                onChange={(e) => handleInputChange('internalPhone', e.target.value)}
                placeholder="1234"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobilePhone">Мобильный телефон *</Label>
            <Input
              id="mobilePhone"
              value={formData.mobilePhone}
              onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
              placeholder="+7 (900) 123-45-67"
              className={errors.mobilePhone ? 'border-red-500' : ''}
            />
            {errors.mobilePhone && (
              <p className="text-sm text-red-600">{errors.mobilePhone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Электронная почта *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@ministry.gov.ru"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Адрес нахождения</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Улица</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="ул. Примерная"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="building">Дом</Label>
                <Input
                  id="building"
                  value={formData.address.building}
                  onChange={(e) => handleAddressChange('building', e.target.value)}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="office">Кабинет</Label>
                <Input
                  id="office"
                  value={formData.address.office}
                  onChange={(e) => handleAddressChange('office', e.target.value)}
                  placeholder="101"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button type="submit">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить изменения
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeForm;