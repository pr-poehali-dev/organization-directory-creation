import { Employee, DirectorySettings } from '@/types/directory';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    lastName: 'Иванов',
    firstName: 'Петр',
    middleName: 'Сергеевич',
    position: 'Системный администратор',
    department: 'IT отдел',
    ministry: 'Министерство цифрового развития',
    workPhone: '+7 (495) 123-45-67',
    internalPhone: '1001',
    mobilePhone: '+7 (915) 123-45-67',
    address: {
      street: 'ул. Тверская',
      building: '15',
      office: '201'
    },
    email: 'p.ivanov@ministry.gov.ru',
    lastUpdated: new Date('2024-06-15'),
    needsUpdate: true
  },
  {
    id: '2',
    lastName: 'Петрова',
    firstName: 'Анна',
    middleName: 'Владимировна',
    position: 'Главный бухгалтер',
    department: 'Бухгалтерия',
    ministry: 'Министерство цифрового развития',
    workPhone: '+7 (495) 123-45-68',
    internalPhone: '1002',
    mobilePhone: '+7 (916) 234-56-78',
    address: {
      street: 'ул. Тверская',
      building: '15',
      office: '105'
    },
    email: 'a.petrova@ministry.gov.ru',
    lastUpdated: new Date('2024-07-01'),
    needsUpdate: false
  },
  {
    id: '3',
    lastName: 'Сидоров',
    firstName: 'Михаил',
    middleName: 'Александрович',
    position: 'Ведущий специалист',
    department: 'Отдел кадров',
    ministry: 'Министерство цифрового развития',
    workPhone: '+7 (495) 123-45-69',
    internalPhone: '1003',
    mobilePhone: '+7 (917) 345-67-89',
    address: {
      street: 'ул. Тверская',
      building: '15',
      office: '302'
    },
    email: 'm.sidorov@ministry.gov.ru',
    lastUpdated: new Date('2024-05-20'),
    needsUpdate: true
  }
];

export const mockSettings: DirectorySettings = {
  organizationName: 'Министерство цифрового развития',
  departments: ['IT отдел', 'Бухгалтерия', 'Отдел кадров', 'Юридический отдел'],
  ministries: ['Министерство цифрового развития', 'Министерство здравоохранения'],
  updateReminderEnabled: true,
  updateReminderStartDate: 10,
  updateReminderEndDate: 15
};