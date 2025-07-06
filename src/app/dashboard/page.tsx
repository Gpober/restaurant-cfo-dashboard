"use client";

import React, { useState } from 'react';
import { 
  Calendar, Download, RefreshCw, Plus, X, ChevronDown, ChevronRight, 
  ArrowUp, ArrowDown, TrendingUp, DollarSign, PieChart, BarChart3, 
  Home, Users, MapPin, Star, Settings, Bell, Search, Filter,
  Building2, Key, Wrench, CreditCard, AlertTriangle, CheckCircle,
  FileText, Calculator, Receipt, Zap, Link, Activity, UtensilsCrossed,
  Clock, ShoppingCart, ChefHat, Truck
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area,
  ComposedChart
} from 'recharts';

// Restaurant CFO Brand Colors (Updated to Blue Theme)
const BRAND_COLORS = {
  primary: '#56B6E9',      // Blue primary (from dashboard)
  secondary: '#3A9BD1',    // Darker blue
  tertiary: '#7CC4ED',     // Lighter blue
  accent: '#2E86C1',       // Deep blue accent
  success: '#27AE60',      // Keep green for success
  warning: '#F39C12',      // Keep orange for warning
  danger: '#E74C3C',       // Keep red for danger
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
interface Restaurant {
  id: string;
  name: string;
  location: string;
  type: 'fast-casual' | 'fine-dining' | 'quick-service' | 'cafe';
  status: 'open' | 'closed' | 'maintenance';
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  dailyCustomers: number;
  weeklyCustomers: number;
  monthlyCustomers: number;
  avgTicket: number;
  dailyLaborCost: number;
  weeklyLaborCost: number;
  monthlyLaborCost: number;
  dailyFoodCost: number;
  weeklyFoodCost: number;
  monthlyFoodCost: number;
  rating: number;
  color: string;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// IAM CFO Logo Component
const IAMCFOLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center relative`}>
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="55" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2"/>
      <circle cx="60" cy="60" r="42" fill={BRAND_COLORS.primary}/>
      <g fill="white">
        <rect x="35" y="70" width="6" height="15" rx="1"/>
        <rect x="44" y="65" width="6" height="20" rx="1"/>
        <rect x="53" y="55" width="6" height="30" rx="1"/>
        <rect x="62" y="50" width="6" height="35" rx="1"/>
        <rect x="71" y="60" width="6" height="25" rx="1"/>
        <rect x="80" y="45" width="6" height="40" rx="1"/>
        <path d="M35 72 L44 67 L53 57 L62 52 L71 62 L80 47" 
              stroke="#FFFFFF" strokeWidth="2.5" fill="none"/>
        <circle cx="35" cy="72" r="2.5" fill="#FFFFFF"/>
        <circle cx="44" cy="67" r="2.5" fill="#FFFFFF"/>
        <circle cx="53" cy="57" r="2.5" fill="#FFFFFF"/>
        <circle cx="62" cy="52" r="2.5" fill="#FFFFFF"/>
        <circle cx="71" cy="62" r="2.5" fill="#FFFFFF"/>
        <circle cx="80" cy="47" r="2.5" fill="#FFFFFF"/>
      </g>
      <text x="60" y="95" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">CFO</text>
    </svg>
  </div>
);

export default function RestaurantDashboard() {
  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  const [syncDropdownOpen, setSyncDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set(['all']));

  // Sample restaurant data with expanded timeframes
  const restaurants: Restaurant[] = [
    {
      id: 'downtown-main',
      name: 'Downtown Main',
      location: 'Miami Downtown, FL',
      type: 'fine-dining',
      status: 'open',
      dailyRevenue: 12500,
      weeklyRevenue: 87500,
      monthlyRevenue: 325000,
      quarterlyRevenue: 975000,
      dailyCustomers: 185,
      weeklyCustomers: 1295,
      monthlyCustomers: 5550,
      avgTicket: 67.50,
      dailyLaborCost: 4250,
      weeklyLaborCost: 29750,
      monthlyLaborCost: 127500,
      dailyFoodCost: 3750,
      weeklyFoodCost: 26250,
      monthlyFoodCost: 112500,
      rating: 4.7,
      color: BRAND_COLORS.primary
    },
    {
      id: 'beach-location',
      name: 'Beach Location',
      location: 'Miami Beach, FL',
      type: 'fast-casual',
      status: 'open',
      dailyRevenue: 8900,
      weeklyRevenue: 62300,
      monthlyRevenue: 232000,
      quarterlyRevenue: 696000,
      dailyCustomers: 245,
      weeklyCustomers: 1715,
      monthlyCustomers: 7350,
      avgTicket: 36.30,
      dailyLaborCost: 2850,
      weeklyLaborCost: 19950,
      monthlyLaborCost: 85500,
      dailyFoodCost: 2670,
      weeklyFoodCost: 18690,
      monthlyFoodCost: 80100,
      rating: 4.5,
      color: BRAND_COLORS.secondary
    },
    {
      id: 'airport-express',
      name: 'Airport Express',
      location: 'Miami Airport, FL',
      type: 'quick-service',
      status: 'open',
      dailyRevenue: 15200,
      weeklyRevenue: 106400,
      monthlyRevenue: 395000,
      quarterlyRevenue: 1185000,
      dailyCustomers: 580,
      weeklyCustomers: 4060,
      monthlyCustomers: 17400,
      avgTicket: 26.20,
      dailyLaborCost: 3040,
      weeklyLaborCost: 21280,
      monthlyLaborCost: 91200,
      dailyFoodCost: 4560,
      weeklyFoodCost: 31920,
      monthlyFoodCost: 136800,
      rating: 4.2,
      color: BRAND_COLORS.tertiary
    },
    {
      id: 'cafe-midtown',
      name: 'Midtown Café',
      location: 'Midtown Miami, FL',
      type: 'cafe',
      status: 'maintenance',
      dailyRevenue: 3200,
      weeklyRevenue: 22400,
      monthlyRevenue: 83000,
      quarterlyRevenue: 249000,
      dailyCustomers: 95,
      weeklyCustomers: 665,
      monthlyCustomers: 2850,
      avgTicket: 33.70,
      dailyLaborCost: 1280,
      weeklyLaborCost: 8960,
      monthlyLaborCost: 38400,
      dailyFoodCost: 960,
      weeklyFoodCost: 6720,
      monthlyFoodCost: 28800,
      rating: 4.6,
      color: BRAND_COLORS.warning
    }
  ];

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  const formatValue = (value: number | string, format: string): string => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value.toString();
    }
  };

  const showNotification = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  const handleLocationToggle = (locationId: string) => {
    const newSelected = new Set(selectedLocations);
    
    if (locationId === 'all') {
      if (newSelected.has('all')) {
        newSelected.clear();
        restaurants.forEach(r => newSelected.add(r.id));
      } else {
        newSelected.clear();
        newSelected.add('all');
      }
    } else {
      newSelected.delete('all');
      
      if (newSelected.has(locationId)) {
        newSelected.delete(locationId);
      } else {
        newSelected.add(locationId);
      }
      
      if (newSelected.size === restaurants.length && !newSelected.has('all')) {
        newSelected.clear();
        newSelected.add('all');
      }
      
      if (newSelected.size === 0) {
        newSelected.add('all');
      }
    }
    
    setSelectedLocations(newSelected);
  };

  const getSelectedLocationsText = () => {
    if (selectedLocations.has('all') || selectedLocations.size === 0) {
      return 'All Locations';
    }
    if (selectedLocations.size === 1) {
      const locationId = Array.from(selectedLocations)[0];
      const restaurant = restaurants.find(r => r.id === locationId);
      return restaurant?.name || '1 Location';
    }
    return `${selectedLocations.size} Locations Selected`;
  };

  const getFilteredRestaurants = () => {
    if (selectedLocations.has('all') || selectedLocations.size === 0) {
      return restaurants;
    }
    return restaurants.filter(restaurant => selectedLocations.has(restaurant.id));
  };

  const getRestaurantIcon = (type: string) => {
    switch (type) {
      case 'fine-dining':
        return '🍽️';
      case 'fast-casual':
        return '🍔';
      case 'quick-service':
        return '🚀';
      case 'cafe':
        return '☕';
      default:
        return '🏪';
    }
  };

  const getRevenueForTimeframe = (restaurant: Restaurant): number => {
    switch (selectedTimeframe) {
      case 'daily':
        return restaurant.dailyRevenue;
      case 'weekly':
        return restaurant.weeklyRevenue;
      case 'monthly':
        return restaurant.monthlyRevenue;
      case 'quarterly':
        return restaurant.quarterlyRevenue;
      default:
        return restaurant.monthlyRevenue;
    }
  };

  const getCustomerCountForTimeframe = (restaurant: Restaurant): number => {
    switch (selectedTimeframe) {
      case 'daily':
        return restaurant.dailyCustomers;
      case 'weekly':
        return restaurant.weeklyCustomers;
      case 'monthly':
        return restaurant.monthlyCustomers;
      case 'quarterly':
        return Math.floor(restaurant.monthlyCustomers * 3);
      default:
        return restaurant.dailyCustomers;
    }
  };

  const getLaborCostForTimeframe = (restaurant: Restaurant): number => {
    switch (selectedTimeframe) {
      case 'daily':
        return restaurant.dailyLaborCost;
      case 'weekly':
        return restaurant.weeklyLaborCost;
      case 'monthly':
        return restaurant.monthlyLaborCost;
      case 'quarterly':
        return Math.floor(restaurant.monthlyLaborCost * 3);
      default:
        return restaurant.dailyLaborCost;
    }
  };

  const getFoodCostForTimeframe = (restaurant: Restaurant): number => {
    switch (selectedTimeframe) {
      case 'daily':
        return restaurant.dailyFoodCost;
      case 'weekly':
        return restaurant.weeklyFoodCost;
      case 'monthly':
        return restaurant.monthlyFoodCost;
      case 'quarterly':
        return Math.floor(restaurant.monthlyFoodCost * 3);
      default:
        return restaurant.dailyFoodCost;
    }
  };

  const getTimeframeLabel = (): string => {
    switch (selectedTimeframe) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      default: return '';
    }
  };

  const getTimeframeMultiplier = (): number => {
    switch (selectedTimeframe) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 30;
      case 'quarterly': return 90;
      default: return 1;
    }
  };

  const getFilteredData = () => {
    const filteredRests = getFilteredRestaurants();
    const timeframeMultiplier = getTimeframeMultiplier();
    
    const totalRevenue = filteredRests.reduce((sum, r) => sum + getRevenueForTimeframe(r), 0);
    const avgOrderValue = filteredRests.length > 0 ? 
      filteredRests.reduce((sum, r) => sum + r.avgTicket, 0) / filteredRests.length : 0;
    
    const filteredSalesSummary = {
      totalRevenue: totalRevenue,
      totalOrders: Math.floor(totalRevenue / avgOrderValue),
      avgOrderValue: avgOrderValue,
      customerCount: filteredRests.reduce((sum, r) => sum + getCustomerCountForTimeframe(r), 0),
      repeatCustomers: Math.floor(filteredRests.reduce((sum, r) => sum + getCustomerCountForTimeframe(r), 0) * 0.55),
      peakHours: '12:00-2:00 PM, 6:00-8:00 PM'
    };

    const totalLaborCost = filteredRests.reduce((sum, r) => sum + getLaborCostForTimeframe(r), 0);
    const totalFoodCost = filteredRests.reduce((sum, r) => sum + getFoodCostForTimeframe(r), 0);
    const otherExpenses = totalRevenue * 0.095;

    const filteredFinancialSummary = {
      totalRevenue: totalRevenue,
      totalExpenses: totalLaborCost + totalFoodCost + otherExpenses,
      netIncome: totalRevenue - (totalLaborCost + totalFoodCost + otherExpenses),
      grossMargin: 68.5,
      operatingMargin: 30.0,
      cashFlow: Math.floor(totalRevenue * 0.275),
      foodCostPercentage: (totalFoodCost / totalRevenue) * 100,
      laborCostPercentage: (totalLaborCost / totalRevenue) * 100
    };

    // Calculate payroll based on filtered restaurants
    const estimatedEmployeesPerLocation = 12; // Average employees per location
    const totalEmployees = filteredRests.length * estimatedEmployeesPerLocation;
    const avgHoursPerEmployee = 140 * (timeframeMultiplier / 30); // Scale hours based on timeframe
    const totalHours = totalEmployees * avgHoursPerEmployee;
    const avgHourlyWage = totalHours > 0 ? totalLaborCost / totalHours : 19.87;

    const filteredPayrollSummary = {
      totalPayroll: totalLaborCost,
      activeEmployees: totalEmployees,
      hoursWorked: totalHours,
      avgHourlyWage: avgHourlyWage,
      payrollTaxes: Math.floor(totalLaborCost * 0.15), // 15% for payroll taxes
      benefits: Math.floor(totalLaborCost * 0.17) // 17% for benefits
    };

    return {
      restaurants: filteredRests,
      salesSummary: filteredSalesSummary,
      financialSummary: filteredFinancialSummary,
      payrollSummary: filteredPayrollSummary
    };
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate chart data based on timeframe
  const generateRevenueData = () => {
    const filteredRests = getFilteredRestaurants();
    const baseRevenue = filteredRests.reduce((sum, r) => sum + getRevenueForTimeframe(r), 0);
    
    let periods;
    
    switch (selectedTimeframe) {
      case 'daily':
        periods = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
        break;
      case 'weekly':
        periods = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case 'monthly':
        periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        break;
      case 'quarterly':
        periods = ['Month 1', 'Month 2', 'Month 3'];
        break;
      default:
        periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    }
    
    return periods.map((period, index) => ({
      period,
      revenue: Math.floor(baseRevenue * (0.7 + index * 0.05) + Math.random() * (baseRevenue * 0.1)),
      orders: Math.floor((baseRevenue / (filteredRests.length > 0 ? 
        filteredRests.reduce((sum, r) => sum + r.avgTicket, 0) / filteredRests.length : 56)) * 
        (0.6 + index * 0.08) + Math.random() * (baseRevenue * 0.01)),
      expenses: Math.floor(baseRevenue * 0.7 * (0.7 + index * 0.05) + Math.random() * (baseRevenue * 0.05)),
      customers: Math.floor((baseRevenue / (filteredRests.length > 0 ? 
        filteredRests.reduce((sum, r) => sum + r.avgTicket, 0) / filteredRests.length : 68)) * 
        (0.8 + index * 0.04) + Math.random() * (baseRevenue * 0.01))
    }));
  };

  const generateLocationBreakdown = () => {
    const filteredRests = getFilteredRestaurants();
    return filteredRests.map(restaurant => ({
      name: restaurant.name.split(' ')[0],
      revenue: getRevenueForTimeframe(restaurant),
      customers: getCustomerCountForTimeframe(restaurant),
      avgTicket: restaurant.avgTicket,
      laborCost: getLaborCostForTimeframe(restaurant)
    }));
  };

  const generateFinancialBreakdown = () => {
    const { financialSummary } = getFilteredData();
    return [
      { name: 'Revenue', value: financialSummary.totalRevenue, color: BRAND_COLORS.success },
      { name: 'Food Costs', value: Math.floor(financialSummary.totalRevenue * (financialSummary.foodCostPercentage / 100)), color: BRAND_COLORS.warning },
      { name: 'Labor Costs', value: Math.floor(financialSummary.totalRevenue * (financialSummary.laborCostPercentage / 100)), color: BRAND_COLORS.primary },
      { name: 'Other Expenses', value: Math.floor(financialSummary.totalRevenue * 0.095), color: BRAND_COLORS.danger }
    ];
  };

  const generateRecentActivity = () => {
    const filteredRests = getFilteredRestaurants();
    const locationsText = filteredRests.length === 1 ? filteredRests[0].name : 
                         filteredRests.length === restaurants.length ? 'All locations' : 
                         `${filteredRests.length} locations`;
    
    return [
      { 
        type: 'order', 
        message: `Peak ${selectedTimeframe === 'daily' ? 'lunch' : selectedTimeframe} rush - ${locationsText} ${formatCurrency(
          filteredRests.reduce((sum, r) => sum + getRevenueForTimeframe(r) * 0.2, 0)
        )} in last period`, 
        time: '1h ago', 
        icon: '🍽️',
        color: 'text-green-600' 
      },
      { 
        type: 'sync', 
        message: 'POS data synced successfully', 
        time: '2h ago', 
        icon: '🔄',
        color: 'text-blue-600' 
      },
      {
        type: 'payment',
        message: `${getTimeframeLabel()} deposit processed - ${formatCurrency(
          filteredRests.reduce((sum, r) => sum + getRevenueForTimeframe(r) * 0.9, 0)
        )}`,
        time: '4h ago',
        icon: '💰',
        color: 'text-green-600'
      },
      { 
        type: 'inventory', 
        message: 'Low stock alert - Salmon fillet', 
        time: '6h ago', 
        icon: '📦',
        color: 'text-orange-600' 
      },
      { 
        type: 'staff', 
        message: 'Shift change - Evening crew clocked in', 
        time: '8h ago', 
        icon: '👥',
        color: 'text-purple-600' 
      }
    ];
  };

  const revenueData = generateRevenueData();
  const locationBreakdown = generateLocationBreakdown();
  const financialBreakdown = generateFinancialBreakdown();
  const recentActivity = generateRecentActivity();
  
  const { restaurants: filteredRestaurants, salesSummary: filteredSalesSummary, financialSummary: filteredFinancialSummary, payrollSummary: filteredPayrollSummary } = getFilteredData();
  
  const filteredMainKPIs = [
    { 
      name: 'Total Revenue', 
      value: filteredFinancialSummary.totalRevenue, 
      change: selectedTimeframe === 'quarterly' ? 8.4 : selectedTimeframe === 'monthly' ? 12.4 : selectedTimeframe === 'weekly' ? 5.2 : 2.1, 
      trend: 'up', 
      format: 'currency' 
    },
    { 
      name: 'Net Profit', 
      value: filteredFinancialSummary.netIncome, 
      change: selectedTimeframe === 'quarterly' ? 10.7 : selectedTimeframe === 'monthly' ? 18.7 : selectedTimeframe === 'weekly' ? 7.3 : 3.5, 
      trend: 'up', 
      format: 'currency' 
    },
    { 
      name: 'Food Cost %', 
      value: filteredFinancialSummary.foodCostPercentage, 
      change: selectedTimeframe === 'quarterly' ? -1.1 : selectedTimeframe === 'monthly' ? -2.1 : selectedTimeframe === 'weekly' ? -0.8 : -0.3, 
      trend: 'down', 
      format: 'percentage' 
    },
    { 
      name: 'Labor Cost %', 
      value: filteredFinancialSummary.laborCostPercentage, 
      change: selectedTimeframe === 'quarterly' ? 0.8 : selectedTimeframe === 'monthly' ? 1.8 : selectedTimeframe === 'weekly' ? 0.7 : 0.3, 
      trend: 'up', 
      format: 'percentage' 
    },
    { 
      name: 'Avg Order Value', 
      value: filteredSalesSummary.avgOrderValue, 
      change: selectedTimeframe === 'quarterly' ? 4.3 : selectedTimeframe === 'monthly' ? 8.3 : selectedTimeframe === 'weekly' ? 3.2 : 1.5, 
      trend: 'up', 
      format: 'currency' 
    },
    { 
      name: 'Customer Count', 
      value: filteredSalesSummary.customerCount, 
      change: selectedTimeframe === 'quarterly' ? 7.2 : selectedTimeframe === 'monthly' ? 15.2 : selectedTimeframe === 'weekly' ? 6.1 : 2.8, 
      trend: 'up', 
      format: 'number' 
    }
  ];

  const formatLastSync = (syncTime: string): string => {
    const now = new Date();
    const sync = new Date(syncTime);
    const diffInMinutes = Math.floor((now.getTime() - sync.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const integrationStatus = {
    pos: true,
    accounting: true,
    payroll: true,
    inventory: false,
    lastSync: '2025-07-05T14:30:00Z'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header with IAM CFO Branding */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <IAMCFOLogo className="w-12 h-12 mr-4" />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">IAM CFO</h1>
                <span className="text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: BRAND_COLORS.primary }}>
                  Restaurant Analytics
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">POS + Accounting + Payroll Integration • Beyond The P&L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: BRAND_COLORS.primary }}>Real-Time Restaurant Intelligence</h2>
                  <p className="text-sm text-gray-600">Multi-location operations from kitchen to cash flow</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Integration Status */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full ${integrationStatus.pos ? 'bg-green-500' : 'bg-red-500'}`} title="POS System"></div>
                  <div className={`w-2 h-2 rounded-full ${integrationStatus.accounting ? 'bg-green-500' : 'bg-red-500'}`} title="Accounting"></div>
                  <div className={`w-2 h-2 rounded-full ${integrationStatus.payroll ? 'bg-green-500' : 'bg-red-500'}`} title="Payroll"></div>
                  <div className={`w-2 h-2 rounded-full ${integrationStatus.inventory ? 'bg-green-500' : 'bg-red-500'}`} title="Inventory"></div>
                </div>
                <span className="text-xs text-gray-500">Last sync: {formatLastSync(integrationStatus.lastSync)}</span>
              </div>
              
              {/* Sync Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSyncDropdownOpen(!syncDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync
                  <ChevronDown className={`w-4 h-4 transition-transform ${syncDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {syncDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-48">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          showNotification('Syncing all systems...', 'info');
                          setSyncDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        Sync All Systems
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Syncing POS data...', 'info');
                          setSyncDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        Sync POS Only
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Syncing financial data...', 'info');
                          setSyncDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        Sync Financial Data
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly' | 'quarterly')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
              >
                <option value="daily">Daily View</option>
                <option value="weekly">Weekly View</option>
                <option value="monthly">Monthly View</option>
                <option value="quarterly">Quarterly View</option>
              </select>

              {/* Location Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center justify-between w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
                >
                  <span className="truncate">{getSelectedLocationsText()}</span>
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {locationDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div
                      className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100"
                      onClick={() => handleLocationToggle('all')}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.has('all')}
                        onChange={() => {}}
                        className="mr-3 h-4 w-4 border-gray-300 rounded"
                        style={{ accentColor: BRAND_COLORS.primary }}
                      />
                      <span className="font-medium text-gray-900">All Locations</span>
                    </div>
                    
                    {restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => handleLocationToggle(restaurant.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocations.has(restaurant.id)}
                          onChange={() => {}}
                          className="mr-3 h-4 w-4 border-gray-300 rounded"
                          style={{ accentColor: BRAND_COLORS.primary }}
                        />
                        <div className="flex items-center flex-1">
                          <span className="mr-2">{getRestaurantIcon(restaurant.type)}</span>
                          <div>
                            <div className="text-gray-900">{restaurant.name}</div>
                            <div className="text-xs text-gray-500">{restaurant.location}</div>
                          </div>
                        </div>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(restaurant.status)}`}>
                          {restaurant.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => showNotification('Restaurant operations report exported successfully', 'success')}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors shadow-sm"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Main KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMainKPIs.map((kpi, index) => {
              const icons = [DollarSign, TrendingUp, UtensilsCrossed, Users, ShoppingCart, Clock];
              const borderColors = [BRAND_COLORS.primary, BRAND_COLORS.success, BRAND_COLORS.warning, BRAND_COLORS.accent, BRAND_COLORS.secondary, BRAND_COLORS.tertiary];
              const Icon = icons[index % icons.length];
              const borderColor = borderColors[index % borderColors.length];
              
              return (
                <div key={kpi.name} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow`} style={{ borderLeftColor: borderColor }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-gray-600 text-sm font-medium mb-2">{kpi.name}</div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatValue(kpi.value, kpi.format)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${
                        kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 
                        kpi.trend === 'down' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : 
                         kpi.trend === 'down' ? <ArrowDown className="w-3 h-3 mr-1" /> : 
                         <span className="w-3 h-3 mr-1">−</span>}
                        {Math.abs(kpi.change)}% vs last {selectedTimeframe}
                      </div>
                    </div>
                    <Icon className={`w-8 h-8`} style={{ color: borderColor }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue & Orders Trend */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{getTimeframeLabel()} Revenue & Order Performance</h3>
                <p className="text-sm text-gray-600 mt-1">Multi-location sales trends and customer volume analysis</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="revenue" orientation="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="orders" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : 
                        name === 'orders' ? `${value} orders` :
                        `${Number(value)} customers`,
                        name === 'revenue' ? 'Revenue' : 
                        name === 'orders' ? 'Orders' : 'Customers'
                      ]}
                    />
                    <Legend />
                    <Area 
                      yAxisId="revenue"
                      type="monotone" 
                      dataKey="revenue" 
                      fill={BRAND_COLORS.primary}
                      fillOpacity={0.6}
                      stroke={BRAND_COLORS.primary}
                      name="revenue"
                    />
                    <Bar 
                      yAxisId="orders"
                      dataKey="orders" 
                      fill={BRAND_COLORS.success}
                      name="orders"
                    />
                    <Line 
                      yAxisId="orders"
                      type="monotone" 
                      dataKey="customers" 
                      stroke={BRAND_COLORS.warning} 
                      strokeWidth={3}
                      dot={{ r: 4, fill: BRAND_COLORS.warning }}
                      name="customers"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Location Performance */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Location Performance Metrics</h3>
                <p className="text-sm text-gray-600 mt-1">Individual restaurant ROI and operational comparison</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) :
                        name === 'avgTicket' ? formatCurrency(Number(value)) :
                        name === 'laborCost' ? formatCurrency(Number(value)) :
                        `${Number(value)} customers`,
                        name === 'revenue' ? 'Revenue' :
                        name === 'avgTicket' ? 'Avg Ticket' :
                        name === 'laborCost' ? 'Labor Cost' : 'Customers'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill={BRAND_COLORS.primary} name="revenue" />
                    <Bar dataKey="customers" fill={BRAND_COLORS.success} name="customers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{getTimeframeLabel()} Cost Structure Overview</h3>
                <p className="text-sm text-gray-600 mt-1">Real-time P&L from integrated systems</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                    <Pie
                      data={financialBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {financialBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Operations Activity Feed</h3>
                <p className="text-sm text-gray-600 mt-1">Real-time updates from all restaurant systems</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-lg">{activity.icon}</div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${activity.color}`}>{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sales Summary */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" style={{ color: BRAND_COLORS.primary }} />
                  {getTimeframeLabel()} Sales Intelligence
                </h3>
                <p className="text-xs text-gray-600 mt-1">Multi-location sales analytics</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-semibold">{formatCurrency(filteredSalesSummary.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-semibold">{formatNumber(filteredSalesSummary.totalOrders)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Order Value:</span>
                  <span className="font-semibold">{formatCurrency(filteredSalesSummary.avgOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Count:</span>
                  <span className="font-semibold">{formatNumber(filteredSalesSummary.customerCount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat Customers:</span>
                  <span className="font-semibold">{formatNumber(filteredSalesSummary.repeatCustomers)}</span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" style={{ color: BRAND_COLORS.success }} />
                  {getTimeframeLabel()} Financial Performance
                </h3>
                <p className="text-xs text-gray-600 mt-1">Real-time accounting integration</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(filteredFinancialSummary.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expenses:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(filteredFinancialSummary.totalExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Income:</span>
                  <span className="font-semibold">{formatCurrency(filteredFinancialSummary.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food Cost %:</span>
                  <span className="font-semibold">{formatPercentage(filteredFinancialSummary.foodCostPercentage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Labor Cost %:</span>
                  <span className="font-semibold">{formatPercentage(filteredFinancialSummary.laborCostPercentage)}</span>
                </div>
              </div>
            </div>

            {/* Payroll Summary */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" style={{ color: BRAND_COLORS.warning }} />
                  {getTimeframeLabel()} Staff Management
                </h3>
                <p className="text-xs text-gray-600 mt-1">Team and labor analytics</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payroll:</span>
                  <span className="font-semibold">{formatCurrency(filteredPayrollSummary.totalPayroll)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Employees:</span>
                  <span className="font-semibold">{filteredPayrollSummary.activeEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours Worked:</span>
                  <span className="font-semibold">{formatNumber(filteredPayrollSummary.hoursWorked)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Hourly Wage:</span>
                  <span className="font-semibold">{formatCurrency(filteredPayrollSummary.avgHourlyWage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payroll Taxes:</span>
                  <span className="font-semibold">{formatCurrency(filteredPayrollSummary.payrollTaxes)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Portfolio Overview */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Restaurant Portfolio Performance</h3>
              <p className="text-sm text-gray-600 mt-1">Multi-location operations and performance analytics</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{restaurant.type.replace('-', ' ')}</p>
                        <p className="text-xs text-gray-500">{restaurant.location}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg">{getRestaurantIcon(restaurant.type)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(restaurant.status)}`}>
                          {restaurant.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{getTimeframeLabel()} Revenue:</span>
                        <span className="font-medium">{formatCurrency(getRevenueForTimeframe(restaurant))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{getTimeframeLabel()} Customers:</span>
                        <span className="font-medium">{formatNumber(getCustomerCountForTimeframe(restaurant))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Ticket:</span>
                        <span className="font-medium">{formatCurrency(restaurant.avgTicket)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium flex items-center">
                          {restaurant.rating} 
                          <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-lg text-white font-medium shadow-lg transition-transform ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        } ${notification.show ? 'translate-x-0' : 'translate-x-full'}`}>
          {notification.message}
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(syncDropdownOpen || locationDropdownOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setSyncDropdownOpen(false);
            setLocationDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}