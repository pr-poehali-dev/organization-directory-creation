import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/types/directory';
import Icon from '@/components/ui/icon';

interface AddOrganizationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (organization: Omit<Organization, 'id'>) => void;
}

const AddOrganizationForm = ({ isOpen, onClose, onSave }: AddOrganizationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    departments: [] as string[],
    newDepartment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.departments.length === 0) {
      alert('Добавьте хотя бы одно подразделение');
      return;
    }

    const newOrganization: Omit<Organization, 'id'> = {
      name: formData.name,
      departments: formData.departments,
      createdAt: new Date()
    };

    onSave(newOrganization);
    onClose();
    setFormData({
      name: '',
      departments: [],
      newDepartment: ''
    });
  };

  const addDepartment = () => {
    const department = formData.newDepartment.trim();
    if (department && !formData.departments.includes(department)) {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, department],
        newDepartment: ''
      }));
    }
  };

  const removeDepartment = (department: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== department)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDepartment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить организацию</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="orgName">Название организации *</Label>
            <Input
              id="orgName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Министерство цифрового развития"
              required
            />
          </div>

          <div>
            <Label>Структурные подразделения *</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={formData.newDepartment}
                onChange={(e) => setFormData(prev => ({ ...prev, newDepartment: e.target.value }))}
                onKeyPress={handleKeyPress}
                placeholder="Название подразделения"
              />
              <Button type="button" onClick={addDepartment} disabled={!formData.newDepartment.trim()}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            
            {formData.departments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.departments.map((department) => (
                  <Badge key={department} variant="secondary" className="flex items-center gap-1">
                    {department}
                    <button
                      type="button"
                      onClick={() => removeDepartment(department)}
                      className="ml-1 hover:text-red-600"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {formData.departments.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Добавьте подразделения для организации
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">
              Создать организацию
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizationForm;