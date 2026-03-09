import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'employee';

export interface User {
  username: string;
  role: UserRole;
}

export interface Employee {
  username: string;
  password: string;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  role: UserRole;
  action: string;
  machineId?: string;
  machineName?: string;
  details: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  addLog: (action: string, machineId?: string, machineName?: string, details?: string) => void;
  logs: ActivityLog[];
  employees: Employee[];
  addEmployee: (username: string, password: string) => boolean;
  removeEmployee: (username: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [adminPassword, setAdminPassword] = useState<string>('ad12');

  // Load user and logs from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedLogs = localStorage.getItem('logs');
    const savedEmployees = localStorage.getItem('employees');
    const savedAdminPassword = localStorage.getItem('adminPassword');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      // Convert timestamp strings back to Date objects
      setLogs(parsedLogs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })));
    }
    
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      // Initialize with default employee if no employees exist
      const defaultEmployee: Employee = { username: 'employee', password: 'em1' };
      setEmployees([defaultEmployee]);
      localStorage.setItem('employees', JSON.stringify([defaultEmployee]));
    }

    if (savedAdminPassword) {
      setAdminPassword(savedAdminPassword);
    }
  }, []);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // Admin authentication
    if (role === 'admin' && username === 'admin' && password === adminPassword) {
      const newUser = { username, role };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      addLog('Đăng nhập', undefined, undefined, 'Đăng nhập với vai trò Admin');
      return true;
    }
    
    // Employee authentication - check against registered employees
    if (role === 'employee') {
      const employee = employees.find(emp => emp.username === username && emp.password === password);
      if (employee) {
        const newUser = { username, role };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        addLog('Đăng nhập', undefined, undefined, 'Đăng nhập với vai trò Employee');
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    if (user) {
      addLog('Đăng xuất', undefined, undefined, `${user.username} đã đăng xuất`);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const addLog = (action: string, machineId?: string, machineName?: string, details?: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      user: user?.username || 'System',
      role: user?.role || 'employee',
      action,
      machineId,
      machineName,
      details: details || '',
    };
    
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('logs', JSON.stringify(updatedLogs));
  };

  const addEmployee = (username: string, password: string): boolean => {
    if (employees.some(emp => emp.username === username)) {
      return false;
    }
    const newEmployee: Employee = { username, password };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    return true;
  };

  const removeEmployee = (username: string) => {
    const updatedEmployees = employees.filter(emp => emp.username !== username);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (!user) return false;

    // Change password for admin
    if (user.role === 'admin') {
      if (oldPassword === adminPassword) {
        setAdminPassword(newPassword);
        localStorage.setItem('adminPassword', newPassword);
        addLog('Đổi mật khẩu', undefined, undefined, 'Admin đã thay đổi mật khẩu thành công');
        return true;
      }
      return false;
    }

    // Change password for employee
    if (user.role === 'employee') {
      const employeeIndex = employees.findIndex(emp => emp.username === user.username);
      if (employeeIndex !== -1 && employees[employeeIndex].password === oldPassword) {
        const updatedEmployees = [...employees];
        updatedEmployees[employeeIndex] = {
          ...updatedEmployees[employeeIndex],
          password: newPassword
        };
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        addLog('Đổi mật khẩu', undefined, undefined, `${user.username} đã thay đổi mật khẩu thành công`);
        return true;
      }
      return false;
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addLog, logs, employees, addEmployee, removeEmployee, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}