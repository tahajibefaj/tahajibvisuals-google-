import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { content, isLoading } = useContent();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-surface relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-3xl">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">All Your Questions Answered</h2>
          </div>
        </Reveal>

        <div className="space-y-4">
          {isLoading 
            ? Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="border border-white/10 rounded-xl p-6">
                 <Skeleton height={24} width="80%" />
               </div>
            )) 
            : content.faq.map((faq, index) => (
            <Reveal key={index} width="100%" delay={index * 0.1}>
              <div 
                className={clsx(
                  "border border-white/10 rounded-xl overflow-hidden transition-colors duration-300",
                  openIndex === index ? 'bg-white/5 border-white/20' : 'bg-transparent hover:border-white/20'
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer group focus:outline-none"
                >
                  <span className={clsx(
                    "font-semibold text-lg md:text-xl transition-colors pr-8",
                    openIndex === index ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                  )}>
                    {faq.question}
                  </span>
                  <div className={clsx(
                    "flex-shrink-0 p-2 rounded-full border border-white/10 transition-colors duration-300",
                    openIndex === index ? 'bg-accent border-accent text-white' : 'text-neutral-400 group-hover:text-white'
                  )}>
                    {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-neutral-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;