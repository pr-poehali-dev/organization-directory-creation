import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface UpdateReminderProps {
  onConfirm: () => void;
  onClose: () => void;
}

const UpdateReminder = ({ onConfirm, onClose }: UpdateReminderProps) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  
  if (day < 10 || day > 15) {
    return null;
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <Icon name="Clock" size={16} className="text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-orange-800">
          Пожалуйста, проверьте актуальность ваших данных в справочнике. 
          Это необходимо делать ежемесячно с 10 по 15 число.
        </span>
        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Подтвердить
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
          >
            Позже
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default UpdateReminder;