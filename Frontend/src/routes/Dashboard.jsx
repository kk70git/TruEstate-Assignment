import React, { useState, useEffect, useRef } from 'react';
import { fetchTransactions, fetchFilterOptions } from '../services/api';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import TransactionTable from '../components/TransactionTable';
import { Search, RotateCw, ChevronDown, Info, Check } from 'lucide-react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });

  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: [],
    paymentMethods: [],
    tags: []
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('date');
  
  const [filters, setFilters] = useState({
    gender: '',
    category: '',
    region: '',
    paymentMethod: '',
    tags: '',
    ageRange: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions({
            regions: options?.regions || [],
            categories: options?.categories || [],
            paymentMethods: options?.paymentMethods || [],
            tags: options?.tags || []
        });
      } catch (err) {
        console.error("Could not load filters", err);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = { 
          page: pagination.page, 
          limit: 10, 
          search: debouncedSearch,
          sort,
          ...filters
        };

        if (filters.ageRange) {
           const [min, max] = filters.ageRange.split('-');
           if (min) params.minAge = min;
           if (max && max !== 'plus') params.maxAge = max;
        }

        const data = await fetchTransactions(params);
        
        if (data) {
            setTransactions(data.transactions || []);
            setPagination(prev => ({
                ...prev,
                totalPages: data.pages || 1,
                totalItems: data.total || 0
            }));

            if (data.stats) {
                setStats({
                    totalUnits: data.stats.units || 0,
                    totalAmount: data.stats.amount || 0,
                    totalDiscount: data.stats.discount || 0
                });
            }
        }
      } catch (error) {
        console.error("Error loading data", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [pagination.page, debouncedSearch, sort, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ 
        gender: '', category: '', region: '', paymentMethod: '', tags: '', 
        ageRange: '', startDate: '', endDate: '' 
    });
    setSearch('');
    setSort('date');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="flex flex-row h-screen bg-white font-sans text-[#1F2937] overflow-hidden">
      
      <div className="flex-shrink-0 z-20">
          <Sidebar />
      </div>
      
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-white">
        
        <header className="px-6 py-3 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
          <h1 className="text-lg font-bold text-black">Sales Management System</h1>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
             <input 
                type="text" 
                placeholder="Name, Phone no." 
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="pl-9 pr-4 py-2 bg-[#f3f3f3] rounded-md w-64 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-400 transition-all"
             />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
          
          <div className="flex flex-wrap items-center gap-2 my-4 relative z-10">
            <button onClick={clearFilters} className="p-2 bg-[#f3f3f3] rounded-md hover:bg-gray-200 text-gray-600 transition-colors" title="Reset Filters">
              <RotateCw size={14} />
            </button>
            
            <FilterDropdown label="Region" value={filters.region} onChange={(v) => handleFilterChange('region', v)} options={filterOptions.regions} />
            <FilterDropdown label="Gender" value={filters.gender} onChange={(v) => handleFilterChange('gender', v)} options={['Male', 'Female']} />
            <FilterDropdown label="Age" value={filters.ageRange} onChange={(v) => handleFilterChange('ageRange', v)} options={[{ label: '0-25', value: '0-25' }, { label: '26-45', value: '26-45' }, { label: '46-60', value: '46-60' }]} isMap={true} />
            <FilterDropdown label="Category" value={filters.category} onChange={(v) => handleFilterChange('category', v)} options={filterOptions.categories} />
            <FilterDropdown label="Tags" value={filters.tags} onChange={(v) => handleFilterChange('tags', v)} options={filterOptions.tags} />
            <FilterDropdown label="Payment" value={filters.paymentMethod} onChange={(v) => handleFilterChange('paymentMethod', v)} options={filterOptions.paymentMethods} />

            <DateRangeDropdown 
               startDate={filters.startDate} 
               endDate={filters.endDate} 
               onStartChange={(v) => handleFilterChange('startDate', v)}
               onEndChange={(v) => handleFilterChange('endDate', v)}
            />

            <div className="ml-auto">
                {/* NEW Custom Sort Dropdown */}
                <SortDropdown 
                  value={sort}
                  onChange={(val) => setSort(val)}
                />
            </div>
          </div>

          <div className="flex gap-4 mb-5">
            <StatCard title="Total units sold" value={stats.totalUnits.toLocaleString()} />
            <StatCard title="Total Amount" value={`₹${stats.totalAmount.toLocaleString()}`} />
            <StatCard title="Total Discount" value={`₹${stats.totalDiscount.toLocaleString()}`} />
          </div>

          <TransactionTable transactions={transactions} loading={loading} />

          <div className="flex justify-center mt-6 pb-2">
            <Pagination 
               currentPage={pagination.page} 
               totalPages={pagination.totalPages} 
               onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value}) => (
  <div className="border border-gray-200 rounded-lg p-3 min-w-[150px] bg-white shadow-sm flex flex-col h-15">
    <div className="flex items-center gap-2 text-gray-700 mb-1">
      <span className="text-xs font-semibold">{title}</span>
      <Info size={14} className="text-gray-400" />
    </div>
    <div className="flex items-baseline gap-2">
        <div className="text-md font-bold text-gray-900 tracking-tight">{value}</div>
    </div>
  </div>
);

const FilterDropdown = ({ label, value, onChange, options = [], isMap = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeOptions = Array.isArray(options) ? options : [];

  const getDisplayLabel = () => {
    if (!value) return label;
    if (isMap) {
      const found = safeOptions.find(o => o.value === value);
      return found ? found.label : value;
    }
    return value;
  };

  const handleSelect = (val) => {
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-transparent whitespace-nowrap
          ${value ? 'bg-gray-800 text-white' : 'bg-[#f3f3f3] text-gray-700 hover:bg-gray-200'}`}
      >
        {getDisplayLabel()}
        <ChevronDown size={14} className={value ? "text-gray-400" : "text-gray-500"} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
           <div className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
             Select {label}
           </div>
           
           <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
             <button
                onClick={() => handleSelect('')}
                className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
             >
                Clear Selection
             </button>

             {safeOptions.map((opt, i) => {
                const val = isMap ? opt.value : opt;
                const txt = isMap ? opt.label : opt;
                const isSelected = value === val;

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(val)}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between group transition-colors
                      ${isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {txt}
                    {isSelected && <Check size={12} />}
                  </button>
                );
             })}
           </div>
        </div>
      )}
    </div>
  );
};

const DateRangeDropdown = ({ startDate, endDate, onStartChange, onEndChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = startDate || endDate;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-transparent whitespace-nowrap
          ${isActive ? 'bg-gray-800 text-white' : 'bg-[#f3f3f3] text-gray-700 hover:bg-gray-200'}`}
      >
        Date
        <ChevronDown size={14} className={isActive ? "text-gray-400" : "text-gray-500"} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
           <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
             Select Date Range
           </div>
           
           <div className="flex flex-col gap-2">
             <div className="flex flex-col gap-1">
               <label className="text-[10px] text-gray-500 font-medium uppercase">Start</label>
               <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => onStartChange(e.target.value)}
                  className="bg-[#f3f3f3] px-2 py-1.5 rounded text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
               />
             </div>
             
             <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 font-medium uppercase">End</label>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => onEndChange(e.target.value)}
                    className="bg-[#f3f3f3] px-2 py-1.5 rounded text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
                />
             </div>

             {(startDate || endDate) && (
               <button 
                 onClick={() => { onStartChange(''); onEndChange(''); setIsOpen(false); }}
                 className="mt-1 text-xs text-red-500 hover:text-red-600 font-medium text-left"
               >
                 Clear Dates
               </button>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

// --- NEW Custom Sort Dropdown ---
const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { label: 'Date', value: 'date' },
    { label: 'Customer Name (A-Z)', value: 'name' },
    { label: 'Quantity', value: 'quantity' }
  ];

  const currentLabel = options.find(o => o.value === value)?.label || 'Date';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#f3f3f3] rounded-md text-xs text-gray-700 hover:bg-gray-200 font-medium transition-colors"
      >
        Sort by: <span className="font-bold text-black">{currentLabel}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
             Sort Order
           </div>
           <div className="py-1">
             {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between group transition-colors
                    ${value === opt.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  {opt.label}
                  {value === opt.value && <Check size={12} />}
                </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;