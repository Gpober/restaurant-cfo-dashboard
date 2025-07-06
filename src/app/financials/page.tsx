"use client";

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus, Download, RefreshCw, TrendingUp, DollarSign, PieChart, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

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
type FinancialTab = 'p&l' | 'cash-flow' | 'balance-sheet';
type TimeView = 'Monthly' | 'YTD' | 'TTM' | 'MoM' | 'YoY';
type ViewMode = 'total' | 'detailed';
type MonthString = `${'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 
                   'July' | 'August' | 'September' | 'October' | 'November' | 'December'} ${number}`;

interface FinancialDataItem {
  name: string;
  total: number;
  months: Partial<Record<MonthString, number>>;
}

interface FinancialData {
  [timeView: string]: {
    [month: string]: FinancialDataItem[];
  };
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface TooltipState {
  show: boolean;
  content: string;
  x: number;
  y: number;
}

// Restaurant-specific financial data
interface RestaurantFinancialData {
  [restaurant: string]: FinancialData;
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

// Sample data with realistic numbers by restaurant
const restaurantFinancialData: RestaurantFinancialData = {
  'Downtown Bistro': {
    Monthly: {
      'June 2025': [
        { name: 'Food Sales', total: 180000, months: { 'June 2025': 180000 } },
        { name: 'Beverage Sales', total: 100000, months: { 'June 2025': 100000 } },
        { name: 'Total Revenue', total: 280000, months: { 'June 2025': 280000 } },
        { name: 'Cost of Goods Sold', total: 98000, months: { 'June 2025': 98000 } },
        { name: 'Gross Profit', total: 182000, months: { 'June 2025': 182000 } },
        { name: 'Labor Costs', total: 85000, months: { 'June 2025': 85000 } },
        { name: 'Operating Expenses', total: 45000, months: { 'June 2025': 45000 } },
        { name: 'Operating Income', total: 52000, months: { 'June 2025': 52000 } },
        { name: 'Interest Expense', total: 5000, months: { 'June 2025': 5000 } },
        { name: 'Taxes', total: 11760, months: { 'June 2025': 11760 } },
        { name: 'Net Income', total: 35240, months: { 'June 2025': 35240 } },
      ],
      'May 2025': [
        { name: 'Food Sales', total: 165000, months: { 'May 2025': 165000 } },
        { name: 'Beverage Sales', total: 93000, months: { 'May 2025': 93000 } },
        { name: 'Total Revenue', total: 258000, months: { 'May 2025': 258000 } },
        { name: 'Cost of Goods Sold', total: 90360, months: { 'May 2025': 90360 } },
        { name: 'Gross Profit', total: 167640, months: { 'May 2025': 167640 } },
        { name: 'Labor Costs', total: 80000, months: { 'May 2025': 80000 } },
        { name: 'Operating Expenses', total: 42000, months: { 'May 2025': 42000 } },
        { name: 'Operating Income', total: 45640, months: { 'May 2025': 45640 } },
        { name: 'Interest Expense', total: 5000, months: { 'May 2025': 5000 } },
        { name: 'Taxes', total: 10440, months: { 'May 2025': 10440 } },
        { name: 'Net Income', total: 30200, months: { 'May 2025': 30200 } },
      ],
    },
    YTD: {
      'June 2025': [
        { name: 'Food Sales', total: 950000, months: { 
          'January 2025': 120000,
          'February 2025': 135000,
          'March 2025': 150000,
          'April 2025': 160000,
          'May 2025': 165000,
          'June 2025': 180000,
        } },
        { name: 'Beverage Sales', total: 520000, months: { 
          'January 2025': 65000,
          'February 2025': 75000,
          'March 2025': 85000,
          'April 2025': 90000,
          'May 2025': 93000,
          'June 2025': 100000,
        } },
      ],
    }
  },
  'Seaside Grill': {
    Monthly: {
      'June 2025': [
        { name: 'Food Sales', total: 220000, months: { 'June 2025': 220000 } },
        { name: 'Beverage Sales', total: 130000, months: { 'June 2025': 130000 } },
        { name: 'Total Revenue', total: 350000, months: { 'June 2025': 350000 } },
        { name: 'Cost of Goods Sold', total: 122500, months: { 'June 2025': 122500 } },
        { name: 'Gross Profit', total: 227500, months: { 'June 2025': 227500 } },
        { name: 'Labor Costs', total: 105000, months: { 'June 2025': 105000 } },
        { name: 'Operating Expenses', total: 55000, months: { 'June 2025': 55000 } },
        { name: 'Operating Income', total: 67500, months: { 'June 2025': 67500 } },
        { name: 'Interest Expense', total: 6000, months: { 'June 2025': 6000 } },
        { name: 'Taxes', total: 14700, months: { 'June 2025': 14700 } },
        { name: 'Net Income', total: 46800, months: { 'June 2025': 46800 } },
      ],
      'May 2025': [
        { name: 'Food Sales', total: 200000, months: { 'May 2025': 200000 } },
        { name: 'Beverage Sales', total: 122500, months: { 'May 2025': 122500 } },
        { name: 'Total Revenue', total: 322500, months: { 'May 2025': 322500 } },
        { name: 'Cost of Goods Sold', total: 112875, months: { 'May 2025': 112875 } },
        { name: 'Gross Profit', total: 209625, months: { 'May 2025': 209625 } },
        { name: 'Labor Costs', total: 98000, months: { 'May 2025': 98000 } },
        { name: 'Operating Expenses', total: 52000, months: { 'May 2025': 52000 } },
        { name: 'Operating Income', total: 59625, months: { 'May 2025': 59625 } },
        { name: 'Interest Expense', total: 6000, months: { 'May 2025': 6000 } },
        { name: 'Taxes', total: 13050, months: { 'May 2025': 13050 } },
        { name: 'Net Income', total: 40575, months: { 'May 2025': 40575 } },
      ],
    },
    YTD: {
      'June 2025': [
        { name: 'Food Sales', total: 1187500, months: { 
          'January 2025': 150000,
          'February 2025': 170000,
          'March 2025': 190000,
          'April 2025': 200000,
          'May 2025': 200000,
          'June 2025': 220000,
        } },
        { name: 'Beverage Sales', total: 650000, months: { 
          'January 2025': 80000,
          'February 2025': 95000,
          'March 2025': 105000,
          'April 2025': 115000,
          'May 2025': 122500,
          'June 2025': 130000,
        } },
      ],
    }
  },
  'Mountain Tavern': {
    Monthly: {
      'June 2025': [
        { name: 'Food Sales', total: 120000, months: { 'June 2025': 120000 } },
        { name: 'Beverage Sales', total: 65000, months: { 'June 2025': 65000 } },
        { name: 'Total Revenue', total: 185000, months: { 'June 2025': 185000 } },
        { name: 'Cost of Goods Sold', total: 64750, months: { 'June 2025': 64750 } },
        { name: 'Gross Profit', total: 120250, months: { 'June 2025': 120250 } },
        { name: 'Labor Costs', total: 55000, months: { 'June 2025': 55000 } },
        { name: 'Operating Expenses', total: 30000, months: { 'June 2025': 30000 } },
        { name: 'Operating Income', total: 35250, months: { 'June 2025': 35250 } },
        { name: 'Interest Expense', total: 3500, months: { 'June 2025': 3500 } },
        { name: 'Taxes', total: 7770, months: { 'June 2025': 7770 } },
        { name: 'Net Income', total: 23980, months: { 'June 2025': 23980 } },
      ],
      'May 2025': [
        { name: 'Food Sales', total: 110000, months: { 'May 2025': 110000 } },
        { name: 'Beverage Sales', total: 60250, months: { 'May 2025': 60250 } },
        { name: 'Total Revenue', total: 170250, months: { 'May 2025': 170250 } },
        { name: 'Cost of Goods Sold', total: 59588, months: { 'May 2025': 59588 } },
        { name: 'Gross Profit', total: 110662, months: { 'May 2025': 110662 } },
        { name: 'Labor Costs', total: 52000, months: { 'May 2025': 52000 } },
        { name: 'Operating Expenses', total: 28000, months: { 'May 2025': 28000 } },
        { name: 'Operating Income', total: 30662, months: { 'May 2025': 30662 } },
        { name: 'Interest Expense', total: 3500, months: { 'May 2025': 3500 } },
        { name: 'Taxes', total: 6960, months: { 'May 2025': 6960 } },
        { name: 'Net Income', total: 20202, months: { 'May 2025': 20202 } },
      ],
    },
    YTD: {
      'June 2025': [
        { name: 'Food Sales', total: 630000, months: { 
          'January 2025': 80000,
          'February 2025': 90000,
          'March 2025': 100000,
          'April 2025': 105000,
          'May 2025': 110000,
          'June 2025': 120000,
        } },
        { name: 'Beverage Sales', total: 340000, months: { 
          'January 2025': 45000,
          'February 2025': 50000,
          'March 2025': 55000,
          'April 2025': 58000,
          'May 2025': 60250,
          'June 2025': 65000,
        } },
      ],
    }
  },
};

const allMonths = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const monthsList: MonthString[] = [
  'June 2025', 'May 2025'
];

const COLORS = [BRAND_COLORS.primary, BRAND_COLORS.success, BRAND_COLORS.warning, BRAND_COLORS.danger, BRAND_COLORS.secondary, BRAND_COLORS.tertiary];

// Restaurant-specific Cash Flow Data
interface RestaurantCashFlowData {
  [restaurant: string]: {
    inFlow: FinancialDataItem[];
    outFlow: FinancialDataItem[];
    totalInFlow: number;
    totalOutFlow: number;
    totalCashFlow: number;
    beginningCash: number;
    endingCash: number;
  };
}

// Balance Sheet Details - Sub-accounts for each category
const balanceSheetDetails: Record<string, FinancialDataItem[]> = {
  'Cash & Cash Equivalents': [
    { name: 'Chase Business Checking', total: 145000, months: { 'June 2025': 145000 } },
    { name: 'Wells Fargo Savings', total: 85000, months: { 'June 2025': 85000 } },
    { name: 'PayPal Business Account', total: 35000, months: { 'June 2025': 35000 } },
    { name: 'Petty Cash', total: 20000, months: { 'June 2025': 20000 } },
  ],
  'Accounts Receivable': [
    { name: 'Catering Receivables', total: 45000, months: { 'June 2025': 45000 } },
    { name: 'Gift Card Liabilities', total: 35000, months: { 'June 2025': 35000 } },
    { name: 'Event Deposits', total: 25000, months: { 'June 2025': 25000 } },
  ],
  'Property & Equipment': [
    { name: 'Kitchen Equipment', total: 250000, months: { 'June 2025': 250000 } },
    { name: 'Furniture & Fixtures', total: 150000, months: { 'June 2025': 150000 } },
    { name: 'POS Systems', total: 50000, months: { 'June 2025': 50000 } },
    { name: 'Leasehold Improvements', total: 200000, months: { 'June 2025': 200000 } },
  ],
  'Accounts Payable': [
    { name: 'Food Suppliers', total: 85000, months: { 'June 2025': 85000 } },
    { name: 'Beverage Suppliers', total: 45000, months: { 'June 2025': 45000 } },
    { name: 'Utilities', total: 35000, months: { 'June 2025': 35000 } },
    { name: 'Marketing Services', total: 20000, months: { 'June 2025': 20000 } },
  ],
  'Long-term Debt': [
    { name: 'Restaurant Mortgage', total: 350000, months: { 'June 2025': 350000 } },
    { name: 'Equipment Loan', total: 75000, months: { 'June 2025': 75000 } },
    { name: 'Line of Credit', total: 25000, months: { 'June 2025': 25000 } },
  ],
};

const restaurantCashFlowData: RestaurantCashFlowData = {
  'Downtown Bistro': {
    inFlow: [
      { name: 'Dine-in Revenue', total: 150000, months: { 'June 2025': 150000 } },
      { name: 'Takeout Revenue', total: 65000, months: { 'June 2025': 65000 } },
      { name: 'Catering Revenue', total: 35000, months: { 'June 2025': 35000 } },
      { name: 'Gift Card Sales', total: 15000, months: { 'June 2025': 15000 } },
    ],
    outFlow: [
      { name: 'Food Purchases', total: -65000, months: { 'June 2025': -65000 } },
      { name: 'Beverage Purchases', total: -33000, months: { 'June 2025': -33000 } },
      { name: 'Payroll', total: -85000, months: { 'June 2025': -85000 } },
      { name: 'Rent', total: -25000, months: { 'June 2025': -25000 } },
    ],
    totalInFlow: 265000,
    totalOutFlow: -208000,
    totalCashFlow: 57000,
    beginningCash: 75000,
    endingCash: 132000
  },
  'Seaside Grill': {
    inFlow: [
      { name: 'Dine-in Revenue', total: 180000, months: { 'June 2025': 180000 } },
      { name: 'Takeout Revenue', total: 85000, months: { 'June 2025': 85000 } },
      { name: 'Catering Revenue', total: 45000, months: { 'June 2025': 45000 } },
      { name: 'Gift Card Sales', total: 20000, months: { 'June 2025': 20000 } },
    ],
    outFlow: [
      { name: 'Food Purchases', total: -80000, months: { 'June 2025': -80000 } },
      { name: 'Beverage Purchases', total: -42500, months: { 'June 2025': -42500 } },
      { name: 'Payroll', total: -105000, months: { 'June 2025': -105000 } },
      { name: 'Rent', total: -30000, months: { 'June 2025': -30000 } },
    ],
    totalInFlow: 330000,
    totalOutFlow: -257500,
    totalCashFlow: 72500,
    beginningCash: 95000,
    endingCash: 167500
  },
  'Mountain Tavern': {
    inFlow: [
      { name: 'Dine-in Revenue', total: 90000, months: { 'June 2025': 90000 } },
      { name: 'Takeout Revenue', total: 45000, months: { 'June 2025': 45000 } },
      { name: 'Catering Revenue', total: 25000, months: { 'June 2025': 25000 } },
      { name: 'Gift Card Sales', total: 10000, months: { 'June 2025': 10000 } },
    ],
    outFlow: [
      { name: 'Food Purchases', total: -45000, months: { 'June 2025': -45000 } },
      { name: 'Beverage Purchases', total: -19750, months: { 'June 2025': -19750 } },
      { name: 'Payroll', total: -55000, months: { 'June 2025': -55000 } },
      { name: 'Rent', total: -18000, months: { 'June 2025': -18000 } },
    ],
    totalInFlow: 170000,
    totalOutFlow: -137750,
    totalCashFlow: 32250,
    beginningCash: 50000,
    endingCash: 82250
  },
};

// Cash Flow Details - Sub-accounts for each category
const cashFlowDetails: Record<string, FinancialDataItem[]> = {
  'Dine-in Revenue': [
    { name: 'Lunch Service', total: 85000, months: { 'June 2025': 85000 } },
    { name: 'Dinner Service', total: 185000, months: { 'June 2025': 185000 } },
    { name: 'Weekend Brunch', total: 65000, months: { 'June 2025': 65000 } },
  ],
  'Takeout Revenue': [
    { name: 'Online Orders', total: 85000, months: { 'June 2025': 85000 } },
    { name: 'Phone Orders', total: 25000, months: { 'June 2025': 25000 } },
    { name: 'Third-party Delivery', total: 15000, months: { 'June 2025': 15000 } },
  ],
  'Food Purchases': [
    { name: 'Produce', total: -85000, months: { 'June 2025': -85000 } },
    { name: 'Meat & Seafood', total: -125000, months: { 'June 2025': -125000 } },
    { name: 'Dairy', total: -45000, months: { 'June 2025': -45000 } },
    { name: 'Dry Goods', total: -30000, months: { 'June 2025': -30000 } },
  ],
  'Payroll': [
    { name: 'Kitchen Staff', total: -85000, months: { 'June 2025': -85000 } },
    { name: 'Front of House', total: -45000, months: { 'June 2025': -45000 } },
    { name: 'Management', total: -35000, months: { 'June 2025': -35000 } },
  ],
};

// Expandable account data for P&L
const accountDetails: Record<string, FinancialDataItem[]> = {
  'Food Sales': [
    { name: 'Appetizers', total: 250000, months: { 'June 2025': 250000 } },
    { name: 'Entrees', total: 450000, months: { 'June 2025': 450000 } },
    { name: 'Desserts', total: 100000, months: { 'June 2025': 100000 } },
    { name: 'Kids Menu', total: 50000, months: { 'June 2025': 50000 } },
  ],
  'Beverage Sales': [
    { name: 'Alcoholic Beverages', total: 300000, months: { 'June 2025': 300000 } },
    { name: 'Non-Alcoholic Beverages', total: 150000, months: { 'June 2025': 150000 } },
    { name: 'Coffee/Tea', total: 75000, months: { 'June 2025': 75000 } },
  ],
  'Cost of Goods Sold': [
    { name: 'Food Cost', total: 350000, months: { 'June 2025': 350000 } },
    { name: 'Beverage Cost', total: 150000, months: { 'June 2025': 150000 } },
    { name: 'Packaging', total: 50000, months: { 'June 2025': 50000 } },
  ],
  'Labor Costs': [
    { name: 'Kitchen Staff', total: 200000, months: { 'June 2025': 200000 } },
    { name: 'Front of House', total: 150000, months: { 'June 2025': 150000 } },
    { name: 'Management', total: 100000, months: { 'June 2025': 100000 } },
  ],
};

// Sub-detail breakdowns for the detail items (both P&L and Cash Flow)
const subAccountDetails: Record<string, Array<{name: string, amount: number}>> = {
  // P&L Sub-details
  'Entrees': [
    { name: 'Steak', amount: 180000 },
    { name: 'Seafood', amount: 120000 },
    { name: 'Pasta', amount: 85000 },
    { name: 'Vegetarian', amount: 65000 },
  ],
  'Alcoholic Beverages': [
    { name: 'Wine', amount: 120000 },
    { name: 'Beer', amount: 85000 },
    { name: 'Cocktails', amount: 65000 },
    { name: 'Spirits', amount: 30000 },
  ],
  // Cash Flow Sub-details
  'Kitchen Staff': [
    { name: 'Chefs', amount: 65000 },
    { name: 'Line Cooks', amount: 45000 },
    { name: 'Prep Cooks', amount: 25000 },
    { name: 'Dishwashers', amount: 15000 },
  ],
  'Food Cost': [
    { name: 'Produce', amount: 125000 },
    { name: 'Meat', amount: 125000 },
    { name: 'Seafood', amount: 65000 },
    { name: 'Dairy', amount: 35000 },
  ],
};

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState<FinancialTab>('p&l');
  const [selectedMonth, setSelectedMonth] = useState<MonthString>('June 2025');
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [timeView, setTimeView] = useState<TimeView>('Monthly');
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  const [timeViewDropdownOpen, setTimeViewDropdownOpen] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [accountTooltip, setAccountTooltip] = useState<TooltipState>({ show: false, content: '', x: 0, y: 0 });
  const [bankAccountDropdownOpen, setBankAccountDropdownOpen] = useState(false);
  const [selectedBankAccounts, setSelectedBankAccounts] = useState<Set<string>>(new Set(['All Accounts']));
  
  // Restaurant filtering state
  const [restaurantDropdownOpen, setRestaurantDropdownOpen] = useState(false);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set(['All Restaurants']));

  // Available restaurants
  const restaurants = ['All Restaurants', 'Downtown Bistro', 'Seaside Grill', 'Mountain Tavern'];
  const bankAccounts = ['All Accounts', 'Chase Business Checking', 'Wells Fargo Savings', 'Capital One Credit Line', 'PayPal Business', 'Stripe Account'];

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

  const getSelectedBankAccountsText = () => {
    if (selectedBankAccounts.has('All Accounts') || selectedBankAccounts.size === 0) {
      return 'All Accounts';
    }
    if (selectedBankAccounts.size === 1) {
      return Array.from(selectedBankAccounts)[0];
    }
    return `${selectedBankAccounts.size} Accounts Selected`;
  };

  const getSelectedRestaurantsText = () => {
    if (selectedRestaurants.has('All Restaurants') || selectedRestaurants.size === 0) {
      return 'All Restaurants';
    }
    if (selectedRestaurants.size === 1) {
      return Array.from(selectedRestaurants)[0];
    }
    return `${selectedRestaurants.size} Restaurants Selected`;
  };

  // Helper function to get filtered financial data based on selected restaurants
  const getFilteredFinancialData = () => {
    if (selectedRestaurants.has('All Restaurants') || selectedRestaurants.size === 0) {
      // Aggregate all restaurants
      const allRestaurants = Object.keys(restaurantFinancialData);
      return aggregateRestaurantData(allRestaurants);
    } else {
      // Aggregate only selected restaurants
      return aggregateRestaurantData(Array.from(selectedRestaurants));
    }
  };

  // Helper function to get filtered cash flow data based on selected restaurants
  const getFilteredCashFlowData = () => {
    if (selectedRestaurants.has('All Restaurants') || selectedRestaurants.size === 0) {
      // Aggregate all restaurants
      const allRestaurants = Object.keys(restaurantCashFlowData);
      return aggregateCashFlowData(allRestaurants);
    } else {
      // Aggregate only selected restaurants
      return aggregateCashFlowData(Array.from(selectedRestaurants));
    }
  };

  // Function to aggregate financial data from multiple restaurants
  const aggregateRestaurantData = (restaurantNames: string[]): FinancialData => {
    const result: FinancialData = { Monthly: {}, YTD: {} };
    
    // Aggregate Monthly data
    monthsList.forEach(month => {
      const aggregatedItems: FinancialDataItem[] = [];
      const lineItems = ['Food Sales', 'Beverage Sales', 'Total Revenue', 'Cost of Goods Sold', 'Gross Profit', 'Labor Costs', 'Operating Expenses', 'Operating Income', 'Interest Expense', 'Taxes', 'Net Income'];
      
      lineItems.forEach(lineItem => {
        let totalAmount = 0;
        const monthData: Partial<Record<MonthString, number>> = {};
        
        restaurantNames.forEach(restaurantName => {
          const restaurantData = restaurantFinancialData[restaurantName]?.Monthly?.[month];
          const item = restaurantData?.find(item => item.name === lineItem);
          if (item && item.total !== undefined) {
            totalAmount += item.total;
            Object.entries(item.months).forEach(([monthKey, value]) => {
              if (value !== undefined) {
                monthData[monthKey as MonthString] = (monthData[monthKey as MonthString] || 0) + value;
              }
            });
          }
        });
        
        aggregatedItems.push({
          name: lineItem,
          total: totalAmount,
          months: monthData
        });
      });
      
      result.Monthly[month] = aggregatedItems;
    });

    // Aggregate YTD data
    if (timeView === 'YTD') {
      const ytdMonths = getCurrentYearYtdMonths();
      result.YTD[selectedMonth] = [];
      
      const lineItems = ['Food Sales', 'Beverage Sales'];
      
      lineItems.forEach(lineItem => {
        let totalAmount = 0;
        const monthData: Partial<Record<MonthString, number>> = {};
        
        restaurantNames.forEach(restaurantName => {
          const restaurantYtdData = restaurantFinancialData[restaurantName]?.YTD?.[selectedMonth];
          const item = restaurantYtdData?.find(item => item.name === lineItem);
          if (item && item.total !== undefined) {
            totalAmount += item.total;
            Object.entries(item.months).forEach(([monthKey, value]) => {
              if (value !== undefined) {
                monthData[monthKey as MonthString] = (monthData[monthKey as MonthString] || 0) + value;
              }
            });
          }
        });
        
        result.YTD[selectedMonth].push({
          name: lineItem,
          total: totalAmount,
          months: monthData
        });
      });
    }
    
    return result;
  };

  // Function to aggregate cash flow data from multiple restaurants
  const aggregateCashFlowData = (restaurantNames: string[]) => {
    let totalInFlow = 0;
    let totalOutFlow = 0;
    let totalCashFlow = 0;
    let beginningCash = 0;
    let endingCash = 0;
    
    const aggregatedInFlow: FinancialDataItem[] = [];
    const aggregatedOutFlow: FinancialDataItem[] = [];
    
    // Aggregate inFlow
    const inFlowItems = ['Dine-in Revenue', 'Takeout Revenue', 'Catering Revenue', 'Gift Card Sales'];
    inFlowItems.forEach(itemName => {
      let totalAmount = 0;
      const monthData: Partial<Record<MonthString, number>> = {};
      
      restaurantNames.forEach(restaurantName => {
        const restaurantCashFlow = restaurantCashFlowData[restaurantName];
        const item = restaurantCashFlow?.inFlow.find(item => item.name === itemName);
        if (item && item.total !== undefined) {
          totalAmount += item.total;
          Object.entries(item.months).forEach(([monthKey, value]) => {
            if (value !== undefined) {
              monthData[monthKey as MonthString] = (monthData[monthKey as MonthString] || 0) + value;
            }
          });
        }
      });
      
      aggregatedInFlow.push({
        name: itemName,
        total: totalAmount,
        months: monthData
      });
    });
    
    // Aggregate outFlow
    const outFlowItems = ['Food Purchases', 'Beverage Purchases', 'Payroll', 'Rent'];
    outFlowItems.forEach(itemName => {
      let totalAmount = 0;
      const monthData: Partial<Record<MonthString, number>> = {};
      
      restaurantNames.forEach(restaurantName => {
        const restaurantCashFlow = restaurantCashFlowData[restaurantName];
        const item = restaurantCashFlow?.outFlow.find(item => item.name === itemName);
        if (item && item.total !== undefined) {
          totalAmount += item.total;
          Object.entries(item.months).forEach(([monthKey, value]) => {
            if (value !== undefined) {
              monthData[monthKey as MonthString] = (monthData[monthKey as MonthString] || 0) + value;
            }
          });
        }
      });
      
      aggregatedOutFlow.push({
        name: itemName,
        total: totalAmount,
        months: monthData
      });
    });
    
    // Calculate totals
    restaurantNames.forEach(restaurantName => {
      const restaurantCashFlow = restaurantCashFlowData[restaurantName];
      if (restaurantCashFlow) {
        totalInFlow += restaurantCashFlow.totalInFlow;
        totalOutFlow += restaurantCashFlow.totalOutFlow;
        totalCashFlow += restaurantCashFlow.totalCashFlow;
        beginningCash += restaurantCashFlow.beginningCash;
        endingCash += restaurantCashFlow.endingCash;
      }
    });
    
    return {
      inFlow: aggregatedInFlow,
      outFlow: aggregatedOutFlow,
      totalInFlow,
      totalOutFlow,
      totalCashFlow,
      beginningCash,
      endingCash
    };
  };

  // Helper functions
  const formatCurrency = (value: number): string => {
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

  const toggleAccountExpansion = (accountName: string): void => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountName)) {
      newExpanded.delete(accountName);
    } else {
      newExpanded.add(accountName);
    }
    setExpandedAccounts(newExpanded);
  };

  const isExpandableAccount = (accountName: string): boolean => {
    return accountDetails.hasOwnProperty(accountName);
  };

  const isCashFlowExpandableAccount = (accountName: string): boolean => {
    return cashFlowDetails.hasOwnProperty(accountName);
  };

  const isBalanceSheetExpandableAccount = (accountName: string): boolean => {
    return balanceSheetDetails.hasOwnProperty(accountName);
  };

  const handleAccountMouseEnter = (event: React.MouseEvent<HTMLElement>, subAccountName: string, subAccountTotal: number): void => {
    const details = subAccountDetails[subAccountName];
    if (!details || details.length === 0) return;

    let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">
      ${subAccountName} • ${formatCurrency(subAccountTotal)}
    </div>`;

    details.forEach((item, index) => {
      const percentage = subAccountTotal ? ((item.amount / subAccountTotal) * 100).toFixed(1) : '0';
      
      tooltipContent += `
        <div style="margin-bottom: ${index < details.length - 1 ? '8px' : '0'};">
          <div style="display: flex; align-items: center; gap: 4px;">
            <div style="width: 6px; height: 6px; background: ${BRAND_COLORS.success}; border-radius: 50%;"></div>
            <strong style="font-size: 12px; color: white;">${item.name}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-left: 10px;">
            <span style="font-size: 11px;">${formatCurrency(item.amount)}</span>
            <span style="font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px;">${percentage}%</span>
          </div>
        </div>
      `;
    });

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setAccountTooltip({
      show: true,
      content: tooltipContent,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleAccountMouseLeave = (): void => {
    setAccountTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  const getCurrentYearYtdMonths = (): MonthString[] => {
    const [selectedMonthName, selectedYear] = selectedMonth.split(' ') as [typeof allMonths[number], string];
    const monthIndex = allMonths.indexOf(selectedMonthName);
    return allMonths
      .slice(0, monthIndex + 1)
      .map(month => `${month} ${selectedYear}` as MonthString);
  };

  const getDisplayData = () => {
    const filteredData = getFilteredFinancialData();
    
    switch (timeView) {
      case 'Monthly':
        return {
          months: [selectedMonth],
          isComparison: false,
          currentData: filteredData.Monthly?.[selectedMonth] || []
        };
      
      case 'YTD':
        return {
          months: getCurrentYearYtdMonths(),
          isComparison: false,
          currentData: filteredData.YTD?.[selectedMonth] || []
        };
      
      default:
        return {
          months: [selectedMonth],
          isComparison: false,
          currentData: filteredData.Monthly?.[selectedMonth] || []
        };
    }
  };

  const { months: displayMonths, currentData } = getDisplayData();
  const filteredCashFlowData = getFilteredCashFlowData();

  const renderColumnHeaders = () => {
    if (timeView === 'YTD') {
      if (viewMode === 'total') {
        const currentMonth = displayMonths[displayMonths.length - 1].split(' ')[0];
        return (
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            YTD {displayMonths[0].split(' ')[1]} (Jan-{currentMonth})
          </th>
        );
      } else {
        return displayMonths.map(month => (
          <th key={month} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            {month.split(' ')[0]}
          </th>
        ));
      }
    }

    return (
      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
        {displayMonths[0]}
      </th>
    );
  };

  const renderCashFlowDataCells = (item: FinancialDataItem) => {
    const value = item.months[displayMonths[0]] || 0;
    return (
      <td className={`px-4 py-3 text-right text-sm font-medium ${
        value >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {value >= 0 ? formatCurrency(value) : `(${formatCurrency(Math.abs(value))})`}
      </td>
    );
  };

  const renderDataCells = (item: FinancialDataItem) => {
    if (timeView === 'YTD') {
      if (viewMode === 'total') {
        const ytdSum = displayMonths.reduce((sum, month) => {
          const monthValue = item.months[month];
          return sum + (monthValue !== undefined ? monthValue : 0);
        }, 0);
        return (
          <td className="px-4 py-3 text-right text-sm font-medium">
            {formatCurrency(ytdSum)}
          </td>
        );
      } else {
        return displayMonths.map(month => (
          <td key={month} className="px-4 py-3 text-right text-sm font-medium">
            {formatCurrency(item.months[month] || 0)}
          </td>
        ));
      }
    }

    const value = item.months[displayMonths[0]] || 0;
    return (
      <td className="px-4 py-3 text-right text-sm font-medium">
        {formatCurrency(value)}
      </td>
    );
  };

  // Calculate KPIs from current data
  const calculateKPIs = () => {
    const revenue = currentData.find(item => item.name === 'Total Revenue')?.total || 0;
    const grossProfit = currentData.find(item => item.name === 'Gross Profit')?.total || 0;
    const operatingIncome = currentData.find(item => item.name === 'Operating Income')?.total || 0;
    const netIncome = currentData.find(item => item.name === 'Net Income')?.total || 0;
    
    return {
      revenue,
      grossMargin: revenue ? (grossProfit / revenue) * 100 : 0,
      operatingMargin: revenue ? (operatingIncome / revenue) * 100 : 0,
      netMargin: revenue ? (netIncome / revenue) * 100 : 0
    };
  };

  const generateTrendData = () => {
    const months = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'];
    const monthKeys: MonthString[] = ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025'];
    const filteredData = getFilteredFinancialData();
    
    return months.map((month, index) => {
      const monthData = filteredData.Monthly?.[monthKeys[index]] || [];
      return {
        month,
        revenue: monthData.find(item => item.name === 'Total Revenue')?.total || 0,
        grossProfit: monthData.find(item => item.name === 'Gross Profit')?.total || 0,
        operatingIncome: monthData.find(item => item.name === 'Operating Income')?.total || 0,
        netIncome: monthData.find(item => item.name === 'Net Income')?.total || 0,
      };
    });
  };

  const generateExpenseBreakdown = () => {
    const cogs = currentData.find(item => item.name === 'Cost of Goods Sold')?.total || 0;
    const labor = currentData.find(item => item.name === 'Labor Costs')?.total || 0;
    const opex = currentData.find(item => item.name === 'Operating Expenses')?.total || 0;
    const interest = currentData.find(item => item.name === 'Interest Expense')?.total || 0;
    const taxes = currentData.find(item => item.name === 'Taxes')?.total || 0;
    
    return [
      { name: 'Cost of Goods Sold', value: cogs },
      { name: 'Labor Costs', value: labor },
      { name: 'Operating Expenses', value: opex },
      { name: 'Interest Expense', value: interest },
      { name: 'Taxes', value: taxes },
    ];
  };

  const kpis = calculateKPIs();
  const trendData = generateTrendData();
  const expenseData = generateExpenseBreakdown();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header with Restaurant CFO Branding */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <IAMCFOLogo className="w-8 h-8 mr-4" />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">I AM CFO</h1>
                <span className="text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: BRAND_COLORS.primary }}>
                  Financial Management
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Real-time P&L, Cash Flow & Balance Sheet • QuickBooks/Xero Integration</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h2 className="text-3xl font-bold" style={{ color: BRAND_COLORS.primary }}>Restaurant Financial Dashboard</h2>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Month Selector */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value as MonthString)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-red-500 focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': BRAND_COLORS.secondary + '33' } as React.CSSProperties}
              >
                {monthsList.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Restaurant Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRestaurantDropdownOpen(!restaurantDropdownOpen)}
                  className="flex items-center justify-between w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-red-500 focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': BRAND_COLORS.secondary + '33' } as React.CSSProperties}
                >
                  <span className="truncate">{getSelectedRestaurantsText()}</span>
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${restaurantDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {restaurantDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {restaurants.map((restaurant) => (
                      <div
                        key={restaurant}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => handleRestaurantToggle(restaurant)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRestaurants.has(restaurant)}
                          onChange={() => {}} // Handled by onClick above
                          className="mr-3 h-4 w-4 border-gray-300 rounded"
                          style={{ accentColor: BRAND_COLORS.primary }}
                        />
                        <span className={restaurant === 'All Restaurants' ? 'font-medium text-gray-900' : 'text-gray-700'}>
                          {restaurant}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Time View Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setTimeViewDropdownOpen(!timeViewDropdownOpen)}
                  className="flex items-center justify-between w-32 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-red-500 focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': BRAND_COLORS.secondary + '33' } as React.CSSProperties}
                >
                  <span>{timeView}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${timeViewDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {timeViewDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    {(['Monthly', 'YTD', 'TTM', 'MoM', 'YoY'] as TimeView[]).map((view) => (
                      <div
                        key={view}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => {
                          setTimeView(view);
                          setTimeViewDropdownOpen(false);
                        }}
                      >
                        {view}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
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

              {/* Action Buttons */}
              <button
                onClick={() => showNotification('Financial data exported', 'success')}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors shadow-sm"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                onClick={() => showNotification('Financial data refreshed', 'info')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Financial KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.primary }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Total Revenue</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(kpis.revenue)}</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                    +8.7% vs last month
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getSelectedRestaurantsText()}
                  </div>
                </div>
                <DollarSign className="w-8 h-8" style={{ color: BRAND_COLORS.primary }} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.success }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Gross Margin</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.grossMargin.toFixed(1)}%</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                    +1.2% vs last month
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getSelectedRestaurantsText()}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8" style={{ color: BRAND_COLORS.success }} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.warning }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Operating Margin</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.operatingMargin.toFixed(1)}%</div>
                  <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block">
                    +0.5% vs last month
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getSelectedRestaurantsText()}
                  </div>
                </div>
                <BarChart3 className="w-8 h-8" style={{ color: BRAND_COLORS.warning }} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: BRAND_COLORS.secondary }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Net Margin</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.netMargin.toFixed(1)}%</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                    +0.8% vs last month
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getSelectedRestaurantsText()}
                  </div>
                </div>
                <PieChart className="w-8 h-8" style={{ color: BRAND_COLORS.secondary }} />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Financial Tables */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {activeTab === 'p&l' ? 'Restaurant P&L Statement' : 
                       activeTab === 'cash-flow' ? 'Restaurant Cash Flow' : 
                       'Restaurant Balance Sheet'}
                    </h3>
                    <div className="flex gap-2">
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
                        Cash Flow
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
                        Balance Sheet
                      </button>
                    </div>
                  </div>
                </div>

                {/* P&L Content */}
                {activeTab === 'p&l' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account
                          </th>
                          {renderColumnHeaders()}
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            % of Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((item, index) => {
                          const isTotalRow = item.name === 'Net Income' || item.name === 'Gross Profit' || item.name === 'Total Revenue';
                          const isExpandable = isExpandableAccount(item.name);
                          const isExpanded = expandedAccounts.has(item.name);
                          const revenueItem = currentData.find(i => i.name === 'Total Revenue');
                          const percentOfRevenue = revenueItem 
                            ? calculatePercentage(item.total, revenueItem.total)
                            : '0%';

                          return (
                            <React.Fragment key={item.name}>
                              {/* Main Account Row */}
                              <tr 
                                className={`hover:bg-gray-50 transition-colors ${isTotalRow ? 'bg-gray-50 font-semibold' : ''}`}
                              >
                                <td className={`px-4 py-3 text-left text-sm ${
                                  isTotalRow ? 'font-semibold text-gray-900' : 'text-gray-700'
                                }`}>
                                  <div className="flex items-center">
                                    {isExpandable && (
                                      <button
                                        onClick={() => toggleAccountExpansion(item.name)}
                                        className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                      >
                                        {isExpanded ? (
                                          <ChevronDown className="w-4 h-4 text-gray-500" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4 text-gray-500" />
                                        )}
                                      </button>
                                    )}
                                    {item.name}
                                  </div>
                                </td>
                                {renderDataCells(item)}
                                <td className="px-4 py-3 text-right text-sm text-gray-500">
                                  {percentOfRevenue}
                                </td>
                              </tr>

                              {/* Expanded Detail Rows */}
                              {isExpandable && isExpanded && accountDetails[item.name] && 
                                accountDetails[item.name].map((subItem) => {
                                  const hasSubDetails = subAccountDetails.hasOwnProperty(subItem.name);
                                  return (
                                    <tr key={`${item.name}-${subItem.name}`} className="bg-red-50 hover:bg-red-100 transition-colors">
                                      <td className="px-4 py-2 text-left text-sm text-gray-600 pl-12">
                                        <div className="flex items-center">
                                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: BRAND_COLORS.primary }}></div>
                                          {subItem.name}
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 text-right text-sm text-gray-600">
                                        <span 
                                          className={hasSubDetails ? "cursor-help border-b border-dotted border-gray-500" : ""}
                                          onMouseEnter={hasSubDetails ? (e) => handleAccountMouseEnter(e, subItem.name, subItem.total) : undefined}
                                          onMouseLeave={hasSubDetails ? handleAccountMouseLeave : undefined}
                                        >
                                          {formatCurrency(subItem.total)}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 text-right text-sm text-gray-500">
                                        {revenueItem ? calculatePercentage(subItem.total, revenueItem.total) : '0%'}
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Cash Flow Content - Restaurant Style */}
                {activeTab === 'cash-flow' && (
                  <div>
                    {/* Bank Account Selector - Only show on Cash Flow tab */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Select Bank Accounts:</h4>
                        <div className="relative">
                          <button
                            onClick={() => setBankAccountDropdownOpen(!bankAccountDropdownOpen)}
                            className="flex items-center justify-between w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-red-500 focus:outline-none focus:ring-2 transition-all"
                            style={{ '--tw-ring-color': BRAND_COLORS.secondary + '33' } as React.CSSProperties}
                          >
                            <span className="truncate">{getSelectedBankAccountsText()}</span>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${bankAccountDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {bankAccountDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                              {bankAccounts.map((account) => (
                                <div
                                  key={account}
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                  onClick={() => handleBankAccountToggle(account)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedBankAccounts.has(account)}
                                    onChange={() => {}} // Handled by onClick above
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
                      <div className="mt-2 text-xs text-gray-500">
                        Viewing cash flow for: {getSelectedBankAccountsText()}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Account
                            </th>
                            {renderColumnHeaders()}
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              % of Total Cash
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Cash In-Flow Section */}
                          <tr className="bg-green-50">
                            <td colSpan={100} className="px-4 py-3 text-left text-sm font-bold text-green-800">
                              💰 CASH IN-FLOW
                            </td>
                          </tr>
                          {filteredCashFlowData.inFlow.map((item) => {
                            const isExpandable = isCashFlowExpandableAccount(item.name);
                            const isExpanded = expandedAccounts.has(item.name);
                            const totalCash = Math.abs(filteredCashFlowData.totalCashFlow);
                            const percentOfCash = totalCash ? calculatePercentage(item.total, totalCash) : '0%';

                            return (
                              <React.Fragment key={`inflow-${item.name}`}>
                                <tr className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                                    <div className="flex items-center">
                                      {isExpandable && (
                                        <button
                                          onClick={() => toggleAccountExpansion(item.name)}
                                          className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500" />
                                          )}
                                        </button>
                                      )}
                                      <span className="ml-4">{item.name}</span>
                                    </div>
                                  </td>
                                  {renderCashFlowDataCells(item)}
                                  <td className="px-4 py-3 text-right text-sm text-green-600">
                                    {percentOfCash}
                                  </td>
                                </tr>
                                {/* Expanded Detail Rows for Cash In-Flow */}
                                {isExpandable && isExpanded && cashFlowDetails[item.name] && 
                                  cashFlowDetails[item.name].map((subItem) => {
                                    const hasSubDetails = subAccountDetails.hasOwnProperty(subItem.name);
                                    return (
                                      <tr key={`${item.name}-${subItem.name}`} className="bg-green-25 hover:bg-green-50 transition-colors">
                                        <td className="px-4 py-2 text-left text-sm text-gray-600 pl-16">
                                          <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                            {subItem.name}
                                          </div>
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm text-green-600">
                                          <span 
                                            className={hasSubDetails ? "cursor-help border-b border-dotted border-gray-500" : ""}
                                            onMouseEnter={hasSubDetails ? (e) => handleAccountMouseEnter(e, subItem.name, subItem.total) : undefined}
                                            onMouseLeave={hasSubDetails ? handleAccountMouseLeave : undefined}
                                          >
                                            {formatCurrency(subItem.total)}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm text-gray-500">
                                          {totalCash ? calculatePercentage(subItem.total, totalCash) : '0%'}
                                        </td>
                                      </tr>
                                    );
                                  })
                                }
                              </React.Fragment>
                            );
                          })}
                          
                          {/* Total Cash In-Flow */}
                          <tr className="bg-green-100 font-semibold">
                            <td className="px-4 py-3 text-left text-sm text-green-800 font-bold">
                              Total Cash In-Flow
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-green-800 font-bold">
                              {formatCurrency(filteredCashFlowData.totalInFlow)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-green-800 font-bold">
                              100%
                            </td>
                          </tr>

                          {/* Cash Out-Flow Section */}
                          <tr className="bg-red-50">
                            <td colSpan={100} className="px-4 py-3 text-left text-sm font-bold text-red-800">
                              💸 CASH OUT-FLOW
                            </td>
                          </tr>
                          {filteredCashFlowData.outFlow.map((item) => {
                            const isExpandable = isCashFlowExpandableAccount(item.name);
                            const isExpanded = expandedAccounts.has(item.name);
                            const totalCash = Math.abs(filteredCashFlowData.totalCashFlow);
                            const percentOfCash = totalCash ? calculatePercentage(Math.abs(item.total), totalCash) : '0%';

                            return (
                              <React.Fragment key={`outflow-${item.name}`}>
                                <tr className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                                    <div className="flex items-center">
                                      {isExpandable && (
                                        <button
                                          onClick={() => toggleAccountExpansion(item.name)}
                                          className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500" />
                                          )}
                                        </button>
                                      )}
                                      <span className="ml-4">{item.name}</span>
                                    </div>
                                  </td>
                                  {renderCashFlowDataCells(item)}
                                  <td className="px-4 py-3 text-right text-sm text-red-600">
                                    {percentOfCash}
                                  </td>
                                </tr>
                                {/* Expanded Detail Rows for Cash Out-Flow */}
                                {isExpandable && isExpanded && cashFlowDetails[item.name] && 
                                  cashFlowDetails[item.name].map((subItem) => {
                                    const hasSubDetails = subAccountDetails.hasOwnProperty(subItem.name);
                                    return (
                                      <tr key={`${item.name}-${subItem.name}`} className="bg-red-25 hover:bg-red-50 transition-colors">
                                        <td className="px-4 py-2 text-left text-sm text-gray-600 pl-16">
                                          <div className="flex items-center">
                                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                            {subItem.name}
                                          </div>
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm text-red-600">
                                          <span 
                                            className={hasSubDetails ? "cursor-help border-b border-dotted border-gray-500" : ""}
                                            onMouseEnter={hasSubDetails ? (e) => handleAccountMouseEnter(e, subItem.name, Math.abs(subItem.total)) : undefined}
                                            onMouseLeave={hasSubDetails ? handleAccountMouseLeave : undefined}
                                          >
                                            ({formatCurrency(Math.abs(subItem.total))})
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm text-gray-500">
                                          {totalCash ? calculatePercentage(Math.abs(subItem.total), totalCash) : '0%'}
                                        </td>
                                      </tr>
                                    );
                                  })
                                }
                              </React.Fragment>
                            );
                          })}

                          {/* Total Cash Out-Flow */}
                          <tr className="bg-red-100 font-semibold">
                            <td className="px-4 py-3 text-left text-sm text-red-800 font-bold">
                              Total Cash Out-Flow
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-red-800 font-bold">
                              ({formatCurrency(Math.abs(filteredCashFlowData.totalOutFlow))})
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-red-800 font-bold">
                              100%
                            </td>
                          </tr>

                          {/* Net Cash Flow */}
                          <tr className="border-t-2" style={{ backgroundColor: BRAND_COLORS.primary + '10', borderTopColor: BRAND_COLORS.primary + '40' }}>
                            <td className="px-4 py-4 text-left text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                              🏦 NET CASH FLOW
                            </td>
                            <td className={`px-4 py-4 text-right text-lg font-bold ${
                              filteredCashFlowData.totalCashFlow >= 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {formatCurrency(filteredCashFlowData.totalCashFlow)}
                            </td>
                            <td className="px-4 py-4 text-right text-sm" style={{ color: BRAND_COLORS.primary }}>
                              Net Change
                            </td>
                          </tr>

                          {/* Beginning & Ending Cash Balance */}
                          <tr className="bg-gray-50">
                            <td className="px-4 py-3 text-left text-sm text-gray-700">
                              Beginning Cash Balance
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              {formatCurrency(filteredCashFlowData.beginningCash)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                              Starting
                            </td>
                          </tr>
                          <tr className="border-t" style={{ backgroundColor: BRAND_COLORS.primary + '20', borderTopColor: BRAND_COLORS.primary + '40' }}>
                            <td className="px-4 py-3 text-left text-sm font-bold" style={{ color: BRAND_COLORS.primary }}>
                              Ending Cash Balance
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-bold" style={{ color: BRAND_COLORS.primary }}>
                              {formatCurrency(filteredCashFlowData.endingCash)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm" style={{ color: BRAND_COLORS.primary }}>
                              Final
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Balance Sheet Content */}
                {activeTab === 'balance-sheet' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account
                          </th>
                          {renderColumnHeaders()}
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            % of Total Assets
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* ASSETS SECTION */}
                        <tr className="bg-blue-50">
                          <td colSpan={100} className="px-4 py-3 text-left text-sm font-bold text-blue-800">
                            📊 ASSETS
                          </td>
                        </tr>
                        
                        {/* Current Assets */}
                        <tr className="bg-blue-25">
                          <td colSpan={100} className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                            Current Assets
                          </td>
                        </tr>
                        
                        {/* Cash & Cash Equivalents - Expandable */}
                        <React.Fragment key="cash-equivalents">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                              <div className="flex items-center">
                                {isBalanceSheetExpandableAccount('Cash & Cash Equivalents') && (
                                  <button
                                    onClick={() => toggleAccountExpansion('Cash & Cash Equivalents')}
                                    className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                  >
                                    {expandedAccounts.has('Cash & Cash Equivalents') ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                )}
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                Cash & Cash Equivalents
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {formatCurrency(285000)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                              12.4%
                            </td>
                          </tr>
                          
                          {/* Expanded Cash Detail Rows */}
                          {isBalanceSheetExpandableAccount('Cash & Cash Equivalents') && 
                           expandedAccounts.has('Cash & Cash Equivalents') && 
                           balanceSheetDetails['Cash & Cash Equivalents'].map((subItem) => {
                             const hasSubDetails = subAccountDetails.hasOwnProperty(subItem.name);
                             return (
                               <tr key={`cash-${subItem.name}`} className="bg-blue-25 hover:bg-blue-50 transition-colors">
                                 <td className="px-4 py-2 text-left text-sm text-gray-600 pl-16">
                                   <div className="flex items-center">
                                     <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                     {subItem.name}
                                   </div>
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-600">
                                   <span 
                                     className={hasSubDetails ? "cursor-help border-b border-dotted border-gray-500" : ""}
                                     onMouseEnter={hasSubDetails ? (e) => handleAccountMouseEnter(e, subItem.name, subItem.total) : undefined}
                                     onMouseLeave={hasSubDetails ? handleAccountMouseLeave : undefined}
                                   >
                                     {formatCurrency(subItem.total)}
                                   </span>
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-500">
                                   {((subItem.total / 2300000) * 100).toFixed(1)}%
                                 </td>
                               </tr>
                             );
                           })
                          }
                        </React.Fragment>
                        
                        {/* Accounts Receivable - Expandable */}
                        <React.Fragment key="accounts-receivable">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                              <div className="flex items-center">
                                {isBalanceSheetExpandableAccount('Accounts Receivable') && (
                                  <button
                                    onClick={() => toggleAccountExpansion('Accounts Receivable')}
                                    className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                  >
                                    {expandedAccounts.has('Accounts Receivable') ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                )}
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                Accounts Receivable
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {formatCurrency(105000)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                              4.6%
                            </td>
                          </tr>
                          
                          {/* Expanded A/R Detail Rows */}
                          {isBalanceSheetExpandableAccount('Accounts Receivable') && 
                           expandedAccounts.has('Accounts Receivable') && 
                           balanceSheetDetails['Accounts Receivable'].map((subItem) => {
                             return (
                               <tr key={`ar-${subItem.name}`} className="bg-blue-25 hover:bg-blue-50 transition-colors">
                                 <td className="px-4 py-2 text-left text-sm text-gray-600 pl-16">
                                   <div className="flex items-center">
                                     <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                     {subItem.name}
                                   </div>
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-600">
                                   {formatCurrency(subItem.total)}
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-500">
                                   {((subItem.total / 2300000) * 100).toFixed(1)}%
                                 </td>
                               </tr>
                             );
                           })
                          }
                        </React.Fragment>
                        
                        {/* Inventory - Non-expandable */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              Food & Beverage Inventory
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(125000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            5.4%
                          </td>
                        </tr>
                        
                        {/* Prepaid Expenses - Non-expandable */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              Prepaid Expenses
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(35000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            1.5%
                          </td>
                        </tr>
                        
                        <tr className="bg-blue-100 font-semibold">
                          <td className="px-4 py-3 text-left text-sm text-blue-800 font-bold pl-6">
                            Total Current Assets
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-blue-800 font-bold">
                            {formatCurrency(550000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-blue-800 font-bold">
                            23.9%
                          </td>
                        </tr>
                        
                        {/* Fixed Assets */}
                        <tr className="bg-blue-25">
                          <td colSpan={100} className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                            Fixed Assets
                          </td>
                        </tr>
                        
                        {/* Property & Equipment - Expandable */}
                        <React.Fragment key="ppe">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                              <div className="flex items-center">
                                {isBalanceSheetExpandableAccount('Property & Equipment') && (
                                  <button
                                    onClick={() => toggleAccountExpansion('Property & Equipment')}
                                    className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                  >
                                    {expandedAccounts.has('Property & Equipment') ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                )}
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                Property & Equipment
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {formatCurrency(1450000)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                              63.0%
                            </td>
                          </tr>
                          
                          {/* Expanded PPE Detail Rows */}
                          {isBalanceSheetExpandableAccount('Property & Equipment') && 
                           expandedAccounts.has('Property & Equipment') && 
                           balanceSheetDetails['Property & Equipment'].map((subItem) => {
                             return (
                               <tr key={`ppe-${subItem.name}`} className="bg-blue-25 hover:bg-blue-50 transition-colors">
                                 <td className="px-4 py-2 text-left text-sm text-gray-600 pl-16">
                                   <div className="flex items-center">
                                     <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                     {subItem.name}
                                   </div>
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-600">
                                   {formatCurrency(subItem.total)}
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-500">
                                   {((subItem.total / 2300000) * 100).toFixed(1)}%
                                 </td>
                               </tr>
                             );
                           })
                          }
                        </React.Fragment>
                        
                        {/* Continue with other sections... */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              Less: Accumulated Depreciation
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-red-600">
                            ({formatCurrency(285000)})
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            -12.4%
                          </td>
                        </tr>
                        
                        <tr className="bg-blue-100 font-semibold">
                          <td className="px-4 py-3 text-left text-sm text-blue-800 font-bold pl-6">
                            Total Fixed Assets
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-blue-800 font-bold">
                            {formatCurrency(1165000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-blue-800 font-bold">
                            50.7%
                          </td>
                        </tr>
                        
                        {/* Other Assets - Keep existing structure */}
                        <tr className="bg-blue-25">
                          <td colSpan={100} className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                            Other Assets
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              Goodwill
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(165000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            7.2%
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              Liquor License
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(75000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            3.3%
                          </td>
                        </tr>
                        
                        <tr className="bg-blue-100 font-semibold">
                          <td className="px-4 py-3 text-left text-sm text-blue-800 font-bold pl-6">
                            Total Other Assets
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-blue-800 font-bold">
                            {formatCurrency(240000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-blue-800 font-bold">
                            10.4%
                          </td>
                        </tr>
                        
                        {/* TOTAL ASSETS */}
                        <tr className="border-t-2" style={{ backgroundColor: BRAND_COLORS.primary + '20', borderTopColor: BRAND_COLORS.primary + '40' }}>
                          <td className="px-4 py-4 text-left text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                            📈 TOTAL ASSETS
                          </td>
                          <td className="px-4 py-4 text-right text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                            {formatCurrency(1955000)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-bold" style={{ color: BRAND_COLORS.primary }}>
                            100.0%
                          </td>
                        </tr>
                        
                        {/* LIABILITIES SECTION */}
                        <tr className="bg-red-50">
                          <td colSpan={100} className="px-4 py-3 text-left text-sm font-bold text-red-800">
                            💳 LIABILITIES
                          </td>
                        </tr>
                        
                        {/* Current Liabilities */}
                        <tr className="bg-red-25">
                          <td colSpan={100} className="px-4 py-2 text-left text-sm font-semibold text-red-700">
                            Current Liabilities
                          </td>
                        </tr>
                        
                        {/* Accounts Payable - Expandable */}
                        <React.Fragment key="accounts-payable">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                              <div className="flex items-center">
                                {isBalanceSheetExpandableAccount('Accounts Payable') && (
                                  <button
                                    onClick={() => toggleAccountExpansion('Accounts Payable')}
                                    className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                  >
                                    {expandedAccounts.has('Accounts Payable') ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                )}
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                Accounts Payable
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {formatCurrency(185000)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                              8.0%
                            </td>
                          </tr>
                          
                          {/* Expanded A/P Detail Rows */}
                          {isBalanceSheetExpandableAccount('Accounts Payable') && 
                           expandedAccounts.has('Accounts Payable') && 
                           balanceSheetDetails['Accounts Payable'].map((subItem) => {
                             return (
                               <tr key={`ap-${subItem.name}`} className="bg-red-25 hover:bg-red-50 transition-colors">
                                 <td className="px-4 py-2 text-left text-sm text-gray-600 pl-16">
                                   <div className="flex items-center">
                                     <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                     {subItem.name}
                                   </div>
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-600">
                                   {formatCurrency(subItem.total)}
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-500">
                                   {((subItem.total / 2300000) * 100).toFixed(1)}%
                                 </td>
                               </tr>
                             );
                           })
                          }
                        </React.Fragment>
                        
                        {/* Continue with remaining liability items... */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                              Accrued Wages
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(65000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            2.8%
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                              Sales Tax Payable
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(45000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            2.0%
                          </td>
                        </tr>
                        
                        <tr className="bg-red-100 font-semibold">
                          <td className="px-4 py-3 text-left text-sm text-red-800 font-bold pl-6">
                            Total Current Liabilities
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-red-800 font-bold">
                            {formatCurrency(295000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-red-800 font-bold">
                            12.8%
                          </td>
                        </tr>
                        
                        {/* Long-term Liabilities */}
                        <tr className="bg-red-25">
                          <td colSpan={100} className="px-4 py-2 text-left text-sm font-semibold text-red-700">
                            Long-term Liabilities
                          </td>
                        </tr>
                        
                        {/* Long-term Debt - Expandable */}
                        <React.Fragment key="long-term-debt">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                              <div className="flex items-center">
                                {isBalanceSheetExpandableAccount('Long-term Debt') && (
                                  <button
                                    onClick={() => toggleAccountExpansion('Long-term Debt')}
                                    className="mr-2 hover:bg-gray-200 p-1 rounded transition-colors"
                                  >
                                    {expandedAccounts.has('Long-term Debt') ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                )}
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                Long-term Debt
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {formatCurrency(450000)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                              19.6%
                            </td>
                          </tr>
                          
                          {/* Expanded Long-term Debt Detail Rows */}
                          {isBalanceSheetExpandableAccount('Long-term Debt') && 
                           expandedAccounts.has('Long-term Debt') && 
                           balanceSheetDetails['Long-term Debt'].map((subItem) => {
                             return (
                               <tr key={`ltd-${subItem.name}`} className="bg-red-25 hover:bg-red-50 transition-colors">
                                 <td className="px-4 py-2 text-left text-sm text-gray-600 pl-16">
                                   <div className="flex items-center">
                                     <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                     {subItem.name}
                                   </div>
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-600">
                                   {formatCurrency(subItem.total)}
                                 </td>
                                 <td className="px-4 py-2 text-right text-sm text-gray-500">
                                   {((subItem.total / 2300000) * 100).toFixed(1)}%
                                 </td>
                               </tr>
                             );
                           })
                          }
                        </React.Fragment>
                        
                        {/* Continue with remaining sections as in original... */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-8">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                              Lease Liability
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(150000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            6.5%
                          </td>
                        </tr>
                        
                        <tr className="bg-red-100 font-semibold">
                          <td className="px-4 py-3 text-left text-sm text-red-800 font-bold pl-6">
                            Total Long-term Liabilities
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-red-800 font-bold">
                            {formatCurrency(600000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-red-800 font-bold">
                            26.1%
                          </td>
                        </tr>
                        
                        {/* TOTAL LIABILITIES */}
                        <tr className="bg-red-200 font-semibold">
                          <td className="px-4 py-3 text-left text-sm text-red-900 font-bold">
                            Total Liabilities
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-red-900 font-bold">
                            {formatCurrency(895000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-red-900 font-bold">
                            38.9%
                          </td>
                        </tr>
                        
                        {/* EQUITY SECTION */}
                        <tr className="bg-green-50">
                          <td colSpan={100} className="px-4 py-3 text-left text-sm font-bold text-green-800">
                            🏛️ OWNERS' EQUITY
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-6">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              Owner's Capital
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(750000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            32.6%
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-left text-sm text-gray-700 pl-6">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              Retained Earnings
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(310000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500">
                            13.5%
                          </td>
                        </tr>
                        
                        <tr className="bg-green-100 font-semibold">
                          <td className="px-4 py-3 text-left text-sm text-green-800 font-bold">
                            Total Owners' Equity
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-green-800 font-bold">
                            {formatCurrency(1060000)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-green-800 font-bold">
                            46.1%
                          </td>
                        </tr>
                        
                        {/* TOTAL LIABILITIES & EQUITY */}
                        <tr className="border-t-2" style={{ backgroundColor: BRAND_COLORS.primary + '20', borderTopColor: BRAND_COLORS.primary + '40' }}>
                          <td className="px-4 py-4 text-left text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                            ⚖️ TOTAL LIABILITIES & EQUITY
                          </td>
                          <td className="px-4 py-4 text-right text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                            {formatCurrency(1955000)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-bold" style={{ color: BRAND_COLORS.primary }}>
                            100.0%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Charts */}
            <div className="space-y-8">
              {/* Revenue Trend Chart */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Revenue Trend</h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value: any) => `${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: any) => [`${formatCurrency(Number(value))}`, 'Revenue']} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={BRAND_COLORS.primary} 
                        strokeWidth={3}
                        dot={{ r: 6, fill: BRAND_COLORS.primary }}
                        activeDot={{ r: 8, fill: BRAND_COLORS.primary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Breakdown - Light Readable Tooltip */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Expense Breakdown</h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Tooltip 
                        formatter={(value: any) => [`${formatCurrency(Number(value))}`, '']}
                        labelFormatter={(label) => label}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          color: '#374151',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }}
                        labelStyle={{
                          color: '#111827',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}
                        itemStyle={{
                          color: '#374151',
                          fontSize: '14px'
                        }}
                      />
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  {/* Clean Manual Legend */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
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

          {/* Account Tooltip */}
          {accountTooltip.show && (
            <div
              className="fixed z-50 bg-gray-900 text-white p-4 rounded-lg text-xs shadow-xl pointer-events-none transition-opacity border border-gray-700"
              style={{
                left: Math.max(10, Math.min(accountTooltip.x - 140, window.innerWidth - 290)),
                top: accountTooltip.y - 10,
                transform: 'translateY(-100%)',
                maxWidth: '280px',
                minWidth: '260px'
              }}
              dangerouslySetInnerHTML={{ __html: accountTooltip.content }}
            />
          )}

          {/* Notification */}
          {notification.show && (
            <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-lg text-white font-medium shadow-lg transition-transform ${
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
      </main>
    </div>
  );
}