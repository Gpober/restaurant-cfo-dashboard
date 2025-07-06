"use client";

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus, Download, RefreshCw, TrendingUp, DollarSign, PieChart, BarChart3, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

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
type FinancialTab = 'p&l' | 'cash-flow' | 'balance-sheet';
type TimeView = 'Monthly' | 'YTD' | 'TTM' | 'MoM' | 'YoY';
type ViewMode = 'total' | 'detailed';
type MonthString = `${'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December'} ${number}`;

interface FinancialDataItem {
  name: string;
  total: number;
  months: Partial<Record<MonthString, number>>;
  subAccounts?: FinancialDataItem[];
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'info' | 'success' | 'error';
}

// Restaurant CFO Logo Component
const IAMCFOLogo = ({ className = "w-8 h-8 sm:w-12 sm:h-12" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center relative`}>
    <div 
      className="w-full h-full bg-gradient-to-br rounded-lg flex items-center justify-center text-white font-bold text-lg"
      style={{ 
        background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
        minWidth: '32px', 
        minHeight: '32px' 
      }}
    >
      CFO
    </div>
  </div>
);

// Sample financial data with sub-accounts and detailed breakdowns
const samplePLData: FinancialDataItem[] = [
  { 
    name: 'Food Sales', 
    total: 520000, 
    months: { 'June 2025': 180000, 'May 2025': 165000 },
    subAccounts: [
      { 
        name: 'Appetizers', 
        total: 78000, 
        months: { 'June 2025': 27000, 'May 2025': 24750 },
        subAccounts: [
          { name: 'Wings', total: 23400, months: { 'June 2025': 8100, 'May 2025': 7425 } },
          { name: 'Nachos', total: 15600, months: { 'June 2025': 5400, 'May 2025': 4950 } },
          { name: 'Calamari', total: 19500, months: { 'June 2025': 6750, 'May 2025': 6188 } },
          { name: 'Bruschetta', total: 11700, months: { 'June 2025': 4050, 'May 2025': 3713 } },
          { name: 'Other Appetizers', total: 7800, months: { 'June 2025': 2700, 'May 2025': 2475 } }
        ]
      },
      { 
        name: 'Entrees', 
        total: 312000, 
        months: { 'June 2025': 108000, 'May 2025': 99000 },
        subAccounts: [
          { name: 'Steaks', total: 93600, months: { 'June 2025': 32400, 'May 2025': 29700 } },
          { name: 'Seafood', total: 78000, months: { 'June 2025': 27000, 'May 2025': 24750 } },
          { name: 'Pasta', total: 62400, months: { 'June 2025': 21600, 'May 2025': 19800 } },
          { name: 'Chicken', total: 46800, months: { 'June 2025': 16200, 'May 2025': 14850 } },
          { name: 'Vegetarian', total: 31200, months: { 'June 2025': 10800, 'May 2025': 9900 } }
        ]
      },
      { 
        name: 'Desserts', 
        total: 65000, 
        months: { 'June 2025': 22500, 'May 2025': 20625 },
        subAccounts: [
          { name: 'Cheesecake', total: 19500, months: { 'June 2025': 6750, 'May 2025': 6188 } },
          { name: 'Chocolate Cake', total: 16250, months: { 'June 2025': 5625, 'May 2025': 5156 } },
          { name: 'Ice Cream', total: 13000, months: { 'June 2025': 4500, 'May 2025': 4125 } },
          { name: 'Tiramisu', total: 9750, months: { 'June 2025': 3375, 'May 2025': 3094 } },
          { name: 'Seasonal Desserts', total: 6500, months: { 'June 2025': 2250, 'May 2025': 2063 } }
        ]
      },
      { 
        name: 'Daily Specials', 
        total: 65000, 
        months: { 'June 2025': 22500, 'May 2025': 20625 },
        subAccounts: [
          { name: 'Monday Special', total: 13000, months: { 'June 2025': 4500, 'May 2025': 4125 } },
          { name: 'Tuesday Special', total: 13000, months: { 'June 2025': 4500, 'May 2025': 4125 } },
          { name: 'Wednesday Special', total: 13000, months: { 'June 2025': 4500, 'May 2025': 4125 } },
          { name: 'Thursday Special', total: 13000, months: { 'June 2025': 4500, 'May 2025': 4125 } },
          { name: 'Weekend Specials', total: 13000, months: { 'June 2025': 4500, 'May 2025': 4125 } }
        ]
      }
    ]
  },
  { 
    name: 'Beverage Sales', 
    total: 295000, 
    months: { 'June 2025': 100000, 'May 2025': 93000 },
    subAccounts: [
      { 
        name: 'Alcoholic Beverages', 
        total: 177000, 
        months: { 'June 2025': 60000, 'May 2025': 55800 },
        subAccounts: [
          { name: 'Wine', total: 70800, months: { 'June 2025': 24000, 'May 2025': 22320 } },
          { name: 'Beer', total: 53100, months: { 'June 2025': 18000, 'May 2025': 16740 } },
          { name: 'Cocktails', total: 35400, months: { 'June 2025': 12000, 'May 2025': 11160 } },
          { name: 'Spirits', total: 17700, months: { 'June 2025': 6000, 'May 2025': 5580 } }
        ]
      },
      { 
        name: 'Soft Drinks', 
        total: 59000, 
        months: { 'June 2025': 20000, 'May 2025': 18600 },
        subAccounts: [
          { name: 'Coca-Cola Products', total: 23600, months: { 'June 2025': 8000, 'May 2025': 7440 } },
          { name: 'Pepsi Products', total: 17700, months: { 'June 2025': 6000, 'May 2025': 5580 } },
          { name: 'Specialty Sodas', total: 11800, months: { 'June 2025': 4000, 'May 2025': 3720 } },
          { name: 'Energy Drinks', total: 5900, months: { 'June 2025': 2000, 'May 2025': 1860 } }
        ]
      },
      { 
        name: 'Coffee & Tea', 
        total: 41300, 
        months: { 'June 2025': 14000, 'May 2025': 13020 },
        subAccounts: [
          { name: 'Espresso Drinks', total: 16520, months: { 'June 2025': 5600, 'May 2025': 5208 } },
          { name: 'Drip Coffee', total: 12390, months: { 'June 2025': 4200, 'May 2025': 3906 } },
          { name: 'Specialty Teas', total: 8260, months: { 'June 2025': 2800, 'May 2025': 2604 } },
          { name: 'Iced Coffee', total: 4130, months: { 'June 2025': 1400, 'May 2025': 1302 } }
        ]
      },
      { 
        name: 'Juices', 
        total: 17700, 
        months: { 'June 2025': 6000, 'May 2025': 5580 },
        subAccounts: [
          { name: 'Fresh Orange Juice', total: 7080, months: { 'June 2025': 2400, 'May 2025': 2232 } },
          { name: 'Apple Juice', total: 3540, months: { 'June 2025': 1200, 'May 2025': 1116 } },
          { name: 'Cranberry Juice', total: 3540, months: { 'June 2025': 1200, 'May 2025': 1116 } },
          { name: 'Mixed Fruit Juices', total: 3540, months: { 'June 2025': 1200, 'May 2025': 1116 } }
        ]
      }
    ]
  },
  { name: 'Total Revenue', total: 815000, months: { 'June 2025': 280000, 'May 2025': 258000 } },
  { 
    name: 'Cost of Goods Sold', 
    total: 285250, 
    months: { 'June 2025': 98000, 'May 2025': 90360 },
    subAccounts: [
      { name: 'Food Costs', total: 171150, months: { 'June 2025': 58800, 'May 2025': 54216 } },
      { name: 'Beverage Costs', total: 88575, months: { 'June 2025': 29400, 'May 2025': 27108 } },
      { name: 'Packaging & Supplies', total: 25525, months: { 'June 2025': 9800, 'May 2025': 9036 } }
    ]
  },
  { name: 'Gross Profit', total: 529750, months: { 'June 2025': 182000, 'May 2025': 167640 } },
  { 
    name: 'Labor Costs', 
    total: 245000, 
    months: { 'June 2025': 85000, 'May 2025': 80000 },
    subAccounts: [
      { name: 'Kitchen Staff', total: 122500, months: { 'June 2025': 42500, 'May 2025': 40000 } },
      { name: 'Front of House', total: 98000, months: { 'June 2025': 34000, 'May 2025': 32000 } },
      { name: 'Management', total: 24500, months: { 'June 2025': 8500, 'May 2025': 8000 } }
    ]
  },
  { 
    name: 'Operating Expenses', 
    total: 132000, 
    months: { 'June 2025': 45000, 'May 2025': 42000 },
    subAccounts: [
      { name: 'Rent & Utilities', total: 52800, months: { 'June 2025': 18000, 'May 2025': 16800 } },
      { name: 'Marketing', total: 26400, months: { 'June 2025': 9000, 'May 2025': 8400 } },
      { name: 'Insurance', total: 19800, months: { 'June 2025': 6750, 'May 2025': 6300 } },
      { name: 'Equipment & Maintenance', total: 19800, months: { 'June 2025': 6750, 'May 2025': 6300 } },
      { name: 'Professional Services', total: 13200, months: { 'June 2025': 4500, 'May 2025': 4200 } }
    ]
  },
  { name: 'Operating Income', total: 152750, months: { 'June 2025': 52000, 'May 2025': 45640 } },
  { name: 'Interest Expense', total: 15000, months: { 'June 2025': 5000, 'May 2025': 5000 } },
  { name: 'Taxes', total: 33200, months: { 'June 2025': 11760, 'May 2025': 10440 } },
  { name: 'Net Income', total: 104550, months: { 'June 2025': 35240, 'May 2025': 30200 } },
];

const sampleCashFlowData = {
  inFlow: [
    { 
      name: 'Dine-in Revenue', 
      total: 420000, 
      months: { 'June 2025': 150000 },
      subAccounts: [
        { name: 'Lunch Service', total: 168000, months: { 'June 2025': 60000 } },
        { name: 'Dinner Service', total: 210000, months: { 'June 2025': 75000 } },
        { name: 'Weekend Brunch', total: 42000, months: { 'June 2025': 15000 } }
      ]
    },
    { 
      name: 'Takeout Revenue', 
      total: 195000, 
      months: { 'June 2025': 65000 },
      subAccounts: [
        { name: 'Phone Orders', total: 97500, months: { 'June 2025': 32500 } },
        { name: 'Online Orders', total: 78000, months: { 'June 2025': 26000 } },
        { name: 'Walk-in Takeout', total: 19500, months: { 'June 2025': 6500 } }
      ]
    },
    { 
      name: 'Catering Revenue', 
      total: 105000, 
      months: { 'June 2025': 35000 },
      subAccounts: [
        { name: 'Corporate Events', total: 52500, months: { 'June 2025': 17500 } },
        { name: 'Private Parties', total: 31500, months: { 'June 2025': 10500 } },
        { name: 'Wedding Catering', total: 21000, months: { 'June 2025': 7000 } }
      ]
    },
    { 
      name: 'Gift Card Sales', 
      total: 45000, 
      months: { 'June 2025': 15000 },
      subAccounts: [
        { name: 'Holiday Gift Cards', total: 22500, months: { 'June 2025': 7500 } },
        { name: 'Birthday Gift Cards', total: 13500, months: { 'June 2025': 4500 } },
        { name: 'Corporate Gift Cards', total: 9000, months: { 'June 2025': 3000 } }
      ]
    },
  ],
  outFlow: [
    { 
      name: 'Food Purchases', 
      total: -190000, 
      months: { 'June 2025': -65000 },
      subAccounts: [
        { name: 'Meat & Seafood', total: -95000, months: { 'June 2025': -32500 } },
        { name: 'Produce', total: -38000, months: { 'June 2025': -13000 } },
        { name: 'Dairy & Eggs', total: -28500, months: { 'June 2025': -9750 } },
        { name: 'Dry Goods', total: -28500, months: { 'June 2025': -9750 } }
      ]
    },
    { 
      name: 'Beverage Purchases', 
      total: -95250, 
      months: { 'June 2025': -33000 },
      subAccounts: [
        { name: 'Alcohol', total: -47625, months: { 'June 2025': -16500 } },
        { name: 'Soft Drinks', total: -23813, months: { 'June 2025': -8250 } },
        { name: 'Coffee & Tea', total: -14288, months: { 'June 2025': -4950 } },
        { name: 'Juices', total: -9525, months: { 'June 2025': -3300 } }
      ]
    },
    { 
      name: 'Payroll', 
      total: -245000, 
      months: { 'June 2025': -85000 },
      subAccounts: [
        { name: 'Kitchen Staff Wages', total: -122500, months: { 'June 2025': -42500 } },
        { name: 'Server Wages', total: -73500, months: { 'June 2025': -25500 } },
        { name: 'Management Salaries', total: -49000, months: { 'June 2025': -17000 } }
      ]
    },
    { 
      name: 'Rent', 
      total: -73000, 
      months: { 'June 2025': -25000 },
      subAccounts: [
        { name: 'Base Rent', total: -58400, months: { 'June 2025': -20000 } },
        { name: 'Property Tax', total: -8760, months: { 'June 2025': -3000 } },
        { name: 'Common Area Maintenance', total: -5840, months: { 'June 2025': -2000 } }
      ]
    },
  ],
  totalInFlow: 765000,
  totalOutFlow: -603250,
  totalCashFlow: 161750,
  beginningCash: 220000,
  endingCash: 381750
};

const sampleBalanceSheetData: FinancialDataItem[] = [
  { name: 'Cash & Cash Equivalents', total: 285000, months: { 'June 2025': 285000 } },
  { name: 'Accounts Receivable', total: 105000, months: { 'June 2025': 105000 } },
  { name: 'Inventory', total: 125000, months: { 'June 2025': 125000 } },
  { name: 'Property & Equipment', total: 1450000, months: { 'June 2025': 1450000 } },
  { name: 'Total Assets', total: 1965000, months: { 'June 2025': 1965000 } },
  { name: 'Accounts Payable', total: 185000, months: { 'June 2025': 185000 } },
  { name: 'Long-term Debt', total: 450000, months: { 'June 2025': 450000 } },
  { name: 'Total Liabilities', total: 635000, months: { 'June 2025': 635000 } },
  { name: 'Owners Equity', total: 1330000, months: { 'June 2025': 1330000 } },
];

const COLORS = [BRAND_COLORS.primary, BRAND_COLORS.success, BRAND_COLORS.warning, BRAND_COLORS.danger, BRAND_COLORS.secondary, BRAND_COLORS.tertiary];

const monthsList: MonthString[] = ['June 2025', 'May 2025'];
const restaurants = ['All Restaurants', 'Downtown Bistro', 'Seaside Grill', 'Mountain Tavern'];
const bankAccounts = ['All Accounts', 'Chase Business', 'Wells Fargo', 'Capital One', 'PayPal Business'];

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState<FinancialTab>('p&l');
  const [selectedMonth, setSelectedMonth] = useState<MonthString>('June 2025');
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [timeView, setTimeView] = useState<TimeView>('Monthly');
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  
  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileCharts, setShowMobileCharts] = useState(false);
  
  // P&L expansion state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  // Dropdown states
  const [timeViewDropdownOpen, setTimeViewDropdownOpen] = useState(false);
  const [restaurantDropdownOpen, setRestaurantDropdownOpen] = useState(false);
  const [bankAccountDropdownOpen, setBankAccountDropdownOpen] = useState(false);
  
  // Selection states
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set(['All Restaurants']));
  const [selectedBankAccounts, setSelectedBankAccounts] = useState<Set<string>>(new Set(['All Accounts']));

  const handleRestaurantToggle = (restaurant: string) => {
    const newSelected = new Set(selectedRestaurants);
    
    if (restaurant === 'All Restaurants') {
      if (newSelected.has('All Restaurants')) {
        newSelected.clear();
      } else {
        newSelected.clear();
        newSelected.add('All Restaurants');
      }
    } else {
      newSelected.delete('All Restaurants');
      if (newSelected.has(restaurant)) {
        newSelected.delete(restaurant);
      } else {
        newSelected.add(restaurant);
      }
    }
    setSelectedRestaurants(newSelected);
  };

  const handleBankAccountToggle = (account: string) => {
    const newSelected = new Set(selectedBankAccounts);
    
    if (account === 'All Accounts') {
      if (newSelected.has('All Accounts')) {
        newSelected.clear();
      } else {
        newSelected.clear();
        newSelected.add('All Accounts');
      }
    } else {
      newSelected.delete('All Accounts');
      if (newSelected.has(account)) {
        newSelected.delete(account);
      } else {
        newSelected.add(account);
      }
    }
    setSelectedBankAccounts(newSelected);
  };

  const toggleRowExpansion = (rowName: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowName)) {
      newExpanded.delete(rowName);
    } else {
      newExpanded.add(rowName);
    }
    setExpandedRows(newExpanded);
  };

  const createTooltipContent = (item: FinancialDataItem, selectedMonth: MonthString) => {
    if (!item.subAccounts || item.subAccounts.length === 0) return null;
    
    return (
      <div className="text-xs">
        <div className="font-semibold mb-2 text-gray-900">Breakdown:</div>
        {item.subAccounts.map((sub, index) => {
          const value = sub.months[selectedMonth] || sub.total;
          return (
            <div key={sub.name} className="flex justify-between items-center py-1">
              <span className="text-gray-700">{sub.name}:</span>
              <span className="font-medium text-gray-900 ml-2">{formatCurrency(Math.abs(value))}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getSelectedRestaurantsText = () => {
    if (selectedRestaurants.has('All Restaurants') || selectedRestaurants.size === 0) {
      return 'All Restaurants';
    }
    if (selectedRestaurants.size === 1) {
      return Array.from(selectedRestaurants)[0];
    }
    return `${selectedRestaurants.size} Selected`;
  };

  const getSelectedBankAccountsText = () => {
    if (selectedBankAccounts.has('All Accounts') || selectedBankAccounts.size === 0) {
      return 'All Accounts';
    }
    if (selectedBankAccounts.size === 1) {
      return Array.from(selectedBankAccounts)[0];
    }
    return `${selectedBankAccounts.size} Selected`;
  };

  // Helper functions
  const formatCurrency = (value: number): string => {
    // Enhanced mobile-friendly currency formatting
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      if (Math.abs(value) >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (Math.abs(value) >= 100000) {
        return `$${(value / 1000).toFixed(0)}k`;
      } else if (Math.abs(value) >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
      }
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculatePercentage = (value: number, total: number): string => {
    return total !== 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
  };

  const showNotification = (message: string, type: 'info' | 'success' | 'error' = 'info'): void => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  // Calculate KPIs
  const revenue = samplePLData.find(item => item.name === 'Total Revenue')?.total || 0;
  const grossProfit = samplePLData.find(item => item.name === 'Gross Profit')?.total || 0;
  const operatingIncome = samplePLData.find(item => item.name === 'Operating Income')?.total || 0;
  const netIncome = samplePLData.find(item => item.name === 'Net Income')?.total || 0;
  
  const kpis = {
    revenue,
    grossMargin: revenue ? (grossProfit / revenue) * 100 : 0,
    operatingMargin: revenue ? (operatingIncome / revenue) * 100 : 0,
    netMargin: revenue ? (netIncome / revenue) * 100 : 0
  };

  // Generate trend data
  const trendData = [
    { month: 'Jan', revenue: 120000, grossProfit: 78000, netIncome: 18000 },
    { month: 'Feb', revenue: 135000, grossProfit: 87750, netIncome: 20250 },
    { month: 'Mar', revenue: 150000, grossProfit: 97500, netIncome: 22500 },
    { month: 'Apr', revenue: 160000, grossProfit: 104000, netIncome: 24000 },
    { month: 'May', revenue: 165000, grossProfit: 107250, netIncome: 24750 },
    { month: 'Jun', revenue: 180000, grossProfit: 117000, netIncome: 27000 },
  ];

  // Generate expense breakdown
  const expenseData = [
    { name: 'COGS', value: 285250 },
    { name: 'Labor', value: 245000 },
    { name: 'OpEx', value: 132000 },
    { name: 'Interest', value: 15000 },
    { name: 'Taxes', value: 33200 },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'p&l':
        return samplePLData;
      case 'cash-flow':
        // For cash flow, we'll handle the split display separately
        return [];
      case 'balance-sheet':
        return sampleBalanceSheetData;
      default:
        return samplePLData;
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <IAMCFOLogo className="w-10 h-10 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">CFO Dashboard</h1>
                <p className="hidden sm:block text-sm text-gray-600 mt-1">Financial Management • Real-time Analytics</p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex-shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Controls</h3>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Mobile Controls */}
              <div className="space-y-6">
                {/* Month Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value as MonthString)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': BRAND_COLORS.secondary + '33' } as React.CSSProperties}
                  >
                    {monthsList.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time View */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time View</label>
                  <select
                    value={timeView}
                    onChange={(e) => setTimeView(e.target.value as TimeView)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': BRAND_COLORS.secondary + '33' } as React.CSSProperties}
                  >
                    {(['Monthly', 'YTD', 'TTM', 'MoM', 'YoY'] as TimeView[]).map((view) => (
                      <option key={view} value={view}>
                        {view}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => { 
                      setShowMobileCharts(!showMobileCharts); 
                      setMobileMenuOpen(false); 
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: BRAND_COLORS.secondary }}
                  >
                    <BarChart3 className="w-4 h-4" />
                    {showMobileCharts ? 'Hide Charts' : 'Show Charts'}
                  </button>
                  <button
                    onClick={() => { showNotification('Data exported', 'success'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: BRAND_COLORS.primary }}
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Mobile Summary Header */}
          <div className="lg:hidden">
            <div className="text-sm text-gray-600 mb-2">
              {getSelectedRestaurantsText()} • {getSelectedBankAccountsText()} • {selectedMonth} • {timeView}
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                {activeTab === 'p&l' ? 'P&L Statement' : 
                 activeTab === 'cash-flow' ? 'Cash Flow' : 
                 'Balance Sheet'}
              </h2>
              <div className="flex gap-2">
                {/* Mobile Tab Pills */}
                <button
                  onClick={() => setActiveTab('p&l')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    activeTab === 'p&l' 
                      ? 'text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  style={{ backgroundColor: activeTab === 'p&l' ? BRAND_COLORS.primary : undefined }}
                >
                  P&L
                </button>
                <button
                  onClick={() => setActiveTab('cash-flow')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    activeTab === 'cash-flow' 
                      ? 'text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  style={{ backgroundColor: activeTab === 'cash-flow' ? BRAND_COLORS.primary : undefined }}
                >
                  Cash
                </button>
                <button
                  onClick={() => setActiveTab('balance-sheet')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    activeTab === 'balance-sheet' 
                      ? 'text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  style={{ backgroundColor: activeTab === 'balance-sheet' ? BRAND_COLORS.primary : undefined }}
                >
                  Balance
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Header Controls */}
          <div className="hidden lg:flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <h2 className="text-3xl font-bold" style={{ color: BRAND_COLORS.primary }}>Restaurant Financial Dashboard</h2>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Desktop controls remain the same but hidden on mobile */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value as MonthString)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': BRAND_COLORS.secondary + '33' } as React.CSSProperties}
              >
                {monthsList.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('total')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    viewMode === 'total'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ backgroundColor: viewMode === 'total' ? BRAND_COLORS.primary : undefined }}
                >
                  Total
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    viewMode === 'detailed'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ backgroundColor: viewMode === 'detailed' ? BRAND_COLORS.primary : undefined }}
                >
                  Detailed
                </button>
              </div>

              <button
                onClick={() => showNotification('Financial data exported', 'success')}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors shadow-sm"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* KPI Cards - Mobile Optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.primary }}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-gray-600 text-xs lg:text-sm font-medium mb-1 lg:mb-2">Revenue</div>
                  <div className="text-lg lg:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(kpis.revenue)}</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                    +8.7%
                  </div>
                </div>
                <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 flex-shrink-0" style={{ color: BRAND_COLORS.primary }} />
              </div>
            </div>
            
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.success }}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-gray-600 text-xs lg:text-sm font-medium mb-1 lg:mb-2">Gross Margin</div>
                  <div className="text-lg lg:text-3xl font-bold text-gray-900 mb-1">{kpis.grossMargin.toFixed(1)}%</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                    +1.2%
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 flex-shrink-0" style={{ color: BRAND_COLORS.success }} />
              </div>
            </div>
            
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.warning }}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-gray-600 text-xs lg:text-sm font-medium mb-1 lg:mb-2">Operating</div>
                  <div className="text-lg lg:text-3xl font-bold text-gray-900 mb-1">{kpis.operatingMargin.toFixed(1)}%</div>
                  <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block">
                    +0.5%
                  </div>
                </div>
                <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 flex-shrink-0" style={{ color: BRAND_COLORS.warning }} />
              </div>
            </div>
            
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.secondary }}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-gray-600 text-xs lg:text-sm font-medium mb-1 lg:mb-2">Net Margin</div>
                  <div className="text-lg lg:text-3xl font-bold text-gray-900 mb-1">{kpis.netMargin.toFixed(1)}%</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                    +0.8%
                  </div>
                </div>
                <PieChart className="w-6 h-6 lg:w-8 lg:h-8 flex-shrink-0" style={{ color: BRAND_COLORS.secondary }} />
              </div>
            </div>
          </div>

          {/* Mobile Charts Toggle */}
          {showMobileCharts && (
            <div className="lg:hidden space-y-6">
              {/* Revenue Trend Chart */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                </div>
                <div className="p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 10 }}
                        interval={0}
                      />
                      <YAxis 
                        tickFormatter={(value: any) => `${(value / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${formatCurrency(Number(value))}`, 'Revenue']}
                        labelStyle={{ fontSize: '12px' }}
                        contentStyle={{ fontSize: '11px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={BRAND_COLORS.primary} 
                        strokeWidth={2}
                        dot={{ r: 3, fill: BRAND_COLORS.primary }}
                        activeDot={{ r: 5, fill: BRAND_COLORS.primary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
                </div>
                <div className="p-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPieChart>
                      <Tooltip 
                        formatter={(value: any) => [`${formatCurrency(Number(value))}`, '']}
                        contentStyle={{ fontSize: '11px' }}
                      />
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({percent}) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        fontSize={9}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  {/* Mobile Legend */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {expenseData.map((item, index) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(item.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Responsive Layout */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
            {/* Financial Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                      {activeTab === 'p&l' ? 'P&L Statement' : 
                       activeTab === 'cash-flow' ? 'Cash Flow' : 
                       'Balance Sheet'}
                    </h3>
                    {/* Desktop tabs */}
                    <div className="hidden lg:flex gap-2">
                      <button
                        onClick={() => setActiveTab('p&l')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          activeTab === 'p&l' 
                            ? 'text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={{ backgroundColor: activeTab === 'p&l' ? BRAND_COLORS.primary : undefined }}
                      >
                        P&L
                      </button>
                      <button
                        onClick={() => setActiveTab('cash-flow')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          activeTab === 'cash-flow' 
                            ? 'text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={{ backgroundColor: activeTab === 'cash-flow' ? BRAND_COLORS.primary : undefined }}
                      >
                        Cash
                      </button>
                      <button
                        onClick={() => setActiveTab('balance-sheet')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          activeTab === 'balance-sheet' 
                            ? 'text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={{ backgroundColor: activeTab === 'balance-sheet' ? BRAND_COLORS.primary : undefined }}
                      >
                        Balance
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Tables - Cash Flow Split or Regular Table */}
                {activeTab === 'cash-flow' ? (
                  <div className="space-y-6">
                    {/* Bank Account Filter for Cash Flow */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-blue-800 mb-1">Bank Account Filter</h4>
                          <p className="text-xs text-blue-600">Showing cash flow for: {getSelectedBankAccountsText()}</p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setBankAccountDropdownOpen(!bankAccountDropdownOpen)}
                            className="flex items-center justify-between w-48 px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm hover:border-blue-400 focus:outline-none focus:ring-2 transition-all"
                            style={{ '--tw-ring-color': BRAND_COLORS.primary + '33' } as React.CSSProperties}
                          >
                            <span className="truncate">{getSelectedBankAccountsText()}</span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${bankAccountDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {bankAccountDropdownOpen && (
                            <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                              {bankAccounts.map((account) => (
                                <div
                                  key={account}
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                  onClick={() => handleBankAccountToggle(account)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedBankAccounts.has(account)}
                                    onChange={() => {}}
                                    className="mr-3 h-4 w-4 border-gray-300 rounded"
                                    style={{ accentColor: BRAND_COLORS.primary }}
                                  />
                                  <span className={account === 'All Accounts' ? 'font-medium text-gray-900' : 'text-gray-700'}>
                                    {account}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cash Inflows */}
                    <div>
                      <div className="px-4 lg:px-6 py-3 bg-green-50 border-b border-green-100">
                        <h4 className="text-sm font-semibold text-green-800 flex items-center">
                          <ArrowDown className="w-4 h-4 mr-2 text-green-600" />
                          Cash Inflows
                        </h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                              </th>
                              <th className="px-3 lg:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {selectedMonth.split(' ')[0]}
                              </th>
                              <th className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                % of Inflow
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sampleCashFlowData.inFlow.map((item, index) => {
                              const value = item.months[selectedMonth] || item.total;
                              const percentage = calculatePercentage(value, sampleCashFlowData.totalInFlow);
                              const hasSubAccounts = item.subAccounts && item.subAccounts.length > 0;
                              
                              return (
                                <tr 
                                  key={item.name} 
                                  className="hover:bg-gray-50 transition-colors relative"
                                  onMouseEnter={() => setHoveredRow(`inflow-${item.name}`)}
                                  onMouseLeave={() => setHoveredRow(null)}
                                >
                                  <td className="px-3 lg:px-4 py-3 text-left text-sm text-gray-700 relative">
                                    <div className="flex items-center">
                                      <span className="block truncate max-w-[120px] sm:max-w-none" title={item.name}>
                                        {item.name}
                                      </span>
                                      {hasSubAccounts && (
                                        <span className="ml-2 text-xs text-gray-400">
                                          ({item.subAccounts.length})
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Cash Flow Hover Tooltip */}
                                    {hoveredRow === `inflow-${item.name}` && hasSubAccounts && (
                                      <div className="absolute left-full top-0 ml-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[200px]">
                                        {createTooltipContent(item, selectedMonth)}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-3 lg:px-4 py-3 text-right text-sm font-medium text-green-600">
                                    {formatCurrency(value)}
                                  </td>
                                  <td className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-sm text-gray-500">
                                    {percentage}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="bg-green-50 font-semibold">
                              <td className="px-3 lg:px-4 py-3 text-left text-sm font-semibold text-green-800">
                                Total Inflows
                              </td>
                              <td className="px-3 lg:px-4 py-3 text-right text-sm font-semibold text-green-600">
                                {formatCurrency(sampleCashFlowData.totalInFlow)}
                              </td>
                              <td className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-sm text-green-600">
                                100%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Cash Outflows */}
                    <div>
                      <div className="px-4 lg:px-6 py-3 bg-red-50 border-b border-red-100">
                        <h4 className="text-sm font-semibold text-red-800 flex items-center">
                          <ArrowUp className="w-4 h-4 mr-2 text-red-600" />
                          Cash Outflows
                        </h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expense
                              </th>
                              <th className="px-3 lg:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {selectedMonth.split(' ')[0]}
                              </th>
                              <th className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                % of Outflow
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sampleCashFlowData.outFlow.map((item, index) => {
                              const value = item.months[selectedMonth] || item.total;
                              const percentage = calculatePercentage(Math.abs(value), Math.abs(sampleCashFlowData.totalOutFlow));
                              const hasSubAccounts = item.subAccounts && item.subAccounts.length > 0;
                              
                              return (
                                <tr 
                                  key={item.name} 
                                  className="hover:bg-gray-50 transition-colors relative"
                                  onMouseEnter={() => setHoveredRow(`outflow-${item.name}`)}
                                  onMouseLeave={() => setHoveredRow(null)}
                                >
                                  <td className="px-3 lg:px-4 py-3 text-left text-sm text-gray-700 relative">
                                    <div className="flex items-center">
                                      <span className="block truncate max-w-[120px] sm:max-w-none" title={item.name}>
                                        {item.name}
                                      </span>
                                      {hasSubAccounts && (
                                        <span className="ml-2 text-xs text-gray-400">
                                          ({item.subAccounts.length})
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Cash Flow Hover Tooltip */}
                                    {hoveredRow === `outflow-${item.name}` && hasSubAccounts && (
                                      <div className="absolute left-full top-0 ml-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[200px]">
                                        {createTooltipContent(item, selectedMonth)}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-3 lg:px-4 py-3 text-right text-sm font-medium text-red-600">
                                    ({formatCurrency(Math.abs(value))})
                                  </td>
                                  <td className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-sm text-gray-500">
                                    {percentage}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="bg-red-50 font-semibold">
                              <td className="px-3 lg:px-4 py-3 text-left text-sm font-semibold text-red-800">
                                Total Outflows
                              </td>
                              <td className="px-3 lg:px-4 py-3 text-right text-sm font-semibold text-red-600">
                                ({formatCurrency(Math.abs(sampleCashFlowData.totalOutFlow))})
                              </td>
                              <td className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-sm text-red-600">
                                100%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Net Cash Flow Summary */}
                    <div className="bg-blue-50 rounded-lg p-4 lg:p-6">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4">Cash Flow Summary</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(sampleCashFlowData.totalInFlow)}
                          </div>
                          <div className="text-sm text-green-700">Total Inflows</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            ({formatCurrency(Math.abs(sampleCashFlowData.totalOutFlow))})
                          </div>
                          <div className="text-sm text-red-700">Total Outflows</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${sampleCashFlowData.totalCashFlow >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {sampleCashFlowData.totalCashFlow >= 0 ? 
                              formatCurrency(sampleCashFlowData.totalCashFlow) : 
                              `(${formatCurrency(Math.abs(sampleCashFlowData.totalCashFlow))})`
                            }
                          </div>
                          <div className="text-sm text-blue-700">Net Cash Flow</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-blue-700">Beginning Cash:</span>
                          <span className="font-medium text-blue-800">{formatCurrency(sampleCashFlowData.beginningCash)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="text-blue-700">Net Cash Flow:</span>
                          <span className={`font-medium ${sampleCashFlowData.totalCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {sampleCashFlowData.totalCashFlow >= 0 ? '+' : ''}{formatCurrency(sampleCashFlowData.totalCashFlow)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-semibold mt-2 pt-2 border-t border-blue-200">
                          <span className="text-blue-800">Ending Cash:</span>
                          <span className="text-blue-800">{formatCurrency(sampleCashFlowData.endingCash)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account
                          </th>
                          <th className="px-3 lg:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {selectedMonth.split(' ')[0]}
                          </th>
                          <th className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((item, index) => {
                          const isTotalRow = item.name.includes('Total') || item.name.includes('Net');
                          const isNegative = item.total < 0;
                          const value = item.months[selectedMonth] || item.total;
                          const hasSubAccounts = item.subAccounts && item.subAccounts.length > 0;
                          const isExpanded = expandedRows.has(item.name);
                          
                          // Calculate percentage
                          let percentage = '0%';
                          if (activeTab === 'p&l') {
                            const revenueItem = samplePLData.find(i => i.name === 'Total Revenue');
                            percentage = revenueItem ? calculatePercentage(Math.abs(value), revenueItem.total) : '0%';
                          } else if (activeTab === 'balance-sheet') {
                            const totalAssetsItem = sampleBalanceSheetData.find(i => i.name === 'Total Assets');
                            percentage = totalAssetsItem ? calculatePercentage(Math.abs(value), totalAssetsItem.total) : '0%';
                          }

                          return (
                            <React.Fragment key={item.name}>
                              <tr 
                                className={`hover:bg-gray-50 transition-colors ${isTotalRow ? 'bg-gray-50 font-semibold' : ''} ${hasSubAccounts ? 'cursor-pointer' : ''}`}
                                onClick={() => hasSubAccounts && toggleRowExpansion(item.name)}
                              >
                                <td className={`px-3 lg:px-4 py-3 text-left text-sm relative ${
                                  isTotalRow ? 'font-semibold text-gray-900' : 'text-gray-700'
                                }`}>
                                  <div className="flex items-center">
                                    {hasSubAccounts && (
                                      <button className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors">
                                        <ChevronRight 
                                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                          style={{ color: BRAND_COLORS.primary }}
                                        />
                                      </button>
                                    )}
                                    <span className="block truncate max-w-[120px] sm:max-w-none" title={item.name}>
                                      {item.name}
                                    </span>
                                    {hasSubAccounts && (
                                      <span className="ml-2 text-xs text-gray-400">
                                        ({item.subAccounts.length})
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className={`px-3 lg:px-4 py-3 text-right text-sm font-medium ${
                                  isNegative ? 'text-red-600' : 'text-gray-900'
                                }`}>
                                  {isNegative ? `(${formatCurrency(Math.abs(value))})` : formatCurrency(value)}
                                </td>
                                <td className="hidden sm:table-cell px-3 lg:px-4 py-3 text-right text-sm text-gray-500">
                                  {percentage}
                                </td>
                              </tr>
                              
                              {/* Sub-account rows */}
                              {isExpanded && hasSubAccounts && item.subAccounts.map((subItem, subIndex) => {
                                const subValue = subItem.months[selectedMonth] || subItem.total;
                                const subPercentage = calculatePercentage(subValue, value);
                                const hasSubSubAccounts = subItem.subAccounts && subItem.subAccounts.length > 0;
                                
                                return (
                                  <tr 
                                    key={`${item.name}-${subItem.name}`} 
                                    className="bg-blue-50 hover:bg-blue-100 transition-colors relative"
                                    onMouseEnter={() => setHoveredRow(`${item.name}-${subItem.name}`)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                  >
                                    <td className="px-3 lg:px-4 py-2 text-left text-sm text-gray-600 relative">
                                      <div className="flex items-center pl-8">
                                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: BRAND_COLORS.primary }}></div>
                                        <span className="block truncate max-w-[100px] sm:max-w-none" title={subItem.name}>
                                          {subItem.name}
                                        </span>
                                        {hasSubSubAccounts && (
                                          <span className="ml-2 text-xs text-gray-400">
                                            ({subItem.subAccounts.length})
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* Sub-account Hover Tooltip */}
                                      {hoveredRow === `${item.name}-${subItem.name}` && hasSubSubAccounts && (
                                        <div className="absolute left-full top-0 ml-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[200px]">
                                          {createTooltipContent(subItem, selectedMonth)}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-3 lg:px-4 py-2 text-right text-sm font-medium text-gray-700">
                                      {formatCurrency(subValue)}
                                    </td>
                                    <td className="hidden sm:table-cell px-3 lg:px-4 py-2 text-right text-sm text-gray-500">
                                      {subPercentage}
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Charts */}
            <div className="hidden lg:block space-y-6">
              {/* Revenue Trend Chart */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Revenue Trend</h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <YAxis 
                        tickFormatter={(value: any) => `${(value / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${formatCurrency(Number(value))}`, 'Revenue']}
                        labelStyle={{ fontSize: '12px' }}
                        contentStyle={{ fontSize: '12px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={BRAND_COLORS.primary} 
                        strokeWidth={2}
                        dot={{ r: 4, fill: BRAND_COLORS.primary }}
                        activeDot={{ r: 6, fill: BRAND_COLORS.primary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Expense Breakdown</h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Tooltip 
                        formatter={(value: any) => [`${formatCurrency(Number(value))}`, '']}
                        contentStyle={{ fontSize: '12px' }}
                      />
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                        fontSize={10}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 space-y-2">
                    {expenseData.map((item, index) => {
                      const total = expenseData.reduce((sum, expense) => sum + expense.value, 0);
                      const percent = ((item.value / total) * 100).toFixed(1);
                      return (
                        <div key={item.name} className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(item.value)} ({percent}%)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg text-white font-medium shadow-lg transition-transform text-sm max-w-xs ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        } ${notification.show ? 'translate-x-0' : 'translate-x-full'}`}>
          {notification.message}
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(timeViewDropdownOpen || restaurantDropdownOpen || bankAccountDropdownOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setTimeViewDropdownOpen(false);
            setRestaurantDropdownOpen(false);
            setBankAccountDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}
