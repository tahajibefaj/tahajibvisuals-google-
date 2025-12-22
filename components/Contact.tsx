import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import { Send, Mail, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    type: 'Video Editing',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log(formState);
    setTimeout(() => {
      setIsSubmitted(true);
      setFormState({ name: '', email: '', type: 'Video Editing', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <Reveal>
              <h2 className="text-sm text-accent uppercase tracking-[0.2em] mb-4">Get In Touch</h2>
              <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Let's create something <br />extraordinary.</h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-neutral-400 text-lg mb-10 max-w-md">
                Ready to elevate your content? Fill out the form, and let's discuss how we can bring your vision to life.
              </p>
            </Reveal>
            
            <Reveal delay={0.3}>
              <div className="flex items-center gap-4 text-white hover:text-accent transition-colors mb-4">
                <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                    <Mail size={20} />
                </div>
                <span className="text-lg">hello@tahajibvisuals.com</span>
              </div>
            </Reveal>
          </div>

          <div className="bg-surface p-8 md:p-10 rounded-2xl border border-white/5 relative">
            {isSubmitted ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-surface rounded-2xl z-20"
               >
                 <CheckCircle size={64} className="text-accent mb-6" />
                 <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                 <p className="text-neutral-400">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                 <button 
                   onClick={() => setIsSubmitted(false)}
                   className="mt-8 text-sm text-accent hover:underline"
                 >
                   Send another message
                 </button>
               </motion.div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-wider text-neutral-500">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-wider text-neutral-500">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="text-xs uppercase tracking-wider text-neutral-500">Project Type</label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formState.type}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-accent transition-colors"
                  >
                    <option>Video Editing</option>
                    <option>Motion Graphics</option>
                    <option>Short-Form Content</option>
                    <option>Brand Video</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-wider text-neutral-500">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell me about your project goals..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 group"
              >
                Send Request 
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;