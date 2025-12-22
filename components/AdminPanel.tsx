import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { X, Save, RotateCcw, Lock } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { content, updateContent, resetContent } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'services' | 'faq'>('general');
  const [tempContent, setTempContent] = useState(content);
  const [isOpen, setIsOpen] = useState(true);

  // Sync temp state if external content changes (e.g. reset)
  React.useEffect(() => {
    setTempContent(content);
  }, [content]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration as requested
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const handleSave = () => {
    updateContent(tempContent);
    alert('Changes saved successfully!');
  };

  const handleChange = (section: keyof typeof content, field: string, value: any, nestedIndex?: number, nestedField?: string) => {
    setTempContent(prev => {
      const updated = { ...prev };
      
      if (nestedIndex !== undefined && nestedField) {
        // Handle array updates (FAQ, Services)
        const array = [...(updated[section] as any[])];
        array[nestedIndex] = { ...array[nestedIndex], [nestedField]: value };
        (updated[section] as any) = array;
      } else if (typeof updated[section] === 'object' && updated[section] !== null) {
        // Handle nested object updates (Hero, About, etc)
        (updated[section] as any) = { ...(updated[section] as any), [field]: value };
      }
      
      return updated;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
        <div className="bg-surface border border-white/10 p-8 rounded-xl w-full max-w-md text-center">
          <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none"
            />
            <button type="submit" className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-white transition-colors">
              Login
            </button>
            <a href="/" className="block text-neutral-500 text-sm hover:text-white mt-4">Return to Site</a>
          </form>
        </div>
      </div>
    );
  }

  if (!isOpen) {
     return (
        <button 
           onClick={() => setIsOpen(true)}
           className="fixed bottom-4 right-4 z-[9999] bg-accent text-black px-4 py-2 rounded-full font-bold shadow-lg"
        >
           Edit Site
        </button>
     )
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-surface border-r border-white/10 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white mb-4">Content Editor</h2>
        <button 
          onClick={() => setActiveTab('general')}
          className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'general' ? 'bg-accent text-black font-bold' : 'text-neutral-400 hover:bg-white/5'}`}
        >
          General & Links
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'about' ? 'bg-accent text-black font-bold' : 'text-neutral-400 hover:bg-white/5'}`}
        >
          About & Hero
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-accent text-black font-bold' : 'text-neutral-400 hover:bg-white/5'}`}
        >
          Services
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'faq' ? 'bg-accent text-black font-bold' : 'text-neutral-400 hover:bg-white/5'}`}
        >
          FAQ
        </button>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
            <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-500">
                <Save size={18} /> Save Changes
            </button>
             <button onClick={resetContent} className="w-full flex items-center justify-center gap-2 bg-red-900/50 text-red-200 py-3 rounded-lg hover:bg-red-900">
                <RotateCcw size={18} /> Reset All
            </button>
            <a href="/" className="block text-center text-neutral-500 text-sm hover:text-white">Exit Editor</a>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl text-white font-bold capitalize">{activeTab} Settings</h3>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-white"><X /></button>
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="bg-surface p-6 rounded-xl border border-white/10">
                        <h4 className="text-accent mb-4 uppercase tracking-wider text-sm font-bold">Contact Info</h4>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-neutral-400 text-sm mb-2">Contact Email</label>
                                <input type="text" value={tempContent.contact.email} onChange={(e) => handleChange('contact', 'email', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                        </div>
                    </div>
                     <div className="bg-surface p-6 rounded-xl border border-white/10">
                        <h4 className="text-accent mb-4 uppercase tracking-wider text-sm font-bold">Social Links</h4>
                        <div className="grid gap-4">
                            {Object.keys(tempContent.socials).map((key) => (
                                <div key={key}>
                                    <label className="block text-neutral-400 text-sm mb-2 capitalize">{key}</label>
                                    <input type="text" value={(tempContent.socials as any)[key]} onChange={(e) => handleChange('socials', key, e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-surface p-6 rounded-xl border border-white/10">
                        <h4 className="text-accent mb-4 uppercase tracking-wider text-sm font-bold">Navbar</h4>
                        <div className="grid gap-4">
                             <div>
                                <label className="block text-neutral-400 text-sm mb-2">CTA Button Text</label>
                                <input type="text" value={tempContent.navbar.ctaText} onChange={(e) => handleChange('navbar', 'ctaText', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                            <div>
                                <label className="block text-neutral-400 text-sm mb-2">CTA Link</label>
                                <input type="text" value={tempContent.navbar.ctaLink} onChange={(e) => handleChange('navbar', 'ctaLink', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* About & Hero Tab */}
            {activeTab === 'about' && (
                <div className="space-y-6">
                    <div className="bg-surface p-6 rounded-xl border border-white/10">
                        <h4 className="text-accent mb-4 uppercase tracking-wider text-sm font-bold">Hero Section</h4>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Title Line 1</label>
                                    <input type="text" value={tempContent.hero.titleLine1} onChange={(e) => handleChange('hero', 'titleLine1', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Title Line 2</label>
                                    <input type="text" value={tempContent.hero.titleLine2} onChange={(e) => handleChange('hero', 'titleLine2', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-neutral-400 text-sm mb-2">Subtitle</label>
                                <input type="text" value={tempContent.hero.subtitle} onChange={(e) => handleChange('hero', 'subtitle', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                             <div>
                                <label className="block text-neutral-400 text-sm mb-2">Description</label>
                                <textarea rows={3} value={tempContent.hero.description} onChange={(e) => handleChange('hero', 'description', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                             <div>
                                <label className="block text-neutral-400 text-sm mb-2">CTA Text</label>
                                <input type="text" value={tempContent.hero.ctaText} onChange={(e) => handleChange('hero', 'ctaText', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface p-6 rounded-xl border border-white/10">
                        <h4 className="text-accent mb-4 uppercase tracking-wider text-sm font-bold">About Section</h4>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-neutral-400 text-sm mb-2">Main Heading</label>
                                <input type="text" value={tempContent.about.heading} onChange={(e) => handleChange('about', 'heading', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                             <div>
                                <label className="block text-neutral-400 text-sm mb-2">Bio Paragraph 1</label>
                                <textarea rows={4} value={tempContent.about.bio1} onChange={(e) => handleChange('about', 'bio1', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                             <div>
                                <label className="block text-neutral-400 text-sm mb-2">Bio Paragraph 2</label>
                                <textarea rows={4} value={tempContent.about.bio2} onChange={(e) => handleChange('about', 'bio2', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Years Exp</label>
                                    <input type="number" value={tempContent.about.yearsExp} onChange={(e) => handleChange('about', 'yearsExp', parseInt(e.target.value))} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Projects</label>
                                    <input type="number" value={tempContent.about.projectsCompleted} onChange={(e) => handleChange('about', 'projectsCompleted', parseInt(e.target.value))} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

             {/* Services Tab */}
             {activeTab === 'services' && (
                <div className="space-y-6">
                    {tempContent.services.map((service, index) => (
                        <div key={service.id} className="bg-surface p-6 rounded-xl border border-white/10">
                            <h4 className="text-white mb-4 font-bold">Service #{index + 1}</h4>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Title</label>
                                    <input type="text" value={service.title} onChange={(e) => handleChange('services', '', e.target.value, index, 'title')} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Description</label>
                                    <textarea rows={3} value={service.description} onChange={(e) => handleChange('services', '', e.target.value, index, 'description')} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

             {/* FAQ Tab */}
             {activeTab === 'faq' && (
                <div className="space-y-6">
                    {tempContent.faq.map((item, index) => (
                        <div key={index} className="bg-surface p-6 rounded-xl border border-white/10">
                            <h4 className="text-white mb-4 font-bold">Question #{index + 1}</h4>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Question</label>
                                    <input type="text" value={item.question} onChange={(e) => handleChange('faq', '', e.target.value, index, 'question')} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">Answer</label>
                                    <textarea rows={3} value={item.answer} onChange={(e) => handleChange('faq', '', e.target.value, index, 'answer')} className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;