"use client";

import React, { useState } from 'react';
import { 
  Calendar, Download, RefreshCw, Plus, X, ChevronDown, ChevronRight, 
  ArrowUp, ArrowDown, TrendingUp, DollarSign, PieChart, BarChart3, 
  Users, UserPlus, UserCheck, UserX, Settings, Bell, Search, Filter,
  Building2, Key, Wrench, CreditCard, AlertTriangle, CheckCircle,
  FileText, Calculator, Receipt, Clock, Edit3, Trash2, Eye,
  MapPin, Phone, Mail, Briefcase, Award, Target, File, FileCheck,
  Send, Archive, Printer, Share2, ExternalLink, ChefHat, Utensils,
  TrendingDown, Activity, BookOpen, ShoppingCart, Menu
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area,
  ComposedChart
} from 'recharts';

// IAM CFO Brand Colors
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
interface RestaurantOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  restaurants: string[];
  totalRestaurants: number;
  monthlyRevenue: number;
  yearToDateRevenue: number;
  status: 'active' | 'inactive';
  lastStatementSent: string;
  partnershipType: 'full-owner' | 'investor' | 'franchise-partner';
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  owner: string;
  ownerId: string;
  cuisine: string;
  seatingCapacity: number;
  monthlyRevenue: number;
  foodCostPercentage: number;
  laborCostPercentage: number;
  avgTicketSize: number;
  monthlyCustomers: number;
  netIncome: number;
}

interface RestaurantStatement {
  id: string;
  ownerId: string;
  ownerName: string;
  statementNumber: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  generatedDate: string;
  status: 'draft' | 'sent' | 'viewed' | 'downloaded';
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  restaurants: string[];
  lastSent?: string;
  downloadCount: number;
  performanceMetrics: {
    avgTicketSize: number;
    totalCustomers: number;
    foodCostPercent: number;
    laborCostPercent: number;
    profitMargin: number;
  };
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
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

export default function RestaurantStatementsPage() {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'statements' | 'owners' | 'templates'>('overview');
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  const [selectedPeriod, setSelectedPeriod] = useState('June 2025');
  const [selectedOwner, setSelectedOwner] = useState('All Owners');
  const [selectedRestaurant, setSelectedRestaurant] = useState('All Restaurants');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-06-30');
  const [useTimeframe, setUseTimeframe] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sample restaurant data
  const restaurantOwners: RestaurantOwner[] = [
    {
      id: '1',
      name: 'Marco Romano',
      email: 'marco.romano@bellaitalia.com',
      phone: '(555) 123-4567',
      restaurants: ['Bella Italia Downtown', 'Romano\'s Pizzeria'],
      totalRestaurants: 2,
      monthlyRevenue: 185000,
      yearToDateRevenue: 1110000,
      status: 'active',
      lastStatementSent: '2025-06-05',
      partnershipType: 'full-owner'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah.chen@investor.com',
      phone: '(555) 234-5678',
      restaurants: ['Dragon Palace Asian Fusion'],
      totalRestaurants: 1,
      monthlyRevenue: 225000,
      yearToDateRevenue: 1350000,
      status: 'active',
      lastStatementSent: '2025-06-05',
      partnershipType: 'investor'
    },
    {
      id: '3',
      name: 'Miguel Rodriguez',
      email: 'miguel.rodriguez@gmail.com',
      phone: '(555) 345-6789',
      restaurants: ['El Corazón Mexican Grill', 'Taco Libre'],
      totalRestaurants: 2,
      monthlyRevenue: 165000,
      yearToDateRevenue: 990000,
      status: 'active',
      lastStatementSent: '2025-06-05',
      partnershipType: 'franchise-partner'
    },
    {
      id: '4',
      name: 'Emily Thompson',
      email: 'emily.thompson@brewandgrill.com',
      phone: '(555) 456-7890',
      restaurants: ['Thompson\'s Brew & Grill'],
      totalRestaurants: 1,
      monthlyRevenue: 145000,
      yearToDateRevenue: 870000,
      status: 'active',
      lastStatementSent: '2025-06-05',
      partnershipType: 'full-owner'
    }
  ];

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Bella Italia Downtown',
      address: '123 Main Street, Downtown Miami, FL 33130',
      owner: 'Marco Romano',
      ownerId: '1',
      cuisine: 'Italian Fine Dining',
      seatingCapacity: 120,
      monthlyRevenue: 125000,
      foodCostPercentage: 28,
      laborCostPercentage: 32,
      avgTicketSize: 65,
      monthlyCustomers: 1923,
      netIncome: 37500
    },
    {
      id: '2',
      name: 'Romano\'s Pizzeria',
      address: '456 Ocean Drive, South Beach, FL 33139',
      owner: 'Marco Romano',
      ownerId: '1',
      cuisine: 'Casual Italian',
      seatingCapacity: 85,
      monthlyRevenue: 60000,
      foodCostPercentage: 25,
      laborCostPercentage: 35,
      avgTicketSize: 28,
      monthlyCustomers: 2143,
      netIncome: 18000
    },
    {
      id: '3',
      name: 'Dragon Palace Asian Fusion',
      address: '789 Biscayne Blvd, Miami, FL 33132',
      owner: 'Sarah Chen',
      ownerId: '2',
      cuisine: 'Asian Fusion',
      seatingCapacity: 180,
      monthlyRevenue: 225000,
      foodCostPercentage: 30,
      laborCostPercentage: 28,
      avgTicketSize: 78,
      monthlyCustomers: 2885,
      netIncome: 67500
    },
    {
      id: '4',
      name: 'El Corazón Mexican Grill',
      address: '321 Coral Way, Miami, FL 33145',
      owner: 'Miguel Rodriguez',
      ownerId: '3',
      cuisine: 'Mexican',
      seatingCapacity: 95,
      monthlyRevenue: 95000,
      foodCostPercentage: 26,
      laborCostPercentage: 34,
      avgTicketSize: 42,
      monthlyCustomers: 2262,
      netIncome: 28500
    },
    {
      id: '5',
      name: 'Taco Libre',
      address: '654 Lincoln Road, Miami Beach, FL 33139',
      owner: 'Miguel Rodriguez',
      ownerId: '3',
      cuisine: 'Fast Casual Mexican',
      seatingCapacity: 65,
      monthlyRevenue: 70000,
      foodCostPercentage: 24,
      laborCostPercentage: 30,
      avgTicketSize: 18,
      monthlyCustomers: 3889,
      netIncome: 21000
    },
    {
      id: '6',
      name: 'Thompson\'s Brew & Grill',
      address: '987 Collins Ave, Miami Beach, FL 33154',
      owner: 'Emily Thompson',
      ownerId: '4',
      cuisine: 'American Gastropub',
      seatingCapacity: 140,
      monthlyRevenue: 145000,
      foodCostPercentage: 29,
      laborCostPercentage: 31,
      avgTicketSize: 52,
      monthlyCustomers: 2788,
      netIncome: 43500
    }
  ];

  const restaurantStatements: RestaurantStatement[] = [
    {
      id: '1',
      ownerId: '1',
      ownerName: 'Marco Romano',
      statementNumber: 'RST-2025-06-001',
      period: 'June 2025',
      periodStart: '2025-06-01',
      periodEnd: '2025-06-30',
      generatedDate: '2025-07-01',
      status: 'sent',
      totalRevenue: 185000,
      totalExpenses: 129500,
      netIncome: 55500,
      restaurants: ['Bella Italia Downtown', 'Romano\'s Pizzeria'],
      lastSent: '2025-07-01',
      downloadCount: 3,
      performanceMetrics: {
        avgTicketSize: 46.50,
        totalCustomers: 4066,
        foodCostPercent: 26.5,
        laborCostPercent: 33.5,
        profitMargin: 30.0
      }
    },
    {
      id: '2',
      ownerId: '2',
      ownerName: 'Sarah Chen',
      statementNumber: 'RST-2025-06-002',
      period: 'June 2025',
      periodStart: '2025-06-01',
      periodEnd: '2025-06-30',
      generatedDate: '2025-07-01',
      status: 'viewed',
      totalRevenue: 225000,
      totalExpenses: 157500,
      netIncome: 67500,
      restaurants: ['Dragon Palace Asian Fusion'],
      lastSent: '2025-07-01',
      downloadCount: 1,
      performanceMetrics: {
        avgTicketSize: 78.00,
        totalCustomers: 2885,
        foodCostPercent: 30.0,
        laborCostPercent: 28.0,
        profitMargin: 30.0
      }
    },
    {
      id: '3',
      ownerId: '3',
      ownerName: 'Miguel Rodriguez',
      statementNumber: 'RST-2025-06-003',
      period: 'June 2025',
      periodStart: '2025-06-01',
      periodEnd: '2025-06-30',
      generatedDate: '2025-07-01',
      status: 'downloaded',
      totalRevenue: 165000,
      totalExpenses: 115500,
      netIncome: 49500,
      restaurants: ['El Corazón Mexican Grill', 'Taco Libre'],
      lastSent: '2025-07-01',
      downloadCount: 2,
      performanceMetrics: {
        avgTicketSize: 30.00,
        totalCustomers: 6151,
        foodCostPercent: 25.0,
        laborCostPercent: 32.0,
        profitMargin: 30.0
      }
    },
    {
      id: '4',
      ownerId: '4',
      ownerName: 'Emily Thompson',
      statementNumber: 'RST-2025-06-004',
      period: 'June 2025',
      periodStart: '2025-06-01',
      periodEnd: '2025-06-30',
      generatedDate: '2025-07-01',
      status: 'draft',
      totalRevenue: 145000,
      totalExpenses: 101500,
      netIncome: 43500,
      restaurants: ['Thompson\'s Brew & Grill'],
      downloadCount: 0,
      performanceMetrics: {
        avgTicketSize: 52.00,
        totalCustomers: 2788,
        foodCostPercent: 29.0,
        laborCostPercent: 31.0,
        profitMargin: 30.0
      }
    }
  ];

  const periods = ['June 2025', 'May 2025', 'April 2025', 'March 2025', 'February 2025', 'January 2025'];
  const statuses = ['All Status', 'Draft', 'Sent', 'Viewed', 'Downloaded'];
  const restaurantNames = ['All Restaurants', ...Array.from(new Set(restaurants.map(r => r.name)))];

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
      case 'sent':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'viewed':
        return 'bg-blue-100 text-blue-800';
      case 'downloaded':
        return 'bg-purple-100 text-purple-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredStatements = () => {
    return restaurantStatements.filter(statement => {
      const matchesPeriod = selectedPeriod === 'All Periods' || statement.period === selectedPeriod;
      const matchesOwner = selectedOwner === 'All Owners' || statement.ownerName === selectedOwner;
      const matchesRestaurant = selectedRestaurant === 'All Restaurants' || 
        statement.restaurants.includes(selectedRestaurant);
      const matchesStatus = selectedStatus === 'All Status' || 
        statement.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        statement.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        statement.statementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        statement.restaurants.some(rest => rest.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesPeriod && matchesOwner && matchesRestaurant && matchesStatus && matchesSearch;
    });
  };

  const calculateSummaryStats = () => {
    const filteredStatements = getFilteredStatements();
    const totalRevenue = filteredStatements.reduce((sum, s) => sum + s.totalRevenue, 0);
    const totalExpenses = filteredStatements.reduce((sum, s) => sum + s.totalExpenses, 0);
    const totalNetIncome = filteredStatements.reduce((sum, s) => sum + s.netIncome, 0);
    const totalCustomers = filteredStatements.reduce((sum, s) => sum + s.performanceMetrics.totalCustomers, 0);
    const avgTicketSize = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const totalStatements = filteredStatements.length;
    const sentStatements = filteredStatements.filter(s => s.status === 'sent').length;
    const draftStatements = filteredStatements.filter(s => s.status === 'draft').length;

    return {
      totalRevenue,
      totalExpenses,
      totalNetIncome,
      totalCustomers,
      avgTicketSize,
      totalStatements,
      sentStatements,
      draftStatements,
      completionRate: totalStatements > 0 ? (sentStatements / totalStatements) * 100 : 0
    };
  };

  const generateRestaurantTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const baseRevenue = 680000;
      const variation = index * 15000 + Math.sin(index) * 8000;
      const revenue = baseRevenue + variation;
      const foodCosts = revenue * 0.27;
      const laborCosts = revenue * 0.31;
      const otherExpenses = revenue * 0.12;
      const netIncome = revenue - foodCosts - laborCosts - otherExpenses;
      
      return {
        month,
        revenue: Math.round(revenue),
        foodCosts: Math.round(foodCosts),
        laborCosts: Math.round(laborCosts),
        otherExpenses: Math.round(otherExpenses),
        netIncome: Math.round(netIncome),
        customers: Math.round(12000 + (index * 800) + Math.random() * 1000)
      };
    });
  };

  const generateOwnerRevenueData = () => {
    return restaurantOwners.map(owner => ({
      name: owner.name.split(' ')[0],
      revenue: owner.monthlyRevenue,
      restaurants: owner.totalRestaurants,
      netIncome: Math.round(owner.monthlyRevenue * 0.3),
      customers: restaurants
        .filter(r => r.ownerId === owner.id)
        .reduce((sum, r) => sum + r.monthlyCustomers, 0)
    }));
  };

  const summaryStats = calculateSummaryStats();
  const trendData = generateRestaurantTrendData();
  const ownerRevenueData = generateOwnerRevenueData();
  const filteredStatements = getFilteredStatements();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 sm:top-4 sm:right-4 sm:left-auto sm:transform-none z-50 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-white font-medium shadow-lg transition-all max-w-xs sm:max-w-none text-sm sm:text-base ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, message: '', type: 'info' })}
              className="ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
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
                    <span className="hidden sm:inline">Restaurant Owner Statements</span>
                    <span className="sm:hidden">Statements</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">Restaurant financial reporting • Performance analytics • Owner distribution statements</p>
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
                onClick={() => showNotification('Generating restaurant statements...', 'info')}
                className="flex items-center gap-2 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">Generate</span>
              </button>
              <button
                onClick={() => showNotification('Exporting all statements...', 'success')}
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
                    <h3 className="text-lg font-semibold">Menu</h3>
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
                          { key: 'statements', label: 'Statements', icon: '📄' },
                          { key: 'owners', label: 'Owners', icon: '👥' },
                          { key: 'templates', label: 'Templates', icon: '📋' }
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

                    {/* Filters */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        {periods.map((period) => (
                          <option key={period} value={period}>{period}</option>
                        ))}
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4">
                      <button
                        onClick={() => {
                          showNotification('Generating statements...', 'info');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg"
                        style={{ backgroundColor: BRAND_COLORS.primary }}
                      >
                        <Plus className="w-4 h-4" />
                        Generate Statements
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Exporting all statements...', 'success');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4" />
                        Export All
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
              <span className="hidden sm:inline">Restaurant Owner Statements</span>
              <span className="sm:hidden">Statements</span>
            </h2>
            <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
              {/* Tab Selector */}
              <div className="flex gap-1 sm:gap-2">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'statements', label: 'Statements' },
                  { key: 'owners', label: 'Owners' },
                  { key: 'templates', label: 'Templates' }
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

              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="sm:hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: BRAND_COLORS.primary }}>Statements Dashboard</h2>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {[
                { key: 'overview', label: 'Overview', icon: '📊' },
                { key: 'statements', label: 'Statements', icon: '📄' },
                { key: 'owners', label: 'Owners', icon: '👥' },
                { key: 'templates', label: 'Templates', icon: '📋' }
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
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total Revenue</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(summaryStats.totalRevenue)}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+12.3% vs last month</span>
                        <span className="sm:hidden">+12.3%</span>
                      </div>
                    </div>
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.primary }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.success }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Net Income</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(summaryStats.totalNetIncome)}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+15.7% vs last month</span>
                        <span className="sm:hidden">+15.7%</span>
                      </div>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.success }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.warning }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total Customers</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatNumber(summaryStats.totalCustomers)}</div>
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+8.9% vs last month</span>
                        <span className="sm:hidden">+8.9%</span>
                      </div>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.warning }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.secondary }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Avg Ticket</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(summaryStats.avgTicketSize)}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">+3.1% vs last month</span>
                        <span className="sm:hidden">+3.1%</span>
                      </div>
                    </div>
                    <Receipt className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.secondary }} />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.danger }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Statements</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">{summaryStats.totalStatements}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                        <span className="hidden sm:inline">{summaryStats.completionRate.toFixed(0)}% completion</span>
                        <span className="sm:hidden">{summaryStats.completionRate.toFixed(0)}%</span>
                      </div>
                    </div>
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 ml-2" style={{ color: BRAND_COLORS.danger }} />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Restaurant Revenue Trend */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">6-Month Performance</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Revenue, costs, and customer trends</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <ComposedChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value, name) => {
                          if (name === 'customers') return [Number(value).toLocaleString(), 'Customers'];
                          return [formatCurrency(Number(value)), name];
                        }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill={BRAND_COLORS.primary} name="Revenue" />
                        <Bar yAxisId="left" dataKey="foodCosts" fill={BRAND_COLORS.danger} name="Food Costs" />
                        <Bar yAxisId="left" dataKey="laborCosts" fill={BRAND_COLORS.warning} name="Labor Costs" />
                        <Line yAxisId="right" type="monotone" dataKey="customers" stroke={BRAND_COLORS.success} strokeWidth={3} name="Customers" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Owner Revenue Distribution */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Owner Revenue</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly revenue by owner</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={ownerRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                        <Legend />
                        <Bar dataKey="revenue" fill={BRAND_COLORS.primary} name="Revenue" />
                        <Bar dataKey="netIncome" fill={BRAND_COLORS.success} name="Net Income" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {restaurantStatements.slice(0, 4).map((statement) => (
                        <div key={statement.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center min-w-0 flex-1">
                            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" style={{ color: BRAND_COLORS.primary }} />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{statement.ownerName}</div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                {statement.statementNumber} • {statement.restaurants.length} restaurants
                              </div>
                              <div className="text-xs text-gray-500 hidden sm:block">
                                Avg ticket: {formatCurrency(statement.performanceMetrics.avgTicketSize)} • 
                                {formatNumber(statement.performanceMetrics.totalCustomers)} customers
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="font-medium text-gray-900 text-sm sm:text-base">{formatCurrency(statement.netIncome)}</div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(statement.status)}`}>
                              {statement.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      <button
                        onClick={() => showNotification('Sending all pending statements...', 'info')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Send className="w-4 h-4" />
                        Send All Pending
                      </button>
                      <button
                        onClick={() => showNotification('Downloading as ZIP...', 'info')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Archive className="w-4 h-4" />
                        Download All as ZIP
                      </button>
                      <button
                        onClick={() => showNotification('Opening template editor...', 'info')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Customize Templates
                      </button>
                      <button
                        onClick={() => showNotification('Setting up auto-send...', 'info')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                        style={{ backgroundColor: BRAND_COLORS.primary }}
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule Auto-Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
