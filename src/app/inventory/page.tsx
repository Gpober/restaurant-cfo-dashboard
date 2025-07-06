"use client";

import React, { useState } from 'react';
import { 
  ArrowUp, ArrowDown, Download, RefreshCw, TrendingUp, DollarSign, 
  Package, AlertTriangle, CheckCircle, ChevronDown, ChevronRight,
  Search, Filter, BarChart3, PieChart, Truck, ShoppingCart,
  Clock, Users, MapPin, Star, Zap, Activity, Minus, Plus,
  FileText, Calculator, Receipt, Building2, Key, Wrench
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area,
  ComposedChart, ScatterChart, Scatter
} from 'recharts';

// Restaurant CFO Brand Colors (Consistent with your existing theme)
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
interface InventoryItem {
  id: string;
  name: string;
  category: 'produce' | 'meat' | 'dairy' | 'dry-goods' | 'beverages' | 'supplies';
  currentStock: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  reorderPoint: number;
  maxStock: number;
  supplier: string;
  lastUpdated: string;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
  daysOnHand: number;
  turnoverRate: number;
  costPerServing?: number;
  averageUsagePerDay: number;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// Restaurant CFO Logo Component
const IAMCFOLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center relative`}>
    <img 
      src="/favicon.png" 
      alt="IAM CFO Logo" 
      className="w-full h-full object-contain rounded"
      style={{ minWidth: '48px', minHeight: '48px' }}
    />
  </div>
);

export default function InventoryDashboard() {
  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  const [syncDropdownOpen, setSyncDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set(['all']));
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive Location-Based QUANTIC POS Inventory Data
  const allInventoryData: InventoryItem[] = [
    // DOWNTOWN MAIN - Fine Dining
    {
      id: 'beef-ribeye-downtown',
      name: 'Ribeye Steak',
      category: 'meat',
      currentStock: 45,
      unit: 'lbs',
      unitCost: 24.50,
      totalValue: 1102.50,
      reorderPoint: 20,
      maxStock: 100,
      supplier: 'Premium Meats Co',
      lastUpdated: '2025-07-05T10:30:00Z',
      location: 'Downtown Main',
      status: 'in-stock',
      daysOnHand: 3.2,
      turnoverRate: 12.5,
      costPerServing: 12.25,
      averageUsagePerDay: 14
    },
    {
      id: 'truffle-oil-downtown',
      name: 'White Truffle Oil',
      category: 'dry-goods',
      currentStock: 8,
      unit: 'bottles',
      unitCost: 85.00,
      totalValue: 680.00,
      reorderPoint: 3,
      maxStock: 15,
      supplier: 'Gourmet Imports',
      lastUpdated: '2025-07-05T09:30:00Z',
      location: 'Downtown Main',
      status: 'in-stock',
      daysOnHand: 12.0,
      turnoverRate: 2.5,
      costPerServing: 4.25,
      averageUsagePerDay: 0.7
    },
    {
      id: 'tomatoes-roma-downtown',
      name: 'Roma Tomatoes',
      category: 'produce',
      currentStock: 5,
      unit: 'cases',
      unitCost: 22.80,
      totalValue: 114.00,
      reorderPoint: 8,
      maxStock: 25,
      supplier: 'Local Farm Co-op',
      lastUpdated: '2025-07-05T07:20:00Z',
      location: 'Downtown Main',
      status: 'low-stock',
      daysOnHand: 1.2,
      turnoverRate: 15.3,
      costPerServing: 0.57,
      averageUsagePerDay: 4
    },
    {
      id: 'champagne-dom-downtown',
      name: 'Dom Pérignon Champagne',
      category: 'beverages',
      currentStock: 12,
      unit: 'bottles',
      unitCost: 195.00,
      totalValue: 2340.00,
      reorderPoint: 6,
      maxStock: 24,
      supplier: 'Fine Wine Imports',
      lastUpdated: '2025-07-05T11:45:00Z',
      location: 'Downtown Main',
      status: 'in-stock',
      daysOnHand: 30.0,
      turnoverRate: 1.2,
      costPerServing: 195.00,
      averageUsagePerDay: 0.4
    },

    // BEACH LOCATION - Fast Casual
    {
      id: 'salmon-fillet-beach',
      name: 'Atlantic Salmon',
      category: 'meat',
      currentStock: 8,
      unit: 'lbs',
      unitCost: 18.75,
      totalValue: 150.00,
      reorderPoint: 15,
      maxStock: 50,
      supplier: 'Fresh Fish Supply',
      lastUpdated: '2025-07-05T09:15:00Z',
      location: 'Beach Location',
      status: 'low-stock',
      daysOnHand: 0.8,
      turnoverRate: 18.2,
      costPerServing: 9.38,
      averageUsagePerDay: 10
    },
    {
      id: 'craft-beer-ipa-beach',
      name: 'Local IPA Beer',
      category: 'beverages',
      currentStock: 120,
      unit: 'bottles',
      unitCost: 3.25,
      totalValue: 390.00,
      reorderPoint: 50,
      maxStock: 200,
      supplier: 'Craft Brewery Supply',
      lastUpdated: '2025-07-05T12:00:00Z',
      location: 'Beach Location',
      status: 'in-stock',
      daysOnHand: 8.0,
      turnoverRate: 9.6,
      costPerServing: 3.25,
      averageUsagePerDay: 15
    },
    {
      id: 'fish-tacos-tortillas-beach',
      name: 'Corn Tortillas',
      category: 'dry-goods',
      currentStock: 48,
      unit: 'packs',
      unitCost: 4.50,
      totalValue: 216.00,
      reorderPoint: 20,
      maxStock: 80,
      supplier: 'Local Tortilleria',
      lastUpdated: '2025-07-05T08:30:00Z',
      location: 'Beach Location',
      status: 'in-stock',
      daysOnHand: 2.4,
      turnoverRate: 12.5,
      costPerServing: 0.15,
      averageUsagePerDay: 20
    },
    {
      id: 'avocados-beach',
      name: 'Hass Avocados',
      category: 'produce',
      currentStock: 36,
      unit: 'cases',
      unitCost: 45.00,
      totalValue: 1620.00,
      reorderPoint: 15,
      maxStock: 60,
      supplier: 'California Fresh',
      lastUpdated: '2025-07-05T10:15:00Z',
      location: 'Beach Location',
      status: 'in-stock',
      daysOnHand: 3.0,
      turnoverRate: 10.0,
      costPerServing: 1.25,
      averageUsagePerDay: 12
    },

    // AIRPORT EXPRESS - Quick Service
    {
      id: 'olive-oil-extra-airport',
      name: 'Extra Virgin Olive Oil',
      category: 'dry-goods',
      currentStock: 0,
      unit: 'gallons',
      unitCost: 35.00,
      totalValue: 0.00,
      reorderPoint: 5,
      maxStock: 20,
      supplier: 'Mediterranean Imports',
      lastUpdated: '2025-07-05T06:00:00Z',
      location: 'Airport Express',
      status: 'out-of-stock',
      daysOnHand: 0,
      turnoverRate: 4.2,
      costPerServing: 0.35,
      averageUsagePerDay: 2
    },
    {
      id: 'chicken-breast-airport',
      name: 'Chicken Breast',
      category: 'meat',
      currentStock: 85,
      unit: 'lbs',
      unitCost: 6.50,
      totalValue: 552.50,
      reorderPoint: 40,
      maxStock: 150,
      supplier: 'Poultry Plus',
      lastUpdated: '2025-07-05T11:20:00Z',
      location: 'Airport Express',
      status: 'in-stock',
      daysOnHand: 2.1,
      turnoverRate: 14.3,
      costPerServing: 3.25,
      averageUsagePerDay: 40
    },
    {
      id: 'burger-buns-airport',
      name: 'Burger Buns',
      category: 'dry-goods',
      currentStock: 240,
      unit: 'pieces',
      unitCost: 0.45,
      totalValue: 108.00,
      reorderPoint: 100,
      maxStock: 500,
      supplier: 'Fresh Bakery Co',
      lastUpdated: '2025-07-05T09:45:00Z',
      location: 'Airport Express',
      status: 'in-stock',
      daysOnHand: 1.6,
      turnoverRate: 18.8,
      costPerServing: 0.45,
      averageUsagePerDay: 150
    },
    {
      id: 'soft-drinks-airport',
      name: 'Assorted Soft Drinks',
      category: 'beverages',
      currentStock: 350,
      unit: 'cans',
      unitCost: 0.85,
      totalValue: 297.50,
      reorderPoint: 200,
      maxStock: 600,
      supplier: 'Beverage Distributors',
      lastUpdated: '2025-07-05T13:10:00Z',
      location: 'Airport Express',
      status: 'in-stock',
      daysOnHand: 2.3,
      turnoverRate: 13.0,
      costPerServing: 0.85,
      averageUsagePerDay: 150
    },

    // MIDTOWN CAFÉ - Café
    {
      id: 'mozzarella-cheese-midtown',
      name: 'Fresh Mozzarella',
      category: 'dairy',
      currentStock: 18,
      unit: 'lbs',
      unitCost: 8.95,
      totalValue: 161.10,
      reorderPoint: 12,
      maxStock: 30,
      supplier: 'Artisan Dairy',
      lastUpdated: '2025-07-05T11:00:00Z',
      location: 'Midtown Café',
      status: 'in-stock',
      daysOnHand: 4.5,
      turnoverRate: 6.8,
      costPerServing: 1.49,
      averageUsagePerDay: 4
    },
    {
      id: 'coffee-beans-midtown',
      name: 'Premium Coffee Beans',
      category: 'beverages',
      currentStock: 25,
      unit: 'lbs',
      unitCost: 12.50,
      totalValue: 312.50,
      reorderPoint: 10,
      maxStock: 50,
      supplier: 'Roasters United',
      lastUpdated: '2025-07-05T08:00:00Z',
      location: 'Midtown Café',
      status: 'in-stock',
      daysOnHand: 5.0,
      turnoverRate: 6.0,
      costPerServing: 0.31,
      averageUsagePerDay: 5
    },
    {
      id: 'pastries-croissant-midtown',
      name: 'Butter Croissants',
      category: 'dry-goods',
      currentStock: 48,
      unit: 'pieces',
      unitCost: 1.25,
      totalValue: 60.00,
      reorderPoint: 24,
      maxStock: 80,
      supplier: 'French Bakery',
      lastUpdated: '2025-07-05T07:30:00Z',
      location: 'Midtown Café',
      status: 'in-stock',
      daysOnHand: 2.0,
      turnoverRate: 15.0,
      costPerServing: 1.25,
      averageUsagePerDay: 24
    },
    {
      id: 'oat-milk-midtown',
      name: 'Oat Milk',
      category: 'dairy',
      currentStock: 3,
      unit: 'cartons',
      unitCost: 4.50,
      totalValue: 13.50,
      reorderPoint: 12,
      maxStock: 30,
      supplier: 'Plant-Based Dairy Co',
      lastUpdated: '2025-07-05T12:15:00Z',
      location: 'Midtown Café',
      status: 'low-stock',
      daysOnHand: 0.5,
      turnoverRate: 20.0,
      costPerServing: 0.18,
      averageUsagePerDay: 6
    },

    // ALL LOCATIONS - Shared Items
    {
      id: 'organic-lettuce-all',
      name: 'Organic Mixed Greens',
      category: 'produce',
      currentStock: 25,
      unit: 'cases',
      unitCost: 15.20,
      totalValue: 380.00,
      reorderPoint: 10,
      maxStock: 40,
      supplier: 'Farm Fresh Produce',
      lastUpdated: '2025-07-05T08:45:00Z',
      location: 'All Locations',
      status: 'in-stock',
      daysOnHand: 2.5,
      turnoverRate: 8.7,
      costPerServing: 0.95,
      averageUsagePerDay: 10
    },
    {
      id: 'paper-towels-all',
      name: 'Industrial Paper Towels',
      category: 'supplies',
      currentStock: 85,
      unit: 'rolls',
      unitCost: 2.40,
      totalValue: 204.00,
      reorderPoint: 30,
      maxStock: 100,
      supplier: 'Restaurant Supply Co',
      lastUpdated: '2025-07-05T13:30:00Z',
      location: 'All Locations',
      status: 'overstocked',
      daysOnHand: 17.0,
      turnoverRate: 2.1,
      averageUsagePerDay: 5
    },
    {
      id: 'sanitizer-all',
      name: 'Hand Sanitizer',
      category: 'supplies',
      currentStock: 24,
      unit: 'bottles',
      unitCost: 3.75,
      totalValue: 90.00,
      reorderPoint: 15,
      maxStock: 50,
      supplier: 'Health Supplies Inc',
      lastUpdated: '2025-07-05T10:00:00Z',
      location: 'All Locations',
      status: 'in-stock',
      daysOnHand: 8.0,
      turnoverRate: 3.8,
      averageUsagePerDay: 3
    }
  ];

  // Location data (consistent with your dashboard)
  const locations = [
    { id: 'all', name: 'All Locations', emoji: '🏢' },
    { id: 'downtown-main', name: 'Downtown Main', emoji: '🍽️' },
    { id: 'beach-location', name: 'Beach Location', emoji: '🏖️' },
    { id: 'airport-express', name: 'Airport Express', emoji: '✈️' },
    { id: 'midtown-cafe', name: 'Midtown Café', emoji: '☕' }
  ];

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
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
        locations.slice(1).forEach(l => newSelected.add(l.id));
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
      
      if (newSelected.size === locations.length - 1 && !newSelected.has('all')) {
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
      const location = locations.find(l => l.id === locationId);
      return location?.name || '1 Location';
    }
    return `${selectedLocations.size} Locations Selected`;
  };

  const getFilteredInventory = () => {
    return allInventoryData.filter(item => {
      // Location filtering logic
      let matchesLocation = false;
      
      if (selectedLocations.has('all')) {
        matchesLocation = true;
      } else {
        // Check if item location matches any selected location
        if (item.location === 'All Locations') {
          matchesLocation = true; // Show "All Locations" items everywhere
        } else {
          // Convert location names to match the filter IDs
          const locationMap: Record<string, string> = {
            'Downtown Main': 'downtown-main',
            'Beach Location': 'beach-location', 
            'Airport Express': 'airport-express',
            'Midtown Café': 'midtown-cafe'
          };
          
          const itemLocationId = locationMap[item.location];
          if (itemLocationId && selectedLocations.has(itemLocationId)) {
            matchesLocation = true;
          }
        }
      }

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
                           item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesLocation && matchesCategory && matchesStatus && matchesSearch;
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'overstocked':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'low-stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'out-of-stock':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'overstocked':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'produce':
        return '🥬';
      case 'meat':
        return '🥩';
      case 'dairy':
        return '🧀';
      case 'dry-goods':
        return '🌾';
      case 'beverages':
        return '🍺';
      case 'supplies':
        return '📦';
      default:
        return '📦';
    }
  };

  // Calculate inventory metrics
  const calculateInventoryMetrics = () => {
    const filteredItems = getFilteredInventory();
    
    const totalValue = filteredItems.reduce((sum, item) => sum + item.totalValue, 0);
    const totalItems = filteredItems.length;
    const lowStockItems = filteredItems.filter(item => item.status === 'low-stock').length;
    const outOfStockItems = filteredItems.filter(item => item.status === 'out-of-stock').length;
    const averageTurnover = filteredItems.length > 0 ? 
      filteredItems.reduce((sum, item) => sum + item.turnoverRate, 0) / filteredItems.length : 0;
    const totalDaysOnHand = filteredItems.length > 0 ?
      filteredItems.reduce((sum, item) => sum + item.daysOnHand, 0) / filteredItems.length : 0;

    return {
      totalValue,
      totalItems,
      lowStockItems,
      outOfStockItems,
      averageTurnover,
      totalDaysOnHand,
      criticalItems: lowStockItems + outOfStockItems
    };
  };

  // Generate chart data
  const generateInventoryValueByCategory = () => {
    const categoryData: Record<string, { value: number; count: number }> = {};
    
    getFilteredInventory().forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = { value: 0, count: 0 };
      }
      categoryData[item.category].value += item.totalValue;
      categoryData[item.category].count += 1;
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
      value: data.value,
      count: data.count,
      emoji: getCategoryIcon(category)
    }));
  };

  const generateTurnoverAnalysis = () => {
    return getFilteredInventory()
      .filter(item => item.currentStock > 0)
      .map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        turnover: item.turnoverRate,
        daysOnHand: item.daysOnHand,
        value: item.totalValue,
        status: item.status
      }))
      .sort((a, b) => b.turnover - a.turnover)
      .slice(0, 10);
  };

  const generateStockLevelTrend = () => {
    // Simulated trend data for the chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      totalValue: 85000 + (index * 2500) + (Math.random() * 5000),
      itemCount: 45 + (index * 2) + Math.floor(Math.random() * 8),
      turnover: 8.5 + (index * 0.3) + (Math.random() * 1.5)
    }));
  };

  const metrics = calculateInventoryMetrics();
  const categoryData = generateInventoryValueByCategory();
  const turnoverData = generateTurnoverAnalysis();
  const trendData = generateStockLevelTrend();

  const COLORS = [BRAND_COLORS.primary, BRAND_COLORS.success, BRAND_COLORS.warning, BRAND_COLORS.danger, BRAND_COLORS.secondary, BRAND_COLORS.tertiary];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header with I AM CFO Branding */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <IAMCFOLogo className="w-12 h-12 mr-4" />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">I AM CFO</h1>
                <span className="text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: BRAND_COLORS.primary }}>
                  Inventory Management
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">QUANTIC POS Integration • Real-time Stock Levels • Cost Analysis</p>
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
              <div>
                <h2 className="text-2xl font-bold" style={{ color: BRAND_COLORS.primary }}>Live Inventory Intelligence</h2>
                <p className="text-sm text-gray-600">Real-time stock levels, cost analysis, and reorder management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': BRAND_COLORS.primary + '33' } as React.CSSProperties}
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
              >
                <option value="all">All Categories</option>
                <option value="produce">🥬 Produce</option>
                <option value="meat">🥩 Meat & Seafood</option>
                <option value="dairy">🧀 Dairy</option>
                <option value="dry-goods">🌾 Dry Goods</option>
                <option value="beverages">🍺 Beverages</option>
                <option value="supplies">📦 Supplies</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
              >
                <option value="all">All Status</option>
                <option value="in-stock">✅ In Stock</option>
                <option value="low-stock">⚠️ Low Stock</option>
                <option value="out-of-stock">❌ Out of Stock</option>
                <option value="overstocked">📈 Overstocked</option>
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
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => handleLocationToggle(location.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocations.has(location.id)}
                          onChange={() => {}}
                          className="mr-3 h-4 w-4 border-gray-300 rounded"
                          style={{ accentColor: BRAND_COLORS.primary }}
                        />
                        <span className="mr-2">{location.emoji}</span>
                        <span className={location.id === 'all' ? 'font-medium text-gray-900' : 'text-gray-700'}>
                          {location.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sync Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSyncDropdownOpen(!syncDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync QUANTIC
                  <ChevronDown className={`w-4 h-4 transition-transform ${syncDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {syncDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-48">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          showNotification('Syncing inventory from QUANTIC POS...', 'info');
                          setSyncDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        Sync All Inventory
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Syncing stock levels...', 'info');
                          setSyncDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        Sync Stock Levels Only
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Syncing cost data...', 'info');
                          setSyncDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        Sync Cost Data
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => showNotification('Inventory report exported successfully', 'success')}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors shadow-sm"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.primary }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm font-medium mb-2">Total Inventory Value</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatCurrency(metrics.totalValue)}
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full inline-flex items-center bg-green-100 text-green-800">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +5.2% vs last month
                  </div>
                </div>
                <DollarSign className="w-8 h-8" style={{ color: BRAND_COLORS.primary }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.success }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm font-medium mb-2">Inventory Turnover</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {metrics.averageTurnover.toFixed(1)}x
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full inline-flex items-center bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Healthy rate
                  </div>
                </div>
                <BarChart3 className="w-8 h-8" style={{ color: BRAND_COLORS.success }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.warning }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm font-medium mb-2">Days on Hand</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {metrics.totalDaysOnHand.toFixed(1)}
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full inline-flex items-center bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Average days
                  </div>
                </div>
                <Clock className="w-8 h-8" style={{ color: BRAND_COLORS.warning }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: metrics.criticalItems > 0 ? BRAND_COLORS.danger : BRAND_COLORS.success }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm font-medium mb-2">Critical Items</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {metrics.criticalItems}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${
                    metrics.criticalItems > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {metrics.criticalItems > 0 ? 'Needs attention' : 'All good'}
                  </div>
                </div>
                <AlertTriangle className="w-8 h-8" style={{ color: metrics.criticalItems > 0 ? BRAND_COLORS.danger : BRAND_COLORS.success }} />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inventory Value by Category */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Inventory Value by Category</h3>
                <p className="text-sm text-gray-600 mt-1">Distribution of inventory investment across categories</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip 
                      formatter={(value: any) => [`${formatCurrency(Number(value))}`, 'Value']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Turnover Analysis */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Top Items by Turnover Rate</h3>
                <p className="text-sm text-gray-600 mt-1">Items with highest inventory turnover rates</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={turnoverData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      formatter={(value: any, name) => [
                        name === 'turnover' ? `${Number(value).toFixed(1)}x/month` : 
                        name === 'daysOnHand' ? `${Number(value).toFixed(1)} days` :
                        formatCurrency(Number(value)),
                        name === 'turnover' ? 'Turnover Rate' : 
                        name === 'daysOnHand' ? 'Days on Hand' : 'Value'
                      ]}
                    />
                    <Bar dataKey="turnover" fill={BRAND_COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inventory Trend */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Inventory Value Trend</h3>
                <p className="text-sm text-gray-600 mt-1">6-month inventory value and turnover trends</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="value" orientation="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="turnover" orientation="right" />
                    <Tooltip 
                      formatter={(value: any, name) => [
                        name === 'totalValue' ? formatCurrency(Number(value)) :
                        name === 'itemCount' ? `${Number(value)} items` :
                        `${Number(value).toFixed(1)}x`,
                        name === 'totalValue' ? 'Total Value' :
                        name === 'itemCount' ? 'Item Count' : 'Avg Turnover'
                      ]}
                    />
                    <Legend />
                    <Area 
                      yAxisId="value"
                      type="monotone" 
                      dataKey="totalValue" 
                      fill={BRAND_COLORS.primary}
                      fillOpacity={0.6}
                      stroke={BRAND_COLORS.primary}
                      name="totalValue"
                    />
                    <Bar 
                      yAxisId="value"
                      dataKey="itemCount" 
                      fill={BRAND_COLORS.success}
                      name="itemCount"
                    />
                    <Line 
                      yAxisId="turnover"
                      type="monotone" 
                      dataKey="turnover" 
                      stroke={BRAND_COLORS.warning} 
                      strokeWidth={3}
                      dot={{ r: 4, fill: BRAND_COLORS.warning }}
                      name="turnover"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Inventory Items Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Inventory Items</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {getFilteredInventory().length} of {allInventoryData.length} items • {getSelectedLocationsText()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Last synced: 2 minutes ago</span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Days on Hand</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredInventory().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getCategoryIcon(item.category)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 capitalize">
                          {item.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatNumber(item.currentStock)} {item.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Reorder at {item.reorderPoint} {item.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.unitCost)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalValue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {item.daysOnHand.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.turnoverRate.toFixed(1)}x turnover
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusIcon(item.status)}
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.supplier}</div>
                        <div className="text-xs text-gray-500">
                          Updated {new Date(item.lastUpdated).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
