import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import { Send, Mail, CheckCircle, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton';

const Contact: React.FC = () => {
  const { content, isLoading } = useContent();
  const { contact, socials } = content;
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    videoType: 'Short Form Videos',
    budget: '$500 - $1,000',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formState,
          _subject: `New Project Inquiry from ${formState.name}`,
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormState({ 
            name: '', 
            email: '', 
            videoType: 'Short Form Videos', 
            budget: '$500 - $1,000', 
            message: '' 
        });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: socials.instagram },
    { icon: Facebook, label: "Facebook", href: socials.facebook },
    { icon: Twitter, label: "Twitter", href: socials.twitter },
    { icon: Linkedin, label: "LinkedIn", href: socials.linkedin },
  ];

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          <div>
            <Reveal>
              <h2 className="text-sm text-accent uppercase tracking-[0.2em] mb-4">Get In Touch</h2>
              <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                 {isLoading ? <Skeleton /> : contact.heading}
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-neutral-400 text-lg mb-10 max-w-md">
                {isLoading ? <Skeleton count={2} /> : contact.subheading}
              </p>
            </Reveal>
            
            <Reveal delay={0.3}>
              <a 
                href={isLoading ? '#' : `mailto:${contact.email}`} 
                className="flex items-center gap-4 text-white hover:text-accent transition-colors mb-4 group w-fit"
              >
                <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center group-hover:border-accent transition-colors">
                    <Mail size={20} />
                </div>
                <span className="text-lg">{isLoading ? <Skeleton width={200} /> : contact.email}</span>
              </a>
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
                    placeholder="Alex Rafael"
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
                    placeholder="hi@xyz.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="videoType" className="text-xs uppercase tracking-wider text-neutral-500">Video Type</label>
                  <div className="relative">
                    <select
                      id="videoType"
                      name="videoType"
                      value={formState.videoType}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-accent transition-colors"
                    >
                      <option>Short Form Videos</option>
                      <option>Youtube Videos / VSL's</option>
                      <option>Motion Graphics / Explainer Ads</option>
                      <option>Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="budget" className="text-xs uppercase tracking-wider text-neutral-500">Budget Range</label>
                  <div className="relative">
                    <select
                      id="budget"
                      name="budget"
                      value={formState.budget}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-accent transition-colors"
                    >
                      <option>$500 - $1,000</option>
                      <option>$1,000 - $3,000</option>
                      <option>$3,000 - $5,000</option>
                      <option>$5,000+</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-wider text-neutral-500">Message / Vision</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell me about your project goals..."
                ></textarea>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={clsx(
                  "w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
                {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>

        {/* Prominent Social Buttons */}
        <Reveal width="100%" delay={0.4}>
          <div className="flex flex-col items-center border-t border-white/10 pt-16">
            <h4 className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-8">Follow My Work</h4>
            <div className="flex flex-wrap justify-center gap-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "group flex items-center justify-center w-16 h-16 rounded-full border border-white/10 bg-surface",
                    "hover:bg-accent hover:border-accent transition-all duration-300 relative cursor-hover-trigger"
                  )}
                  aria-label={social.label}
                >
                  <social.icon 
                    size={28} 
                    className="text-neutral-400 group-hover:text-white group-hover:scale-110 transition-transform duration-300" 
                    strokeWidth={1.5}
                  />
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;