/**
 * @file Layout.jsx
 * @description Global application frame component. Renders the light responsive backdrop,
 * a modern floating visual Navigation bar, handles active-link rendering styling,
 * and includes a clean academic footer layout.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Skull, ShieldAlert, Settings, Home as HomeIcon, PlusCircle, BarChart3 } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen text-slate-800 font-sans relative overflow-x-hidden">
      {/* Animated gradient canvas background defined inside index.css */}
      <div className="animated-bg"></div>
      
      {/* ─── Floating Header Navigation ─── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-card rounded-full px-6 py-2.5 flex items-center space-x-6 shadow-md">
        
        {/* Logo Link to Homepage */}
        <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:text-primary transition-colors">
          <Skull className="w-5 h-5 text-primary" />
          <span className="font-bold hidden sm:block tracking-wide">SurviveMyDegree</span>
        </Link>
        
        <div className="h-5 w-px bg-slate-200"></div>

        {/* Home Route Nav Button */}
        <Link to="/" className={`flex items-center space-x-1 ${location.pathname === '/' ? 'text-primary' : 'text-slate-600 hover:text-slate-900'}`}>
          <HomeIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </Link>

        {/* Admin Dashboard Route Nav Button */}
        <Link to="/admin" className={`flex items-center space-x-1 ${location.pathname === '/admin' ? 'text-accent' : 'text-slate-600 hover:text-slate-900'}`}>
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Admin</span>
        </Link>

        {/* Analytics Dashboard Nav Button */}
        <Link to="/analytics" className={`flex items-center space-x-1 ${location.pathname === '/analytics' ? 'text-secondary' : 'text-slate-600 hover:text-slate-900'}`}>
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm font-medium">Analytics</span>
        </Link>

        {/* Multi-step Registration Wizard Link (styled as a pill button) */}
        <Link to="/admin/add" className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${location.pathname === '/admin/add' ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
          <PlusCircle className="w-4 h-4 mr-1" />
          <span className="hidden sm:block">Add Course</span>
        </Link>
      </nav>

      {/* ─── Main Content Container Slot ─── */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {children}
      </main>

      {/* ─── Light Theme Academic Footer ─── */}
      <footer className="py-8 text-center text-slate-500 text-sm glass-card mt-12 border-t border-slate-200">
        <p>Built with tears, caffeine, and Ctrl+C / Ctrl+V.</p>
        <p className="mt-1 flex items-center justify-center text-slate-400">
          <ShieldAlert className="w-4 h-4 mr-1 text-accent" /> May your GPA rest in peace.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
