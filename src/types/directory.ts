export type UserRole = 'admin' | 'department_head' | 'user';

export interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  position: string;
  department: string;
  ministry: string;
  workPhone: string;
  internalPhone: string;
  mobilePhone: string;
  address: {
    street: string;
    building: string;
    office: string;
  };
  email: string;
  lastUpdated: Date;
  needsUpdate: boolean;
}

export interface User {
  id: string;
  employeeId: string;
  role: UserRole;
  username: string;
  password: string;
  lastLogin: Date;
  departmentAccess?: string[];
}

export interface DirectorySettings {
  organizationName: string;
  departments: string[];
  ministries: string[];
  updateReminderEnabled: boolean;
  updateReminderStartDate: number;
  updateReminderEndDate: number;
}