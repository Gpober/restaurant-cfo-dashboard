"use client";

import React, { useState } from 'react';
import { 
  Calendar, Download, RefreshCw, Plus, X, ChevronDown, ChevronRight, 
  ArrowUp, ArrowDown, TrendingUp, DollarSign, PieChart, BarChart3, 
  Users, UserPlus, UserCheck, UserX, Settings, Bell, Search, Filter,
  Building2, Key, Wrench, CreditCard, AlertTriangle, CheckCircle,
  FileText, Calculator, Receipt, Clock, Edit3, Trash2, Eye,
  MapPin, Phone, Mail, Briefcase, Award, Target, ChefHat, Utensils, Home, Menu
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area,
  ComposedChart
} from 'recharts';

// Restaurant CFO Brand Colors
const BRAND_COLORS = {
  primary: '#56B6E9',
  secondary: '#3A9BD1',
  tertiary: '#7CC4ED',
  accent: '#2E86C1',
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  }
};

// Type definitions
interface RestaurantEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  employeeType: 'full-time' | 'part-time' | 'contractor';
  payType: 'salary' | 'hourly';
  salary?: number;
  hourlyRate?: number;
  startDate: string;
  status: 'active' | 'inactive' | 'terminated';
  address: string;
  taxId: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  benefits: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    retirement401k: boolean;
    paidTimeOff: number;
  };
  certifications: string[];
  avgHoursPerWeek?: number;
}

interface PayrollRun {
  id: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  totalTaxes: number;
  totalTips: number;
}

interface TaxLiability {
  id: string;
  taxType: 'federal' | 'state' | 'local' | 'unemployment' | 'workers-comp';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  quarter: string;
  year: number;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

interface NewEmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  employeeType: 'full-time' | 'part-time' | 'contractor';
  payType: 'salary' | 'hourly';
  salary: string;
  hourlyRate: string;
  startDate: string;
  address: string;
  taxId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  healthInsurance: boolean;
  dentalInsurance: boolean;
  retirement401k: boolean;
  paidTimeOff: string;
  certifications: string[];
}

// Restaurant CFO Logo Component
const IAMCFOLogo = ({ className = "w-8 h-8 sm:w-12 sm:h-12" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center relative`}>
    <img 
      src="/favicon.png" 
      alt="IAM CFO Logo" 
      className="w-full h-full object-contain rounded"
      style={{ minWidth: '32px', minHeight: '32px' }}
    />
  </div>
);

export default function RestaurantPayrollPage() {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'payroll-runs' | 'tax-center'>('overview');
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  const [newEmployeeModalOpen, setNewEmployeeModalOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [newEmployeeForm, setNewEmployeeForm] = useState<NewEmployeeForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    location: '',
    employeeType: 'full-time',
    payType: 'hourly',
    salary: '',
    hourlyRate: '',
    startDate: '',
    address: '',
    taxId: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    healthInsurance: false,
    dentalInsurance: false,
    retirement401k: false,
    paidTimeOff: '10',
    certifications: []
  });

  // Restaurant-specific sample data
  const employees: RestaurantEmployee[] = [
    {
      id: '1',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@restaurant.com',
      phone: '(555) 123-4567',
      position: 'Head Chef',
      department: 'Kitchen',
      location: 'Downtown Location',
      employeeType: 'full-time',
      payType: 'salary',
      salary: 75000,
      startDate: '2023-01-15',
      status: 'active',
      address: '123 Main St, Miami, FL 33101',
      taxId: '123-45-6789',
      emergencyContact: {
        name: 'Carlos Garcia',
        phone: '(555) 987-6543',
        relationship: 'Spouse'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        retirement401k: true,
        paidTimeOff: 20
      },
      certifications: ['ServSafe Manager', 'Food Safety'],
      avgHoursPerWeek: 45
    },
    {
      id: '2',
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@restaurant.com',
      phone: '(555) 234-5678',
      position: 'Server',
      department: 'Front of House',
      location: 'Downtown Location',
      employeeType: 'full-time',
      payType: 'hourly',
      hourlyRate: 15.50,
      startDate: '2022-08-22',
      status: 'active',
      address: '456 Oak Ave, Miami, FL 33102',
      taxId: '234-56-7890',
      emergencyContact: {
        name: 'Sarah Wilson',
        phone: '(555) 876-5432',
        relationship: 'Sister'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: false,
        retirement401k: true,
        paidTimeOff: 15
      },
      certifications: ['Food Handler', 'Alcohol Service'],
      avgHoursPerWeek: 38
    },
    {
      id: '3',
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@restaurant.com',
      phone: '(555) 345-6789',
      position: 'Line Cook',
      department: 'Kitchen',
      location: 'Westside Branch',
      employeeType: 'full-time',
      payType: 'hourly',
      hourlyRate: 18.75,
      startDate: '2023-03-10',
      status: 'active',
      address: '789 Pine St, Miami, FL 33103',
      taxId: '345-67-8901',
      emergencyContact: {
        name: 'Lisa Chen',
        phone: '(555) 765-4321',
        relationship: 'Mother'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: false,
        retirement401k: false,
        paidTimeOff: 12
      },
      certifications: ['Food Handler', 'Knife Safety'],
      avgHoursPerWeek: 42
    },
    {
      id: '4',
      firstName: 'Ashley',
      lastName: 'Thompson',
      email: 'ashley.thompson@restaurant.com',
      phone: '(555) 456-7890',
      position: 'Bartender',
      department: 'Front of House',
      location: 'Downtown Location',
      employeeType: 'part-time',
      payType: 'hourly',
      hourlyRate: 16.25,
      startDate: '2023-06-01',
      status: 'active',
      address: '321 Elm St, Miami, FL 33104',
      taxId: '456-78-9012',
      emergencyContact: {
        name: 'Michael Thompson',
        phone: '(555) 654-3210',
        relationship: 'Father'
      },
      benefits: {
        healthInsurance: false,
        dentalInsurance: false,
        retirement401k: false,
        paidTimeOff: 8
      },
      certifications: ['Alcohol Service', 'Mixology'],
      avgHoursPerWeek: 25
    },
    {
      id: '5',
      firstName: 'Roberto',
      lastName: 'Martinez',
      email: 'roberto.martinez@restaurant.com',
      phone: '(555) 567-8901',
      position: 'General Manager',
      department: 'Management',
      location: 'Westside Branch',
      employeeType: 'full-time',
      payType: 'salary',
      salary: 65000,
      startDate: '2022-11-14',
      status: 'active',
      address: '654 Maple Dr, Miami, FL 33105',
      taxId: '567-89-0123',
      emergencyContact: {
        name: 'Carmen Martinez',
        phone: '(555) 543-2109',
        relationship: 'Wife'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        retirement401k: true,
        paidTimeOff: 18
      },
      certifications: ['ServSafe Manager', 'Restaurant Management'],
      avgHoursPerWeek: 50
    },
    {
      id: '6',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@restaurant.com',
      phone: '(555) 678-9012',
      position: 'Prep Cook',
      department: 'Kitchen',
      location: 'Mall Food Court',
      employeeType: 'part-time',
      payType: 'hourly',
      hourlyRate: 16.00,
      startDate: '2023-09-15',
      status: 'active',
      address: '987 Beach Blvd, Miami, FL 33106',
      taxId: '678-90-1234',
      emergencyContact: {
        name: 'Juan Rodriguez',
        phone: '(555) 432-1098',
        relationship: 'Brother'
      },
      benefits: {
        healthInsurance: false,
        dentalInsurance: false,
        retirement401k: false,
        paidTimeOff: 6
      },
      certifications: ['Food Handler'],
      avgHoursPerWeek: 20
    },
    {
      id: '7',
      firstName: 'Kevin',
      lastName: 'Brown',
      email: 'kevin.brown@restaurant.com',
      phone: '(555) 789-0123',
      position: 'Host',
      department: 'Front of House',
      location: 'Mall Food Court',
      employeeType: 'part-time',
      payType: 'hourly',
      hourlyRate: 14.50,
      startDate: '2024-01-08',
      status: 'active',
      address: '147 Sunset Ave, Miami, FL 33107',
      taxId: '789-01-2345',
      emergencyContact: {
        name: 'Patricia Brown',
        phone: '(555) 321-0987',
        relationship: 'Mother'
      },
      benefits: {
        healthInsurance: false,
        dentalInsurance: false,
        retirement401k: false,
        paidTimeOff: 5
      },
      certifications: ['Customer Service'],
      avgHoursPerWeek: 22
    }
  ];

  const payrollRuns: PayrollRun[] = [
    {
      id: '1',
      payPeriodStart: '2025-06-16',
      payPeriodEnd: '2025-06-30',
      payDate: '2025-07-05',
      status: 'processing',
      totalEmployees: 7,
      totalGrossPay: 22150,
      totalDeductions: 4890,
      totalNetPay: 17260,
      totalTaxes: 3850,
      totalTips: 4200
    },
    {
      id: '2',
      payPeriodStart: '2025-06-01',
      payPeriodEnd: '2025-06-15',
      payDate: '2025-06-20',
      status: 'completed',
      totalEmployees: 7,
      totalGrossPay: 21750,
      totalDeductions: 4650,
      totalNetPay: 17100,
      totalTaxes: 3780,
      totalTips: 3950
    },
    {
      id: '3',
      payPeriodStart: '2025-05-16',
      payPeriodEnd: '2025-05-31',
      payDate: '2025-06-05',
      status: 'completed',
      totalEmployees: 6,
      totalGrossPay: 19800,
      totalDeductions: 4225,
      totalNetPay: 15575,
      totalTaxes: 3445,
      totalTips: 3680
    }
  ];

  const taxLiabilities: TaxLiability[] = [
    {
      id: '1',
      taxType: 'federal',
      amount: 12450,
      dueDate: '2025-07-15',
      status: 'pending',
      quarter: 'Q2',
      year: 2025
    },
    {
      id: '2',
      taxType: 'state',
      amount: 4800,
      dueDate: '2025-07-15',
      status: 'pending',
      quarter: 'Q2',
      year: 2025
    },
    {
      id: '3',
      taxType: 'unemployment',
      amount: 2250,
      dueDate: '2025-07-31',
      status: 'pending',
      quarter: 'Q2',
      year: 2025
    },
    {
      id: '4',
      taxType: 'workers-comp',
      amount: 1850,
      dueDate: '2025-08-15',
      status: 'pending',
      quarter: 'Q2',
      year: 2025
    }
  ];

  const departments = ['All Departments', 'Kitchen', 'Front of House', 'Management'];
  const locations = ['All Locations', 'Downtown Location', 'Westside Branch', 'Mall Food Court'];
  const restaurantPositions = ['Head Chef', 'Sous Chef', 'Line Cook', 'Prep Cook', 'Server', 'Bartender', 'Host/Hostess', 'General Manager', 'Assistant Manager', 'Dishwasher', 'Food Runner'];

  // Utility functions
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toLocaleString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const showNotification = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'cancelled':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionIcon = (position: string) => {
    if (position.toLowerCase().includes('chef') || position.toLowerCase().includes('cook')) {
      return <ChefHat className="w-4 h-4" />;
    } else if (position.toLowerCase().includes('server') || position.toLowerCase().includes('bartender') || position.toLowerCase().includes('host')) {
      return <Utensils className="w-4 h-4" />;
    } else if (position.toLowerCase().includes('manager')) {
      return <Briefcase className="w-4 h-4" />;
    } else {
      return <Users className="w-4 h-4" />;
    }
  };

  const getFilteredEmployees = () => {
    return employees.filter(employee => {
      const matchesDepartment = departmentFilter === 'All Departments' || employee.department === departmentFilter;
      const matchesLocation = locationFilter === 'All Locations' || employee.location === locationFilter;
      const matchesSearch = searchTerm === '' || 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDepartment && matchesLocation && matchesSearch;
    });
  };

  const calculatePayrollSummary = () => {
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const totalEmployees = activeEmployees.length;
    
    const monthlyPayroll = activeEmployees.reduce((sum, emp) => {
      if (emp.payType === 'salary' && emp.salary) {
        return sum + (emp.salary / 12);
      } else if (emp.payType === 'hourly' && emp.hourlyRate && emp.avgHoursPerWeek) {
        const monthlyHours = (emp.avgHoursPerWeek * 52) / 12;
        return sum + (emp.hourlyRate * monthlyHours);
      }
      return sum;
    }, 0);

    const annualPayroll = monthlyPayroll * 12;
    const quarterlyTaxes = payrollRuns.slice(0, 3).reduce((sum, run) => sum + run.totalTaxes, 0);
    const monthlyTips = payrollRuns.slice(0, 2).reduce((sum, run) => sum + run.totalTips, 0) / 2;
    
    return {
      totalEmployees,
      monthlyPayroll,
      annualPayroll,
      quarterlyTaxes,
      monthlyTips,
      avgSalary: totalEmployees > 0 ? annualPayroll / totalEmployees : 0
    };
  };

  const generatePayrollTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      grossPay: 18000 + (index * 800) + Math.random() * 1000,
      netPay: 14000 + (index * 600) + Math.random() * 750,
      taxes: 3200 + (index * 150) + Math.random() * 200,
      tips: 3500 + (index * 200) + Math.random() * 300,
      deductions: 3800 + (index * 100) + Math.random() * 150
    }));
  };

  const generateDepartmentCostData = () => {
    const deptData = departments.slice(1).map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept);
      const monthlyCost = deptEmployees.reduce((sum, emp) => {
        if (emp.payType === 'salary' && emp.salary) {
          return sum + (emp.salary / 12);
        } else if (emp.payType === 'hourly' && emp.hourlyRate && emp.avgHoursPerWeek) {
          const monthlyHours = (emp.avgHoursPerWeek * 52) / 12;
          return sum + (emp.hourlyRate * monthlyHours);
        }
        return sum;
      }, 0);
      
      return {
        department: dept,
        cost: monthlyCost,
        employees: deptEmployees.length
      };
    });
    
    return deptData;
  };

  const generateLocationData = () => {
    const locationData = locations.slice(1).map(location => {
      const locationEmployees = employees.filter(emp => emp.location === location);
      const monthlyCost = locationEmployees.reduce((sum, emp) => {
        if (emp.payType === 'salary' && emp.salary) {
          return sum + (emp.salary / 12);
        } else if (emp.payType === 'hourly' && emp.hourlyRate && emp.avgHoursPerWeek) {
          const monthlyHours = (emp.avgHoursPerWeek * 52) / 12;
          return sum + (emp.hourlyRate * monthlyHours);
        }
        return sum;
      }, 0);
      
      return {
        location: location.replace(' Location', '').replace(' Branch', '').replace(' Food Court', ' Mall'),
        cost: monthlyCost,
        employees: locationEmployees.length
      };
    });
    
    return locationData;
  };

  const handleNewEmployee = () => {
    if (!newEmployeeForm.firstName || !newEmployeeForm.lastName || !newEmployeeForm.email || 
        !newEmployeeForm.position || !newEmployeeForm.department || !newEmployeeForm.location || !newEmployeeForm.startDate) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    showNotification('Restaurant employee added successfully!', 'success');
    setNewEmployeeModalOpen(false);
    setNewEmployeeForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      location: '',
      employeeType: 'full-time',
      payType: 'hourly',
      salary: '',
      hourlyRate: '',
      startDate: '',
      address: '',
      taxId: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      healthInsurance: false,
      dentalInsurance: false,
      retirement401k: false,
      paidTimeOff: '10',
      certifications: []
    });
  };

  const payrollSummary = calculatePayrollSummary();
  const trendData = generatePayrollTrendData();
  const departmentData = generateDepartmentCostData();
  const locationData = generateLocationData();
  const filteredEmployees = getFilteredEmployees();

  const CHART_COLORS = [BRAND_COLORS.primary, BRAND_COLORS.success, BRAND_COLORS.warning, BRAND_COLORS.danger, BRAND_COLORS.secondary];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 sm:top-5 sm:right-5 sm:left-auto sm:transform-none z-50 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-white font-medium shadow-lg transition-all max-w-xs sm:max-w-none text-sm sm:text-base ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* New Employee Modal - Mobile Optimized */}
      {newEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Staff Member</h2>
                <button
                  onClick={() => setNewEmployeeModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={newEmployeeForm.firstName}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={newEmployeeForm.lastName}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newEmployeeForm.email}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newEmployeeForm.phone}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Job Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                    <select
                      value={newEmployeeForm.position}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select position</option>
                      {restaurantPositions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                    <select
                      value={newEmployeeForm.department}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select department</option>
                      {departments.slice(1).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <select
                      value={newEmployeeForm.location}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select location</option>
                      {locations.slice(1).map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={newEmployeeForm.startDate}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Employment & Pay</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                    <select
                      value={newEmployeeForm.employeeType}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, employeeType: e.target.value as 'full-time' | 'part-time' | 'contractor' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pay Type</label>
                    <select
                      value={newEmployeeForm.payType}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, payType: e.target.value as 'salary' | 'hourly' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="salary">Salary</option>
                    </select>
                  </div>
                  {newEmployeeForm.payType === 'salary' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary</label>
                      <input
                        type="number"
                        value={newEmployeeForm.salary}
                        onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter annual salary"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newEmployeeForm.hourlyRate}
                        onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, hourlyRate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter hourly rate"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setNewEmployeeModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewEmployee}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IAMCFOLogo className="w-8 h-8 sm:w-12 sm:h-12 mr-2 sm:mr-4" />
              <div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">I AM CFO</h1>
                  <span className="text-xs sm:text-sm px-2 py-1 rounded-full text-white" style={{ backgroundColor: BRAND_COLORS.primary }}>
                    <span className="hidden sm:inline">Payroll Management</span>
                    <span className="sm:hidden">Payroll</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">Complete restaurant payroll • Tip reporting • Tax compliance • Employee management</p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg border border-gray-300 bg-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => setNewEmployeeModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden lg:inline">Add Staff</span>
              </button>
              <button
                onClick={() => showNotification('Payroll exported successfully', 'success')}
                className="flex items-center gap-2 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                style={{ backgroundColor: BRAND_COLORS.success }}
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="fixed top-0 right-0 w-80 max-w-full h-full bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Payroll Menu</h3>
                    <button onClick={() => setMobileMenuOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Tab Navigation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                      <div className="space-y-2">
                        {[
                          { key: 'overview', label: 'Overview', icon: '📊' },
                          { key: 'employees', label: 'Staff', icon: '👥' },
                          { key: 'payroll-runs', label: 'Payroll Runs', icon: '💰' },
                          { key: 'tax-center', label: 'Tax Center', icon: '📋' }
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => {
                              setActiveTab(tab.key as any);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                              activeTab === tab.key
                                ? 'text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={{ backgroundColor: activeTab === tab.key ? BRAND_COLORS.primary : undefined }}
                          >
                            <span className="mr-3">{tab.icon}</span>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4">
                      <button
                        onClick={() => {
                          setNewEmployeeModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg"
                        style={{ backgroundColor: BRAND_COLORS.primary }}
                      >
                        <UserPlus className="w-4 h-4" />
                        Add Staff Member
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Payroll exported successfully', 'success');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4" />
                        Export Report
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Data refreshed', 'info');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Desktop Tab Navigation */}
          <div className="hidden sm:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND_COLORS.primary }}>
              <span className="hidden sm:inline">Restaurant Payroll Management</span>
              <span className="sm:hidden">Payroll</span>
            </h2>
            <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
              {/* Tab Selector */}
              <div className="flex gap-1 sm:gap-2">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'employees', label: 'Staff' },
                  { key: 'payroll-runs', label: 'Payroll Runs' },
                  { key: 'tax-center', label: 'Tax Center' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === tab.key
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ backgroundColor: activeTab === tab.key ? BRAND_COLORS.primary : undefined }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="sm:hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: BRAND_COLORS.primary }}>Payroll Dashboard</h2>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {[
                { key: 'overview', label: 'Overview', icon: '📊' },
                { key: 'employees', label: 'Staff', icon: '👥' },
                { key: 'payroll-runs', label: 'Payroll', icon: '💰' },
                { key: 'tax-center', label: 'Taxes', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  style={{ backgroundColor: activeTab === tab.key ? BRAND_COLORS.primary : undefined }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.primary }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total Staff</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{payrollSummary.totalEmployees}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+2 this month</span>
                        <span className="sm:hidden">+2</span>
                      </div>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.primary }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.success }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Monthly Payroll</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(payrollSummary.monthlyPayroll)}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+5.2% vs last month</span>
                        <span className="sm:hidden">+5.2%</span>
                      </div>
                    </div>
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.success }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.secondary }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Monthly Tips</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(payrollSummary.monthlyTips)}</div>
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+3.8% vs last month</span>
                        <span className="sm:hidden">+3.8%</span>
                      </div>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.secondary }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.tertiary }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Average Pay</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(payrollSummary.avgSalary)}</div>
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+2.1% vs last year</span>
                        <span className="sm:hidden">+2.1%</span>
                      </div>
                    </div>
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.tertiary }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.danger }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Quarterly Taxes</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(payrollSummary.quarterlyTaxes)}</div>
                      <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">Due July 15th</span>
                        <span className="sm:hidden">Due 7/15</span>
                      </div>
                    </div>
                    <Receipt className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.danger }} />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Payroll Trend */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">6-Month Payroll Trend</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Gross pay, net pay, tips, taxes, and deductions</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <ComposedChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                        <Legend />
                        <Bar dataKey="grossPay" fill={BRAND_COLORS.primary} name="Gross Pay" />
                        <Line type="monotone" dataKey="netPay" stroke={BRAND_COLORS.success} strokeWidth={3} name="Net Pay" />
                        <Line type="monotone" dataKey="tips" stroke={BRAND_COLORS.secondary} strokeWidth={2} name="Tips" />
                        <Area dataKey="taxes" fill={BRAND_COLORS.danger} fillOpacity={0.3} name="Taxes" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Department Cost Breakdown */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Department Costs</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly payroll by department</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Monthly Cost']} />
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="cost"
                          label={({ department, percent }) => `${department}: ${(percent * 100).toFixed(0)}%`}
                          labelStyle={{ fontSize: 12 }}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Location Breakdown */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Location Costs</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly payroll by location</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={locationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Monthly Cost']} />
                        <Bar dataKey="cost" fill={BRAND_COLORS.secondary} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Payroll Runs */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Payroll Runs</h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {payrollRuns.slice(0, 3).map((run) => (
                        <div key={run.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-sm sm:text-base">
                              {formatDate(run.payPeriodStart)} - {formatDate(run.payPeriodEnd)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {run.totalEmployees} staff • Pay date: {formatDate(run.payDate)}
                            </div>
                            <div className="text-xs sm:text-sm text-green-600">
                              Tips: {formatCurrency(run.totalTips)}
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="font-medium text-gray-900 text-sm sm:text-base">{formatCurrency(run.totalNetPay)}</div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(run.status)}`}>
                              {run.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Staff Tab */}
          {activeTab === 'employees' && (
            <>
              {/* Mobile Filters */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white text-sm"
                >
                  <span>Filters & Search</span>
                  <Filter className="w-4 h-4" />
                </button>
                
                {mobileFiltersOpen && (
                  <div className="mt-3 p-4 border border-gray-300 rounded-lg bg-white space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search staff..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        {locations.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Showing {filteredEmployees.length} of {employees.length} staff members
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Filters */}
              <div className="hidden sm:flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-4 items-center">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
                    />
                  </div>

                  {/* Department Filter */}
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>

                  {/* Location Filter */}
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredEmployees.length} of {employees.length} staff members
                </div>
              </div>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg" style={{ backgroundColor: BRAND_COLORS.primary }}>
                            {employee.firstName[0]}{employee.lastName[0]}
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{employee.firstName} {employee.lastName}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                              {getPositionIcon(employee.position)}
                              <span className="ml-1 truncate">{employee.position}</span>
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{employee.department} • {employee.location}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>Started {formatDate(employee.startDate)}</span>
                        </div>
                        {employee.avgHoursPerWeek && (
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{employee.avgHoursPerWeek} hrs/week avg</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm text-gray-600">Compensation</span>
                          <span className="font-medium text-gray-900 text-xs sm:text-sm">
                            {employee.payType === 'salary' 
                              ? formatCurrency(employee.salary || 0) + '/year'
                              : formatCurrency(employee.hourlyRate || 0) + '/hour'
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm text-gray-600">Employment Type</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 capitalize">{employee.employeeType}</span>
                        </div>
                        
                        {employee.certifications.length > 0 && (
                          <div className="mb-4">
                            <span className="text-xs sm:text-sm text-gray-600">Certifications:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {employee.certifications.slice(0, 2).map((cert, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {cert}
                                </span>
                              ))}
                              {employee.certifications.length > 2 && (
                                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{employee.certifications.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => showNotification(`Viewing ${employee.firstName} ${employee.lastName}'s details`, 'info')}
                            className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => showNotification(`Editing ${employee.firstName} ${employee.lastName}'s profile`, 'info')}
                            className="flex-1 px-3 py-2 text-xs sm:text-sm text-white rounded-lg hover:opacity-90 transition-colors"
                            style={{ backgroundColor: BRAND_COLORS.primary }}
                          >
                            <Edit3 className="w-4 h-4 inline mr-1" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Payroll Runs Tab */}
          {activeTab === 'payroll-runs' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Restaurant Payroll Processing History</h3>
                  <button
                    onClick={() => showNotification('New restaurant payroll run created', 'success')}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                    style={{ backgroundColor: BRAND_COLORS.primary }}
                  >
                    <Plus className="w-4 h-4" />
                    New Payroll Run
                  </button>
                </div>
              </div>
              
              {/* Mobile Payroll Runs */}
              <div className="sm:hidden">
                <div className="p-4 space-y-4">
                  {payrollRuns.map((run) => (
                    <div key={run.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {formatDate(run.payPeriodStart)} - {formatDate(run.payPeriodEnd)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Pay date: {formatDate(run.payDate)}
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(run.status)}`}>
                          {run.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Staff:</span>
                          <span className="ml-2 font-medium">{run.totalEmployees}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gross Pay:</span>
                          <span className="ml-2 font-medium">{formatCurrency(run.totalGrossPay)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tips:</span>
                          <span className="ml-2 font-medium text-green-600">{formatCurrency(run.totalTips)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Net Pay:</span>
                          <span className="ml-2 font-medium">{formatCurrency(run.totalNetPay)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                        <button
                          onClick={() => showNotification(`Viewing payroll run details`, 'info')}
                          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          View Details
                        </button>
                        {run.status === 'completed' && (
                          <button
                            onClick={() => showNotification(`Pay stubs downloaded`, 'success')}
                            className="flex-1 text-xs px-3 py-2 text-white rounded-lg hover:opacity-90"
                            style={{ backgroundColor: BRAND_COLORS.primary }}
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tips</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payrollRuns.map((run) => (
                      <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(run.payPeriodStart)} - {formatDate(run.payPeriodEnd)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(run.payDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {run.totalEmployees}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(run.totalGrossPay)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {formatCurrency(run.totalTips)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(run.totalNetPay)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(run.status)}`}>
                            {run.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => showNotification(`Viewing payroll run details`, 'info')}
                            className="hover:text-gray-900 mr-3"
                            style={{ color: BRAND_COLORS.primary }}
                          >
                            View Details
                          </button>
                          {run.status === 'completed' && (
                            <button
                              onClick={() => showNotification(`Pay stubs downloaded`, 'success')}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tax Center Tab */}
          {activeTab === 'tax-center' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Tax Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.danger }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total Tax Liability</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">
                        {formatCurrency(taxLiabilities.reduce((sum, tax) => sum + tax.amount, 0))}
                      </div>
                      <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">4 payments due</span>
                        <span className="sm:hidden">4 due</span>
                      </div>
                    </div>
                    <Receipt className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.danger }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.warning }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Next Payment Due</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">July 15</div>
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">Federal & State</span>
                        <span className="sm:hidden">Fed & State</span>
                      </div>
                    </div>
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.warning }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.success }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">YTD Tax Paid</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(22800)}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">On schedule</span>
                        <span className="sm:hidden">On track</span>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.success }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.secondary }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Tip Reporting</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(payrollSummary.monthlyTips * 6)}</div>
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">YTD Tips Reported</span>
                        <span className="sm:hidden">YTD Tips</span>
                      </div>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.secondary }} />
                  </div>
                </div>
              </div>

              {/* Tax Liabilities */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Upcoming Tax Liabilities</h3>
                    <button
                      onClick={() => showNotification('Tax payment scheduled', 'success')}
                      className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                      style={{ backgroundColor: BRAND_COLORS.primary }}
                    >
                      <Plus className="w-4 h-4" />
                      Schedule Payment
                    </button>
                  </div>
                </div>
                
                {/* Mobile Tax Liabilities */}
                <div className="sm:hidden">
                  <div className="p-4 space-y-4">
                    {taxLiabilities.map((tax) => (
                      <div key={tax.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium text-gray-900 text-sm capitalize">
                              {tax.taxType.replace('-', ' ')}
                            </div>
                            <div className="text-xs text-gray-600">
                              {tax.quarter} {tax.year}
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tax.status)}`}>
                            {tax.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Amount:</span>
                            <span className="ml-2 font-medium">{formatCurrency(tax.amount)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Due:</span>
                            <span className="ml-2 font-medium">{formatDate(tax.dueDate)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => showNotification(`Processing payment for ${tax.taxType} tax`, 'info')}
                            className="flex-1 text-xs px-3 py-2 text-white rounded-lg hover:opacity-90"
                            style={{ backgroundColor: BRAND_COLORS.primary }}
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() => showNotification(`Viewing ${tax.taxType} tax details`, 'info')}
                            className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quarter</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxLiabilities.map((tax) => (
                        <tr key={tax.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {tax.taxType.replace('-', ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tax.quarter} {tax.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(tax.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(tax.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tax.status)}`}>
                              {tax.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => showNotification(`Processing payment for ${tax.taxType} tax`, 'info')}
                              className="hover:text-gray-900 mr-3"
                              style={{ color: BRAND_COLORS.primary }}
                            >
                              Pay Now
                            </button>
                            <button
                              onClick={() => showNotification(`Viewing ${tax.taxType} tax details`, 'info')}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance Alerts */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Restaurant Compliance & Alerts</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-yellow-800">Tip Reporting Due</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Monthly tip reporting for June is due by July 10th. All tipped employees' tip income must be reported.
                        </p>
                        <button
                          onClick={() => showNotification('Opening tip reporting form', 'info')}
                          className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
                        >
                          Submit Report →
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-blue-800">Quarterly Forms Available</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Q2 2025 forms (941, 940, state unemployment) are ready for review and submission.
                        </p>
                        <button
                          onClick={() => showNotification('Downloading quarterly forms', 'success')}
                          className="mt-2 text-sm font-medium text-blue-800 hover:text-blue-900"
                        >
                          Download Forms →
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-green-800">ServSafe Certifications Up to Date</h4>
                        <p className="text-sm text-green-700 mt-1">
                          All kitchen staff have current food safety certifications. Next renewal due: March 2026.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-red-800">Workers' Compensation Premium Due</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Annual workers' compensation insurance premium of $1,850 is due August 15th.
                        </p>
                        <button
                          onClick={() => showNotification('Scheduling workers comp payment', 'info')}
                          className="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
                        >
                          Schedule Payment →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
