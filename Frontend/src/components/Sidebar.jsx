import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Inbox, 
  FileText, 
  Ban, 
  CheckCircle,
  FileCheck,
  ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const Sidebar = () => {
  const [expanded, setExpanded] = useState({
    services: true,
    invoices: true
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-[240px] bg-[#f3f3f3] border-r border-gray-200 min-h-screen flex flex-col font-sans text-[13px]">
      
      {/* --- User/App Header --- */}
      <div className="p-3">
        <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-black rounded flex items-center justify-center text-white">
              <span className="font-bold text-lg">V</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-none">Vault</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">Anurag Yadav</p>
            </div>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        
        {/* Main Nav Items */}
        <div className="space-y-0.5">
          <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard" active />
          <NavItem icon={<Users size={16} />} label="Nexus" />
          <NavItem icon={<Inbox size={16} />} label="Intake" />
        </div>

        {/* --- SERVICES COMPONENT (Separate Box) --- */}
        <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-2">
          <button 
            onClick={() => toggleSection('services')}
            className="flex items-center justify-between w-full px-2 py-1.5 text-gray-600 hover:text-gray-900"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="font-medium">Services</span>
            </div>
            {expanded.services ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          {expanded.services && (
            <div className="pl-2 space-y-0.5 mt-1">
              <SubNavItem icon={<CheckCircle size={14} />} label="Pre-active" />
              <SubNavItem icon={<LayoutDashboard size={14} />} label="Active" />
              <SubNavItem icon={<Ban size={14} />} label="Blocked" />
              <SubNavItem icon={<CheckCircle size={14} />} label="Closed" />
            </div>
          )}
        </div>

        {/* --- INVOICES COMPONENT (Separate Box) --- */}
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm p-2">
          <button 
            onClick={() => toggleSection('invoices')}
            className="flex items-center justify-between w-full px-2 py-1.5 text-gray-600 hover:text-gray-900"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span className="font-medium">Invoices</span>
            </div>
            {expanded.invoices ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          {expanded.invoices && (
            <div className="pl-2 space-y-0.5 mt-1">
              <SubNavItem icon={<FileCheck size={14} />} label="Proforma Invoices" isBold={true} />
              <SubNavItem icon={<FileText size={14} />} label="Final Invoices" />
            </div>
          )}
        </div>

      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md transition-all
    ${active 
      ? 'text-gray-900 bg-gray-200/60 font-medium' 
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}>
    <span className={active ? "text-black" : "text-gray-400"}>{icon}</span>
    <span>{label}</span>
  </button>
);

const SubNavItem = ({ icon, label, isBold = false }) => (
  <button className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-900
    ${isBold ? 'font-bold text-gray-800' : ''}
  `}>
    <span className="text-gray-400">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Sidebar;