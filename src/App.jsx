import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, UserSquare, Users, Calendar,
  BarChart3, Settings, Sun, Moon, Palette, QrCode,
  Download, Share2, Mail, Phone, Briefcase, Clock, 
  CheckCircle2, X, Menu, ArrowRight, CalendarPlus, 
  Copy, ExternalLink, Smartphone, Building, Link as LinkIcon,
  Sparkles, Loader2, Wand2, FileText
} from 'lucide-react';

// --- GEMINI API INTEGRATION ---
const apiKey = ""; // API key is injected at runtime

// Updated Frontend API Call
const callGemini = async (prompt) => {
  let retries = 5;
  let delay = 1000;

  while (retries > 0) {
    try {
      // Call our own secure backend endpoint!
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      return data.text;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
};


// --- UI COMPONENTS ---

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 focus:ring-slate-500",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300 focus:ring-brand-500",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:ring-slate-500",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-sm"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input 
        className={`block w-full rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-4 py-2.5 border transition-colors ${Icon ? 'pl-10' : ''}`}
        {...props} 
      />
    </div>
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- MAIN APPLICATION ---

export default function App() {
  // Application State
  const [themeMode, setThemeMode] = useState('dark');
  const [brandColor, setBrandColor] = useState('violet');
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Data State
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Chen',
    title: 'Senior Solutions Architect',
    department: 'Cloud Infrastructure',
    company: 'Nexus Tech Global',
    email: 'alex.chen@nexustech.example.com',
    phone: '+1 (555) 019-2834',
    headline: 'Helping enterprises scale through innovative cloud architecture and digital transformation.',
    elevatorPitch: "Hi, I'm Alex. I'm a Senior Solutions Architect at Nexus Tech Global. I help enterprises scale up their cloud infrastructure securely. I'd love to learn about what you do!",
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bgPic: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  });

  const [contacts, setContacts] = useState([
    { id: 1, firstName: 'Sarah', lastName: 'Jenkins', title: 'VP of Engineering', company: 'Stark Industries', email: 'sarah.j@stark.example.com', phone: '555-0101', date: '2026-04-28' },
    { id: 2, firstName: 'Michael', lastName: 'Ross', title: 'Managing Partner', company: 'Pearson Hardman', email: 'mross@ph.example.com', phone: '555-0102', date: '2026-04-27' },
  ]);

  const [appointments, setAppointments] = useState([
    { id: 1, clientName: 'Sarah Jenkins', service: 'Consultation Call', date: '2026-04-30', time: '10:00 AM', status: 'upcoming' },
    { id: 2, clientName: 'David Kim', service: 'Technical Review', date: '2026-05-02', time: '02:00 PM', status: 'upcoming' },
  ]);

  // Toast Notification System
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Theme Application Effect
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Dynamic Theme Colors
  const getBrandColors = () => {
    const colors = {
      violet: { main: '#8b5cf6', hover: '#7c3aed', class: 'bg-violet-600' },
      blue: { main: '#3b82f6', hover: '#2563eb', class: 'bg-blue-600' },
      emerald: { main: '#10b981', hover: '#059669', class: 'bg-emerald-600' },
      rose: { main: '#f43f5e', hover: '#e11d48', class: 'bg-rose-600' },
    };
    return colors[brandColor];
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor', label: 'My Digital Card', icon: UserSquare },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'calendar', label: 'Calendar & Booking', icon: Calendar },
    { id: 'settings', label: 'Settings & Theme', icon: Settings },
  ];

  // Render specific views based on currentView state
  const renderView = () => {
    if (currentView === 'public') {
      return <PublicCardView 
                profile={profile} 
                brandColors={getBrandColors()} 
                onAddContact={(c) => { setContacts([c, ...contacts]); showToast('Contact saved successfully!'); }}
                onBookAppointment={(a) => { setAppointments([a, ...appointments]); showToast('Appointment booked!'); }}
                onExit={() => setCurrentView('editor')}
                showToast={showToast}
              />;
    }

    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
              {navItems.find(i => i.id === currentView)?.label || currentView}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {profile.firstName}. Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrentView('public')} className="hidden sm:flex">
              <ExternalLink className="w-4 h-4 mr-2" /> Preview Public Card
            </Button>
            <Button onClick={() => setQrModalOpen(true)}>
              <QrCode className="w-4 h-4 mr-2" /> Share QR
            </Button>
          </div>
        </header>

        {currentView === 'dashboard' && <DashboardView contacts={contacts} appointments={appointments} profile={profile} showToast={showToast} />}
        {currentView === 'editor' && <CardEditorView profile={profile} setProfile={setProfile} setQrModalOpen={setQrModalOpen} setCurrentView={setCurrentView} showToast={showToast} />}
        {currentView === 'contacts' && <ContactsView contacts={contacts} profile={profile} showToast={showToast} />}
        {currentView === 'calendar' && <CalendarView appointments={appointments} showToast={showToast} profile={profile} />}
        {currentView === 'settings' && (
           <SettingsView 
             themeMode={themeMode} setThemeMode={setThemeMode}
             brandColor={brandColor} setBrandColor={setBrandColor}
           />
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300`}
         style={{ '--brand-color': getBrandColors().main, '--brand-hover': getBrandColors().hover }}>
      
      {/* Dynamic styles to map standard Tailwind colors to our CSS variables for the theme */}
      <style>{`
        .bg-brand-500 { background-color: var(--brand-color); }
        .bg-brand-600 { background-color: var(--brand-hover); }
        .text-brand-500 { color: var(--brand-color); }
        .border-brand-500 { border-color: var(--brand-color); }
        .ring-brand-500 { --tw-ring-color: var(--brand-color); }
        .focus\\:ring-brand-500:focus { --tw-ring-color: var(--brand-color); }
        .focus\\:border-brand-500:focus { border-color: var(--brand-color); }
      `}</style>

      {/* App Shell */}
      {currentView !== 'public' && (
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
            <div className="p-6 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-xl">C</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                CybrBook
              </span>
            </div>
            
            <nav className="flex-1 px-4 space-y-1 mt-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-500/10 text-brand-500 dark:bg-brand-500/20' 
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <img src={profile.profilePic} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Free Plan</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Header */}
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">C</div>
              <span className="font-bold text-slate-900 dark:text-white">CybrBook</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-10 pt-16 bg-white dark:bg-slate-900 animate-in slide-in-from-top">
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setCurrentView(item.id); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl ${
                        currentView === item.id ? 'bg-brand-500/10 text-brand-500' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-lg">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-20 md:pb-0 bg-slate-50 dark:bg-slate-950 relative">
            {renderView()}
          </main>
        </div>
      )}

      {/* Standalone Public View (No app shell) */}
      {currentView === 'public' && renderView()}

      {/* Global Modals & Toasts */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md p-6 relative">
            <button onClick={() => setQrModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your QR Code</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Scan to view and save your digital business card.</p>
              
              <div className="bg-white p-4 rounded-2xl mx-auto inline-block border-4 border-slate-100 dark:border-slate-700 shadow-sm mb-6">
                {/* Simulated QR Code via API for demonstration */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://cybrbook.demo/card/' + profile.firstName.toLowerCase())}`} 
                  alt="QR Code" 
                  className="w-48 h-48 rounded-lg"
                />
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="flex-1" onClick={() => {
                  navigator.clipboard?.writeText('https://cybrbook.demo/card/alex');
                  showToast('Link copied to clipboard!');
                }}>
                  <Copy className="w-4 h-4 mr-2" /> Copy Link
                </Button>
                <Button className="flex-1" onClick={() => { setQrModalOpen(false); setCurrentView('public'); }}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Open Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


// --- VIEW COMPONENTS ---

function DashboardView({ contacts, appointments, profile, showToast }) {
  const [insight, setInsight] = useState(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const generateInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const contactTitles = contacts.map(c => c.title).join(', ');
      const prompt = `I am ${profile.firstName}, ${profile.title} at ${profile.company}. In my network, I recently connected with people holding these titles: ${contactTitles || 'none yet'}. I have ${appointments.length} upcoming meetings. As an AI Networking Strategist, give me ONE short, insightful piece of advice on how to leverage this specific network or prepare for my meetings. Maximum 3 sentences. Keep it highly professional but encouraging.`;
      const result = await callGemini(prompt);
      setInsight(result.trim());
      showToast('Networking strategy generated! ✨');
    } catch (e) {
      showToast('Failed to generate insight.', 'error');
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Strategist */}
      <Card className="p-6 bg-gradient-to-r from-brand-500/10 to-transparent border-brand-500/20">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold text-lg">
            <Sparkles className="w-5 h-5" /> AI Network Strategist
          </div>
          <Button size="sm" onClick={generateInsight} disabled={isGeneratingInsight} className="bg-white dark:bg-slate-800 text-brand-600 border border-brand-200 dark:border-brand-500/30 hover:bg-brand-50 dark:hover:bg-brand-500/10">
            {isGeneratingInsight ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            {insight ? 'Refresh Strategy' : 'Analyze My Network'}
          </Button>
        </div>
        {isGeneratingInsight ? (
          <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-brand-500" /> Analyzing your contacts and calendar...
          </p>
        ) : insight ? (
          <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">"{insight}"</p>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Click the button to get personalized networking advice based on your recent connections and upcoming calendar.</p>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Profile Views', value: '1,248', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Contacts Collected', value: contacts.length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Upcoming Meetings', value: appointments.length, icon: Calendar, color: 'text-brand-500', bg: 'bg-brand-500/10' },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Chart Mockup */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Views Over Time (Last 7 Days)</h3>
        <div className="h-64 flex items-end justify-between gap-2 px-2">
          {[40, 70, 45, 90, 65, 120, 85].map((height, i) => (
            <div key={i} className="w-full flex flex-col items-center group cursor-pointer">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative flex items-end justify-center pb-2 h-full">
                 <div 
                   className="w-full mx-1 md:mx-4 bg-brand-500 rounded-t-md transition-all duration-300 group-hover:opacity-80 relative"
                   style={{ height: `${height}%` }}
                 >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                     {height * 12}
                   </div>
                 </div>
              </div>
              <span className="text-xs text-slate-500 mt-2 font-medium">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CardEditorView({ profile, setProfile, setQrModalOpen, setCurrentView, showToast }) {
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Editor Form */}
      <Card className="p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Information</h2>
          <Button size="sm" variant="outline" onClick={() => setQrModalOpen(true)}>
            <QrCode className="w-4 h-4 mr-2" /> Generate QR
          </Button>
        </div>

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} icon={UserSquare} />
            <Input label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Job Title" name="title" value={profile.title} onChange={handleChange} icon={Briefcase} />
            <Input label="Department" name="department" value={profile.department} onChange={handleChange} />
          </div>
          <Input label="Company Name" name="company" value={profile.company} onChange={handleChange} icon={Building} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email Address" type="email" name="email" value={profile.email} onChange={handleChange} icon={Mail} />
            <Input label="Phone Number" type="tel" name="phone" value={profile.phone} onChange={handleChange} icon={Phone} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Headline / Bio</label>
              <button 
                type="button" 
                onClick={async () => {
                  setIsGeneratingBio(true);
                  try {
                    const prompt = `Write a short, professional, and catchy headline/bio (max 2 sentences) for a digital business card. The person's name is ${profile.firstName} ${profile.lastName}, their job title is ${profile.title} in the ${profile.department} department at ${profile.company}. Make it punchy and modern. Do not use quotes around the output.`;
                    const generated = await callGemini(prompt);
                    setProfile(prev => ({ ...prev, headline: generated.trim() }));
                    showToast('Magic bio generated! ✨');
                  } catch (e) {
                    showToast('Failed to generate bio. Try again later.', 'error');
                  } finally {
                    setIsGeneratingBio(false);
                  }
                }} 
                disabled={isGeneratingBio}
                className="text-xs flex items-center text-brand-500 hover:text-brand-600 font-bold transition-colors disabled:opacity-50"
              >
                {isGeneratingBio ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                ✨ Auto-write with AI
              </button>
            </div>
            <textarea 
              name="headline" 
              rows="3" 
              value={profile.headline} 
              onChange={handleChange}
              className="block w-full rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-4 border transition-colors resize-none"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Elevator Pitch Script (For in-person networking)</label>
              <button 
                type="button" 
                onClick={async () => {
                  setIsGeneratingPitch(true);
                  try {
                    const prompt = `Write a confident, friendly 30-second elevator pitch (spoken script) for me to use at networking events. My name is ${profile.firstName} ${profile.lastName}, my job title is ${profile.title} at ${profile.company}. My bio is: "${profile.headline}". Make it sound natural and conversational.`;
                    const generated = await callGemini(prompt);
                    setProfile(prev => ({ ...prev, elevatorPitch: generated.trim() }));
                    showToast('Elevator pitch generated! ✨');
                  } catch (e) {
                    showToast('Failed to generate pitch. Try again later.', 'error');
                  } finally {
                    setIsGeneratingPitch(false);
                  }
                }} 
                disabled={isGeneratingPitch}
                className="text-xs flex items-center text-brand-500 hover:text-brand-600 font-bold transition-colors disabled:opacity-50"
              >
                {isGeneratingPitch ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                ✨ Draft Pitch
              </button>
            </div>
            <textarea 
              name="elevatorPitch" 
              rows="4" 
              value={profile.elevatorPitch || ''} 
              onChange={handleChange}
              placeholder="Hi, I'm... I help with..."
              className="block w-full rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-4 border transition-colors resize-none italic text-slate-600 dark:text-slate-400"
            />
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Images</h3>
            <Input label="Profile Picture URL" name="profilePic" value={profile.profilePic} onChange={handleChange} icon={LinkIcon} />
            <Input label="Background Image URL" name="bgPic" value={profile.bgPic} onChange={handleChange} icon={LinkIcon} />
          </div>
        </form>
      </Card>

      {/* Live Preview */}
      <div className="hidden xl:flex flex-col items-center">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Live Preview</h3>
        <div className="relative w-full max-w-sm rounded-[2.5rem] border-8 border-slate-800 bg-slate-900 overflow-hidden shadow-2xl h-[700px] transform scale-95 origin-top">
          {/* Phone Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl mx-auto w-1/2 z-20"></div>
          
          {/* Mini Public View for Preview */}
          <div className="h-full overflow-y-auto no-scrollbar pb-20 relative bg-slate-50 dark:bg-slate-950 pointer-events-none">
            <div className="h-48 w-full relative">
              <img src={profile.bgPic} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
            </div>
            
            <div className="px-6 relative -mt-16 text-center">
              <img src={profile.profilePic} alt="Profile" className="w-32 h-32 rounded-full border-4 border-slate-50 dark:border-slate-950 mx-auto object-cover shadow-lg" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">{profile.firstName} {profile.lastName}</h2>
              <p className="text-brand-500 font-medium">{profile.title}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{profile.department} @ {profile.company}</p>
              <p className="text-slate-700 dark:text-slate-300 mt-4 text-sm px-4 leading-relaxed">{profile.headline}</p>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1 py-3 text-sm rounded-full"><Download className="w-4 h-4 mr-2"/> Save</Button>
                <Button variant="outline" className="flex-1 py-3 text-sm rounded-full"><Share2 className="w-4 h-4 mr-2"/> Share</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactsView({ contacts, profile, showToast }) {
  const [generatingEmailFor, setGeneratingEmailFor] = useState(null);
  const [generatedEmails, setGeneratedEmails] = useState({});
  const [contactTags, setContactTags] = useState({});
  const [taggingId, setTaggingId] = useState(null);

  const handleGenerateTags = async (contact) => {
    setTaggingId(contact.id);
    try {
      const prompt = `Given the contact ${contact.firstName} ${contact.lastName}, Title: ${contact.title}, Company: ${contact.company}, suggest 2 short, relevant professional tags for networking categorization (e.g., "Decision Maker", "Tech Lead", "Potential Partner"). Return ONLY a comma-separated list of the 2 tags, nothing else.`;
      const tags = await callGemini(prompt);
      setContactTags(prev => ({ ...prev, [contact.id]: tags.split(',').map(t => t.trim()) }));
      showToast('Smart tags added! ✨');
    } catch (error) {
      showToast('Failed to generate tags.', 'error');
    } finally {
      setTaggingId(null);
    }
  };

  const handleGenerateEmail = async (contact) => {
    setGeneratingEmailFor(contact.id);
    try {
      const prompt = `Write a short, friendly, and professional follow up email from ${profile.firstName} ${profile.lastName} (${profile.title} at ${profile.company}) to ${contact.firstName} ${contact.lastName} (${contact.title} at ${contact.company}). Thank them for connecting and sharing their digital business card, and suggest a quick 15-minute chat to learn about each other's work. Provide ONLY the email body (no subject line) and keep it under 4 sentences.`;
      const email = await callGemini(prompt);
      setGeneratedEmails(prev => ({ ...prev, [contact.id]: email.trim() }));
      showToast('Draft generated successfully! ✨');
    } catch (error) {
      showToast('Failed to generate draft.', 'error');
    } finally {
      setGeneratingEmailFor(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Network ({contacts.length})</h2>
        <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Company & Title</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Date Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <React.Fragment key={contact.id}>
                <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <span className="block font-medium">{contact.company}</span>
                    <span className="text-xs text-slate-500">{contact.title}</span>
                    
                    {/* ✨ Smart Tags Feature */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {contactTags[contact.id] ? (
                        contactTags[contact.id].map((tag, i) => (
                          <span key={i} className="text-[10px] uppercase font-bold bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full border border-brand-500/20">{tag}</span>
                        ))
                      ) : (
                        <button onClick={() => handleGenerateTags(contact)} disabled={taggingId === contact.id} className="text-[10px] uppercase font-bold text-slate-400 hover:text-brand-500 flex items-center transition-colors disabled:opacity-50">
                          {taggingId === contact.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />} Auto-Tag
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <span className="block">{contact.email}</span>
                    <span className="text-xs text-slate-500">{contact.phone}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{contact.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => handleGenerateEmail(contact)} disabled={generatingEmailFor === contact.id}>
                      {generatingEmailFor === contact.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-brand-500" />}
                      Follow-up
                    </Button>
                  </td>
                </tr>
                {(generatedEmails[contact.id] || generatingEmailFor === contact.id) && (
                  <tr className="bg-brand-50/50 dark:bg-brand-500/5 border-b border-slate-100 dark:border-slate-800">
                    <td colSpan="5" className="px-6 py-4">
                      {generatingEmailFor === contact.id ? (
                          <div className="flex items-center text-sm text-brand-600 dark:text-brand-400 font-medium">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> ✨ AI is drafting a personalized follow-up...
                          </div>
                      ) : (
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3"/> AI Drafted Email
                            </label>
                            <textarea 
                              className="w-full text-sm p-4 rounded-xl border border-brand-200 dark:border-brand-500/30 bg-white dark:bg-slate-900 dark:text-white shadow-sm focus:ring-brand-500 focus:border-brand-500 resize-none" 
                              rows={4} 
                              value={generatedEmails[contact.id]} 
                              onChange={(e) => setGeneratedEmails({...generatedEmails, [contact.id]: e.target.value})}
                            />
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => {
                                  const newEmails = {...generatedEmails};
                                  delete newEmails[contact.id];
                                  setGeneratedEmails(newEmails);
                              }}>Dismiss</Button>
                              <Button size="sm" onClick={() => {
                                  navigator.clipboard.writeText(generatedEmails[contact.id]);
                                  showToast("Draft copied to clipboard!");
                              }}><Copy className="w-4 h-4 mr-2"/> Copy Text</Button>
                            </div>
                          </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  No contacts collected yet. Share your QR code to start networking!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CalendarView({ appointments, showToast, profile }) {
  const [prepData, setPrepData] = useState({});
  const [isPrepping, setIsPrepping] = useState(null);

  const handleAIPrep = async (apt) => {
    setIsPrepping(apt.id);
    try {
      const prompt = `I am ${profile.firstName} ${profile.lastName}, ${profile.title} at ${profile.company}. I have a ${apt.service} meeting with ${apt.clientName}. Create a short, professional 3-point meeting agenda and 2 smart discovery questions to ask them. Format it clearly.`;
      const result = await callGemini(prompt);
      setPrepData(prev => ({ ...prev, [apt.id]: result.trim() }));
      showToast('Meeting prep generated! ✨');
    } catch (error) {
      showToast('Failed to generate prep.', 'error');
    } finally {
      setIsPrepping(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Appointments List */}
      <Card className="lg:col-span-2 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Appointments</h2>
          <Button size="sm" variant="outline"><CalendarPlus className="w-4 h-4 mr-2" /> Add Manual</Button>
        </div>
        
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 text-center min-w-[70px] shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-brand-500 font-bold uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white leading-none mt-1">{new Date(apt.date).getDate()}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{apt.clientName}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" /> {apt.time} • {apt.service}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAIPrep(apt)} disabled={isPrepping === apt.id} className="hidden sm:inline-flex border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-500/30 dark:text-brand-400 dark:hover:bg-brand-500/10">
                    {isPrepping === apt.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    AI Prep
                  </Button>
                  <Button size="sm" variant="ghost" className="hidden md:inline-flex">Reschedule</Button>
                </div>
              </div>
              
              {/* AI Prep Result Box */}
              {(prepData[apt.id] || isPrepping === apt.id) && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {isPrepping === apt.id ? (
                    <div className="flex items-center text-sm text-brand-600 dark:text-brand-400 font-medium">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> ✨ AI is analyzing context and generating your meeting prep...
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-brand-100 dark:border-brand-500/20 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <label className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3"/> AI Meeting Prep
                        </label>
                        <Button size="sm" variant="ghost" onClick={() => {
                            const newPrep = {...prepData};
                            delete newPrep[apt.id];
                            setPrepData(newPrep);
                        }} className="h-6 px-2 text-xs">Dismiss</Button>
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {prepData[apt.id]}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-8 text-slate-500">No upcoming appointments.</div>
          )}
        </div>
      </Card>

      {/* Settings & Sync */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4">Availability Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">Working Days</span>
              <span className="text-slate-500">Mon - Fri</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">Hours</span>
              <span className="text-slate-500">09:00 AM - 05:00 PM</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">Meeting Duration</span>
              <span className="text-slate-500">30 mins</span>
            </div>
            <Button variant="outline" className="w-full mt-4">Edit Availability</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4">Calendar Sync</h3>
          <p className="text-sm text-slate-500 mb-6">Connect your existing calendars to prevent double-booking.</p>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start" onClick={() => showToast('Google Calendar synced successfully!')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5 mr-3" />
              Sync Google Calendar
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={() => showToast('iCalendar synced successfully!')}>
              <Calendar className="w-5 h-5 mr-3 text-blue-500" />
              Sync iCalendar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingsView({ themeMode, setThemeMode, brandColor, setBrandColor }) {
  const colors = [
    { id: 'violet', name: 'Cyber Purple', class: 'bg-violet-600' },
    { id: 'blue', name: 'Corporate Blue', class: 'bg-blue-600' },
    { id: 'emerald', name: 'Eco Green', class: 'bg-emerald-600' },
    { id: 'rose', name: 'Creative Rose', class: 'bg-rose-600' },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Appearance</h2>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme Mode</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setThemeMode('light')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${themeMode === 'light' ? 'border-brand-500 bg-brand-500/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
            >
              <Sun className={`w-8 h-8 ${themeMode === 'light' ? 'text-brand-500' : 'text-slate-400'}`} />
              <span className="font-medium text-slate-900 dark:text-white">Light</span>
            </button>
            <button 
              onClick={() => setThemeMode('dark')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${themeMode === 'dark' ? 'border-brand-500 bg-brand-500/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
            >
              <Moon className={`w-8 h-8 ${themeMode === 'dark' ? 'text-brand-500' : 'text-slate-400'}`} />
              <span className="font-medium text-slate-900 dark:text-white">Dark</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Brand Accent Color</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => setBrandColor(color.id)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${brandColor === color.id ? 'border-brand-500 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
              >
                <div className={`w-8 h-8 rounded-full ${color.class} shadow-sm ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${brandColor === color.id ? 'ring-brand-500' : 'ring-transparent'}`}></div>
                <span className="font-medium text-sm text-slate-900 dark:text-white">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
         <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Account Status</h2>
         <p className="text-slate-500 mb-6">Manage your subscription and data.</p>
         <div className="flex gap-4">
            <Button variant="outline">Upgrade to Pro</Button>
            <Button variant="danger">Delete Account</Button>
         </div>
      </Card>
    </div>
  );
}

// --- PUBLIC CARD VIEW (What the customer sees) ---

function PublicCardView({ profile, brandColors, onAddContact, onBookAppointment, onExit, showToast }) {
  const [activeTab, setActiveTab] = useState('about'); // about, connect, book
  
  // States for forms
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', title: '' });
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', date: '', time: '' });
  const [submitted, setSubmitted] = useState({ contact: false, booking: false });
  
  // AI Magic Fill state
  const [magicText, setMagicText] = useState('');
  const [isMagicFilling, setIsMagicFilling] = useState(false);

  // AI Synergy Finder state
  const [visitorTitle, setVisitorTitle] = useState('');
  const [synergyMatch, setSynergyMatch] = useState('');
  const [isFindingSynergy, setIsFindingSynergy] = useState(false);

  const handleFindSynergy = async () => {
    if (!visitorTitle.trim()) return;
    setIsFindingSynergy(true);
    try {
      const prompt = `I am a ${visitorTitle}. Why should I connect with ${profile.firstName} ${profile.lastName}, who is a ${profile.title} at ${profile.company} focusing on "${profile.headline}"? Give a short 2-sentence pitch on our potential professional synergy.`;
      const result = await callGemini(prompt);
      setSynergyMatch(result.trim());
    } catch (error) {
      if (showToast) showToast('Could not find synergy right now.', 'error');
    } finally {
      setIsFindingSynergy(false);
    }
  };

  const handleMagicFill = async () => {
    if (!magicText.trim()) return;
    setIsMagicFilling(true);
    try {
      const prompt = `Extract contact info from the following text and return it as a pure JSON object. Use exactly these keys: firstName, lastName, email, phone, company, title. If a piece of info is missing, leave the value as an empty string "". Do not include markdown formatting or backticks. Text: "${magicText}"`;
      const result = await callGemini(prompt);
      const cleanResult = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanResult);
      
      setContactForm(prev => ({ ...prev, ...parsed }));
      setMagicText('');
      if (showToast) showToast('✨ Form magically filled!');
    } catch (error) {
      if (showToast) showToast('Could not extract info. Please fill manually.', 'error');
    } finally {
      setIsMagicFilling(false);
    }
  };

  // Handle vCard generation
  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${profile.lastName};${profile.firstName};;;
FN:${profile.firstName} ${profile.lastName}
ORG:${profile.company}
TITLE:${profile.title}
TEL;TYPE=WORK,VOICE:${profile.phone}
EMAIL:${profile.email}
END:VCARD`;
    
    // Create download link
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.firstName}_${profile.lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    onAddContact({ ...contactForm, id: Date.now(), date: new Date().toISOString().split('T')[0] });
    setSubmitted(prev => ({ ...prev, contact: true }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    onBookAppointment({ 
      id: Date.now(), 
      clientName: bookingForm.name, 
      service: 'Discovery Call', 
      date: bookingForm.date, 
      time: bookingForm.time, 
      status: 'upcoming' 
    });
    setSubmitted(prev => ({ ...prev, booking: true }));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black font-sans pb-12 relative animate-in zoom-in-95 duration-500">
      {/* Return button for preview mode */}
      <button 
        onClick={onExit}
        className="fixed top-4 left-4 z-50 bg-black/50 hover:bg-black/80 text-white backdrop-blur-md p-2 rounded-full shadow-lg transition-all flex items-center gap-2 pr-4 text-sm font-medium"
      >
        <ChevronLeft className="w-5 h-5" /> Exit Preview
      </button>

      <div className="max-w-md mx-auto bg-white dark:bg-slate-950 min-h-screen shadow-2xl relative overflow-hidden">
        
        {/* Cover Photo */}
        <div className="h-64 w-full relative">
          <img src={profile.bgPic} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950"></div>
        </div>

        {/* Profile Info */}
        <div className="px-8 relative -mt-24 text-center">
          <div className="relative inline-block">
            <img src={profile.profilePic} alt="Profile" className="w-40 h-40 rounded-full border-8 border-white dark:border-slate-950 object-cover shadow-xl bg-white" />
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-950 rounded-full"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 tracking-tight">{profile.firstName} {profile.lastName}</h1>
          <p className="text-brand-500 font-semibold text-lg mt-1">{profile.title}</p>
          <p className="text-slate-600 dark:text-slate-400 font-medium">{profile.department} at {profile.company}</p>
          
          <div className="flex gap-3 mt-8">
            <Button className="flex-1 py-4 text-base rounded-2xl shadow-lg shadow-brand-500/20" onClick={handleSaveContact}>
              <Download className="w-5 h-5 mr-2"/> Save Contact
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mt-10 px-4">
          {[
            { id: 'about', label: 'About' },
            { id: 'connect', label: 'Exchange Info' },
            { id: 'book', label: 'Book' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab.id ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 pb-20">
          
          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Bio</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{profile.headline}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Contact Details</h3>
                <a href={`mailto:${profile.email}`} className="flex items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-brand-500 shadow-sm border border-slate-100 dark:border-slate-700 mr-4 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-slate-900 dark:text-white font-medium">{profile.email}</p>
                  </div>
                </a>

                <a href={`tel:${profile.phone}`} className="flex items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-brand-500 shadow-sm border border-slate-100 dark:border-slate-700 mr-4 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-slate-900 dark:text-white font-medium">{profile.phone}</p>
                  </div>
                </a>
              </div>

              {/* ✨ AI Synergy Finder Widget */}
              <div className="mt-8 p-5 bg-brand-50 dark:bg-brand-500/5 rounded-2xl border border-brand-100 dark:border-brand-500/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Sparkles className="w-24 h-24 text-brand-500" />
                </div>
                <h3 className="text-sm font-bold text-brand-700 dark:text-brand-400 flex items-center mb-2 relative z-10">
                  <Sparkles className="w-4 h-4 mr-2" /> AI Synergy Finder
                </h3>
                <p className="text-xs text-brand-600/80 dark:text-brand-400/80 mb-4 relative z-10">Wondering how we can collaborate? Enter your job title and AI will find our common ground.</p>
                
                {!synergyMatch ? (
                    <div className="flex gap-2 relative z-10">
                      <input 
                        type="text"
                        className="flex-1 text-sm p-3 rounded-xl border border-brand-200 dark:border-brand-500/30 bg-white dark:bg-slate-900 dark:text-white shadow-sm focus:ring-brand-500 focus:border-brand-500"
                        placeholder="e.g. Product Manager"
                        value={visitorTitle}
                        onChange={(e) => setVisitorTitle(e.target.value)}
                      />
                      <Button size="md" onClick={handleFindSynergy} disabled={isFindingSynergy || !visitorTitle.trim()} className="shrink-0 h-auto rounded-xl">
                        {isFindingSynergy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find Match'}
                      </Button>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-brand-500/20">
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">"{synergyMatch}"</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => { setSynergyMatch(''); setVisitorTitle(''); }} className="w-full text-xs">Try another title</Button>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* CONNECT TAB (Reverse Contact) */}
          {activeTab === 'connect' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              {submitted.contact ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Info Shared!</h3>
                  <p className="text-slate-500">Your details have been sent to {profile.firstName}'s contact list.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Share your info</h3>
                    <p className="text-slate-500 mt-2">Send your contact details directly to my network so we can stay in touch.</p>
                  </div>
                  
                  {/* AI Magic Fill Section */}
                  <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-500/10 rounded-2xl border border-brand-100 dark:border-brand-500/20">
                    <label className="text-sm font-bold text-brand-700 dark:text-brand-400 flex items-center mb-2">
                      <Wand2 className="w-4 h-4 mr-2" /> ✨ Magic Auto-Fill
                    </label>
                    <p className="text-xs text-brand-600/80 dark:text-brand-400/80 mb-3">Paste your email signature or LinkedIn bio to automatically fill the form.</p>
                    <div className="flex gap-2">
                      <textarea 
                        className="flex-1 text-sm p-2 rounded-xl border border-brand-200 dark:border-brand-500/30 bg-white dark:bg-slate-900 dark:text-white shadow-sm focus:ring-brand-500 focus:border-brand-500 resize-none"
                        rows="2"
                        placeholder="Paste text here..."
                        value={magicText}
                        onChange={(e) => setMagicText(e.target.value)}
                      />
                      <Button size="sm" onClick={handleMagicFill} disabled={isMagicFilling || !magicText.trim()} className="shrink-0 h-auto">
                        {isMagicFilling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Auto-Fill'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    <span className="text-xs text-slate-400 font-medium uppercase">Or fill manually</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name" required value={contactForm.firstName} onChange={e => setContactForm({...contactForm, firstName: e.target.value})} />
                      <Input placeholder="Last Name" required value={contactForm.lastName} onChange={e => setContactForm({...contactForm, lastName: e.target.value})} />
                    </div>
                    <Input placeholder="Email Address" type="email" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                    <Input placeholder="Phone Number" type="tel" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                    <Input placeholder="Company" value={contactForm.company} onChange={e => setContactForm({...contactForm, company: e.target.value})} />
                    <Input placeholder="Job Title" value={contactForm.title} onChange={e => setContactForm({...contactForm, title: e.target.value})} />
                    
                    <Button type="submit" className="w-full py-4 mt-4 text-base rounded-xl">Share Contact Details</Button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* BOOKING TAB */}
          {activeTab === 'book' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              {submitted.booking ? (
                 <div className="text-center py-12">
                 <div className="w-20 h-20 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Calendar className="w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Meeting Requested!</h3>
                 <p className="text-slate-500">Your appointment request has been sent to {profile.firstName}. You'll receive a calendar invite shortly.</p>
               </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Schedule a Meeting</h3>
                    <p className="text-slate-500 mt-2">Select a time that works for you to chat.</p>
                  </div>
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Information</label>
                       <div className="space-y-4">
                         <Input placeholder="Full Name" required value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} />
                         <Input placeholder="Email Address" type="email" required value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})} />
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                       <Input type="date" required value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Available Times</label>
                       <div className="grid grid-cols-2 gap-3">
                         {['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'].map(time => (
                           <button 
                             key={time} type="button"
                             onClick={() => setBookingForm({...bookingForm, time})}
                             className={`p-3 rounded-xl border text-sm font-medium transition-all ${bookingForm.time === time ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500/50'}`}
                           >
                             {time}
                           </button>
                         ))}
                       </div>
                    </div>

                    <Button type="submit" disabled={!bookingForm.time} className="w-full py-4 text-base rounded-xl mt-4">
                      Confirm Booking
                    </Button>
                  </form>
                </>
              )}
            </div>
          )}

        </div>
        
        {/* Footer Branding */}
        <div className="absolute bottom-6 w-full text-center">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Powered by CybrBook</p>
        </div>
      </div>
    </div>
  );
}