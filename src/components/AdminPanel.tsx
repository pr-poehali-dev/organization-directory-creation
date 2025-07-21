import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Organization } from '@/types/directory';
import { mockSettings } from '@/data/mockData';
import Icon from '@/components/ui/icon';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: Organization[];
  onUpdateOrganization: (id: string, updates: Partial<Organization>) => void;
  onDeleteOrganization: (id: string) => void;
}

const AdminPanel = ({ 
  isOpen, 
  onClose, 
  organizations, 
  onUpdateOrganization,
  onDeleteOrganization 
}: AdminPanelProps) => {
  const [editingOrg, setEditingOrg] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    departments: [] as string[],
    newDepartment: ''
  });

  const [globalSettings, setGlobalSettings] = useState(mockSettings);
  const [newMinistry, setNewMinistry] = useState('');

  const startEditingOrganization = (org: Organization) => {
    setEditingOrg(org.id);
    setEditForm({
      name: org.name,
      departments: [...org.departments],
      newDepartment: ''
    });
  };

  const saveOrganization = () => {
    if (editingOrg) {
      onUpdateOrganization(editingOrg, {
        name: editForm.name,
        departments: editForm.departments
      });
      setEditingOrg(null);
    }
  };

  const addDepartment = () => {
    const department = editForm.newDepartment.trim();
    if (department && !editForm.departments.includes(department)) {
      setEditForm(prev => ({
        ...prev,
        departments: [...prev.departments, department],
        newDepartment: ''
      }));
    }
  };

  const removeDepartment = (department: string) => {
    setEditForm(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== department)
    }));
  };

  const addMinistry = () => {
    const ministry = newMinistry.trim();
    if (ministry && !globalSettings.ministries.includes(ministry)) {
      setGlobalSettings(prev => ({
        ...prev,
        ministries: [...prev.ministries, ministry]
      }));
      setNewMinistry('');
    }
  };

  const removeMinistry = (ministry: string) => {
    setGlobalSettings(prev => ({
      ...prev,
      ministries: prev.ministries.filter(m => m !== ministry)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Панель администратора</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="organizations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="organizations">Организации</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-4">
            <div className="grid gap-4">
              {organizations.map((org) => (
                <Card key={org.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {editingOrg === org.id ? (
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="text-lg font-semibold"
                          />
                        ) : (
                          org.name
                        )}
                      </CardTitle>
                      <div className="flex gap-2">
                        {editingOrg === org.id ? (
                          <>
                            <Button size="sm" onClick={saveOrganization}>
                              <Icon name="Check" size={16} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingOrg(null)}>
                              <Icon name="X" size={16} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => startEditingOrganization(org)}>
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => onDeleteOrganization(org.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label className="text-sm font-medium">Подразделения:</Label>
                      {editingOrg === org.id ? (
                        <div className="mt-2 space-y-3">
                          <div className="flex gap-2">
                            <Input
                              value={editForm.newDepartment}
                              onChange={(e) => setEditForm(prev => ({ ...prev, newDepartment: e.target.value }))}
                              placeholder="Новое подразделение"
                              onKeyPress={(e) => e.key === 'Enter' && addDepartment()}
                            />
                            <Button onClick={addDepartment} disabled={!editForm.newDepartment.trim()}>
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {editForm.departments.map((dept) => (
                              <Badge key={dept} variant="secondary" className="flex items-center gap-1">
                                {dept}
                                <button
                                  onClick={() => removeDepartment(dept)}
                                  className="ml-1 hover:text-red-600"
                                >
                                  <Icon name="X" size={14} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {org.departments.map((dept) => (
                            <Badge key={dept} variant="outline">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Создана: {org.createdAt.toLocaleDateString('ru-RU')}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {organizations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Icon name="Building2" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Организации не созданы</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Общие министерства</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newMinistry}
                    onChange={(e) => setNewMinistry(e.target.value)}
                    placeholder="Название министерства"
                    onKeyPress={(e) => e.key === 'Enter' && addMinistry()}
                  />
                  <Button onClick={addMinistry} disabled={!newMinistry.trim()}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {globalSettings.ministries.map((ministry) => (
                    <Badge key={ministry} variant="secondary" className="flex items-center gap-1">
                      {ministry}
                      <button
                        onClick={() => removeMinistry(ministry)}
                        className="ml-1 hover:text-red-600"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={globalSettings.updateReminderEnabled}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        updateReminderEnabled: e.target.checked
                      }))}
                    />
                    Включить напоминания об актуализации
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Начало периода (день месяца)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={globalSettings.updateReminderStartDate}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        updateReminderStartDate: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Конец периода (день месяца)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={globalSettings.updateReminderEndDate}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        updateReminderEndDate: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;