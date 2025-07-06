"use client";

import React, { useState } from 'react';
import { 
  Calendar, Download, RefreshCw, Plus, X, ChevronDown, ChevronRight, 
  ArrowUp, ArrowDown, TrendingUp, DollarSign, PieChart, BarChart3, 
  Home, Users, MapPin, Star, Settings, Bell, Search, Filter,
  Building2, Key, Wrench, CreditCard, AlertTriangle, CheckCircle,
  FileText, Calculator, Receipt, Zap, Link, Activity, UtensilsCrossed,
  Clock, ShoppingCart, ChefHat, Truck, Menu
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

// Logo Component
const IAMCFOLogo = ({ className = "w-8 h-8 sm:w-12 sm:h-12" }) => (
  <div className={`${className} flex items-center justify-center relative`}>
    <img 
      src="/favicon.png" 
      alt="IAM CFO Logo" 
      className="w-full h-full object-contain rounded"
      style={{ minWidth: '32px', minHeight: '32px' }}
    />
  </div>
);

export default function RestaurantDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [syncDropdownOpen, setSyncDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState(new Set(['all']));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample restaurant data
  const restaurants = [
    {
      id: 'downtown-main',
      name: 'Downtown Main',
      location: 'Miami Downtown, FL',
      type: 'fine-dining',
      status: 'open',
      monthlyRevenue: 325000,
      monthlyCustomers: 5550,
      avgTicket: 67.50,
      monthlyLaborCost: 127500,
      monthlyFoodCost: 112500,
      rating: 4.7
    },
    {
      id: 'beach-location',
      name: 'Beach Location',
      location: 'Miami Beach, FL',
      type: 'fast-casual',
      status: 'open',
      monthlyRevenue: 232000,
      monthlyCustomers: 7350,
      avgTicket: 36.30,
      monthlyLaborCost: 85500,
      monthlyFoodCost: 80100,
      rating: 4.5
    },
    {
      id: 'airport-express',
      name: 'Airport Express',
      location: 'Miami Airport, FL',
      type: 'quick-service',
      status: 'open',
      monthlyRevenue: 395000,
      monthlyCustomers: 17400,
      avgTicket: 26.20,
      monthlyLaborCost: 91200,
      monthlyFoodCost: 136800,
      rating: 4.2
    },
    {
      id: 'cafe-midtown',
      name: 'Midtown Café',
      location: 'Midtown Miami, FL',
      type: 'cafe',
      status: 'maintenance',
      monthlyRevenue: 83000,
      monthlyCustomers: 2850,
      avgTicket: 33.70,
      monthlyLaborCost: 38400,
      monthlyFoodCost: 28800,
      rating: 4.6
    }
  ];

  // Utility functions
  const formatCurrency = (amount) => {
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

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toLocaleString();
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  const getFilteredRestaurants = () => {
    if (selectedLocations.has('all') || selectedLocations.size === 0) {
      return restaurants;
    }
    return restaurants.filter(restaurant => selectedLocations.has(restaurant.id));
  };

  const getRestaurantIcon = (type) => {
    switch (type) {
      case 'fine-dining': return '🍽️';
      case 'fast-casual': return '🍔';
      case 'quick-service': return '🚀';
      case 'cafe': return '☕';
      default: return '🏪';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    return `${selectedLocations.size} Locations`;
  };

  const handleLocationToggle = (locationId) => {
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

  // Calculate totals
  const filteredRestaurants = getFilteredRestaurants();
  const totalRevenue = filteredRestaurants.reduce((sum, r) => sum + r.monthlyRevenue, 0);
  const totalCustomers = filteredRestaurants.reduce((sum, r) => sum + r.monthlyCustomers, 0);
  const totalLaborCost = filteredRestaurants.reduce((sum, r) => sum + r.monthlyLaborCost, 0);
  const totalFoodCost = filteredRestaurants.reduce((sum, r) => sum + r.monthlyFoodCost, 0);
  const avgOrderValue = filteredRestaurants.length > 0 ? 
    filteredRestaurants.reduce((sum, r) => sum + r.avgTicket, 0) / filteredRestaurants.length : 0;

  const totalExpenses = totalLaborCost + totalFoodCost + (totalRevenue * 0.095);
  const netIncome = totalRevenue - totalExpenses;
  const foodCostPercentage = (totalFoodCost / totalRevenue) * 100;
  const laborCostPercentage = (totalLaborCost / totalRevenue) * 100;

  // Main KPIs
  const mainKPIs = [
    { 
      name: 'Total Revenue', 
      value: totalRevenue, 
      change: 12.4, 
      trend: 'up', 
      format: 'currency' 
    },
    { 
      name: 'Net Profit', 
      value: netIncome, 
      change: 18.7, 
      trend: 'up', 
      format: 'currency' 
    },
    { 
      name: 'Food Cost %', 
      value: foodCostPercentage, 
      change: -2.1, 
      trend: 'down', 
      format: 'percentage' 
    },
    { 
      name: 'Labor Cost %', 
      value: laborCostPercentage, 
      change: 1.8, 
      trend: 'up', 
      format: 'percentage' 
    },
    { 
      name: 'Avg Order Value', 
      value: avgOrderValue, 
      change: 8.3, 
      trend: 'up', 
      format: 'currency' 
    },
    { 
      name: 'Customer Count', 
      value: totalCustomers, 
      change: 15.2, 
      trend: 'up', 
      format: 'number' 
    }
  ];

  const formatValue = (value, format) => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return formatNumber(value);
      default:
        return value.toString();
    }
  };

  // Chart data
  const revenueData = [
    { period: 'Week 1', revenue: Math.floor(totalRevenue * 0.2), orders: Math.floor(totalCustomers * 0.22), customers: Math.floor(totalCustomers * 0.18) },
    { period: 'Week 2', revenue: Math.floor(totalRevenue * 0.25), orders: Math.floor(totalCustomers * 0.26), customers: Math.floor(totalCustomers * 0.23) },
    { period: 'Week 3', revenue: Math.floor(totalRevenue * 0.28), orders: Math.floor(totalCustomers * 0.29), customers: Math.floor(totalCustomers * 0.27) },
    { period: 'Week 4', revenue: Math.floor(totalRevenue * 0.27), orders: Math.floor(totalCustomers * 0.23), customers: Math.floor(totalCustomers * 0.32) }
  ];

  const locationBreakdown = filteredRestaurants.map(restaurant => ({
    name: restaurant.name.split(' ')[0],
    revenue: restaurant.monthlyRevenue,
    customers: restaurant.monthlyCustomers
  }));

  const financialBreakdown = [
    { name: 'Revenue', value: totalRevenue, color: BRAND_COLORS.success },
    { name: 'Food Costs', value: totalFoodCost, color: BRAND_COLORS.warning },
    { name: 'Labor Costs', value: totalLaborCost, color: BRAND_COLORS.primary },
    { name: 'Other Expenses', value: Math.floor(totalRevenue * 0.095), color: BRAND_COLORS.danger }
  ];

  const recentActivity = [
    { 
      type: 'order', 
      message: `Peak lunch rush - All locations ${formatCurrency(totalRevenue * 0.2)} in last period`, 
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
      message: `Monthly deposit processed - ${formatCurrency(totalRevenue * 0.9)}`,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IAMCFOLogo className="w-8 h-8 sm:w-12 sm:h-12 mr-2 sm:mr-4" />
              <div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">I AM CFO</h1>
                  <span className="text-xs sm:text-sm px-2 py-1 rounded-full text-white" style={{ backgroundColor: BRAND_COLORS.primary }}>
                    Restaurant
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">POS + Accounting + Payroll Integration</p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg border border-gray-300 bg-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>

              {/* Location Filter */}
              <div className="relative">
                <button
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center justify-between w-32 lg:w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
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
                onClick={() => showNotification('Report exported successfully', 'success')}
                className="flex items-center gap-2 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors shadow-sm"
                style={{ backgroundColor: BRAND_COLORS.primary }}
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
                    <h3 className="text-lg font-semibold">Controls</h3>
                    <button onClick={() => setMobileMenuOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Timeframe Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                      <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="daily">Daily View</option>
                        <option value="weekly">Weekly View</option>
                        <option value="monthly">Monthly View</option>
                        <option value="quarterly">Quarterly View</option>
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                      <div className="space-y-2">
                        <div
                          className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
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
                            className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
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
                                <div className="text-gray-900 text-sm">{restaurant.name}</div>
                                <div className="text-xs text-gray-500">{restaurant.location}</div>
                              </div>
                            </div>
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(restaurant.status)}`}>
                              {restaurant.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4">
                      <button
                        onClick={() => {
                          showNotification('Syncing all systems...', 'info');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Sync All Data
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Report exported successfully', 'success');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg"
                        style={{ backgroundColor: BRAND_COLORS.primary }}
                      >
                        <Download className="w-4 h-4" />
                        Export Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Page Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: BRAND_COLORS.primary }}>
              <span className="sm:hidden">Real-Time Intelligence</span>
              <span className="hidden sm:inline">Real-Time Restaurant Intelligence</span>
            </h2>
            <p className="text-sm text-gray-600">Multi-location operations from kitchen to cash flow</p>
          </div>

          {/* Main KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {mainKPIs.map((kpi, index) => {
              const icons = [DollarSign, TrendingUp, UtensilsCrossed, Users, ShoppingCart, Clock];
              const borderColors = [BRAND_COLORS.primary, BRAND_COLORS.success, BRAND_COLORS.warning, BRAND_COLORS.accent, BRAND_COLORS.secondary, BRAND_COLORS.tertiary];
              const Icon = icons[index % icons.length];
              const borderColor = borderColors[index % borderColors.length];
              
              return (
                <div key={kpi.name} className={`bg-white p-3 sm:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow`} style={{ borderLeftColor: borderColor }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate">{kpi.name}</div>
                      <div className="text-lg sm:text-3xl font-bold text-gray-900 mb-1">
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
                        <span className="hidden sm:inline">{Math.abs(kpi.change)}% vs last month</span>
                        <span className="sm:hidden">{Math.abs(kpi.change)}%</span>
                      </div>
                    </div>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ml-2`} style={{ color: borderColor }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Monthly Revenue & Orders</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Sales trends and customer volume</p>
              </div>
              <div className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="revenue" orientation="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 12 }} />
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
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Location Performance</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Individual restaurant comparison</p>
              </div>
              <div className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={locationBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) :
                        `${Number(value)} customers`,
                        name === 'revenue' ? 'Revenue' : 'Customers'
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
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Cost Structure</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">P&L breakdown</p>
              </div>
              <div className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                    <Pie
                      data={financialBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelStyle={{ fontSize: 12 }}
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
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Activity Feed</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Real-time updates</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-base sm:text-lg">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium ${activity.color} truncate`}>{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Portfolio */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Restaurant Portfolio</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Multi-location performance analytics</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{restaurant.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 capitalize">{restaurant.type.replace('-', ' ')}</p>
                        <p className="text-xs text-gray-500 truncate">{restaurant.location}</p>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-lg">{getRestaurantIcon(restaurant.type)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(restaurant.status)}`}>
                          {restaurant.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Revenue:</span>
                        <span className="font-medium">{formatCurrency(restaurant.monthlyRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customers:</span>
                        <span className="font-medium">{formatNumber(restaurant.monthlyCustomers)}</span>
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
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 sm:top-5 sm:right-5 sm:left-auto sm:transform-none z-50 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-white font-medium shadow-lg transition-all max-w-xs sm:max-w-none text-sm sm:text-base ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        } ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          {notification.message}
        </div>
      )}

      {/* Dropdown backdrop */}
      {locationDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setLocationDropdownOpen(false)}
        />
      )}
    </div>
  );
}
