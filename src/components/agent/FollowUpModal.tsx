'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconBrandWhatsapp, IconSparkles, IconPencil } from '@tabler/icons-react';
import type { CustomerProfile } from '@/types/agent';

interface FollowUpModalProps {
  customer: CustomerProfile;
  agentName: string;
  onClose: () => void;
}

function buildDraftMessage(customer: CustomerProfile, agentName: string): string {
  const firstName = customer.fullName.split(' ')[0];

  if (customer.status === 'renewal-due') {
    return `Hi ${firstName}! 👋 This is ${agentName} from SecureLife Insurance.

I wanted to reach out about your *${customer.policyType}* policy (${customer.policyNumber}), which is coming up for renewal soon.

Renewing on time ensures your coverage stays uninterrupted. I'd love to walk you through your options and make sure you're still getting the best protection for your needs.

Would you be available for a quick 10-minute call this week? 😊`;
  }

  if (customer.status === 'lapsed') {
    return `Hi ${firstName}! 👋 This is ${agentName} from SecureLife Insurance.

I noticed your *${customer.policyType}* policy (${customer.policyNumber}) has lapsed. I completely understand life gets busy, and I'd love to help you get your coverage reinstated.

A lapse doesn't have to be permanent — there may be options available to you. Can we find a time to chat this week?`;
  }

  return `Hi ${firstName}! 👋 This is ${agentName} from SecureLife Insurance.

Just a quick check-in on your *${customer.policyType}* coverage. I hope everything has been smooth on your end!

If you have any questions about your policy or if there's anything I can help with, don't hesitate to reach out. I'm always happy to help. 😊

Take care!`;
}

function toWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/[\s\-\+()]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function FollowUpModal({ customer, agentName, onClose }: FollowUpModalProps) {
  const [draft, setDraft] = useState(() => buildDraftMessage(customer, agentName));
  const charCount = draft.length;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Bottom sheet */}
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-start justify-between border-b border-slate-100 dark:border-slate-700/60 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <IconSparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Follow-up Draft</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 ml-9">
              To: <span className="font-medium text-slate-700 dark:text-slate-300">{customer.fullName}</span> · {customer.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <IconPencil size={12} />
            <span>Review and edit before sending</span>
          </div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={10}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent leading-relaxed"
          />
          <p className="text-right text-xs text-slate-400">{charCount} characters</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700/60 shrink-0 space-y-2">
          <a
            href={toWhatsAppLink(customer.phone, draft)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:bg-[#18a84f] text-white font-semibold text-sm transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
          >
            <IconBrandWhatsapp size={20} />
            Open in WhatsApp
          </a>
          <p className="text-center text-xs text-slate-400">
            You will preview and send the message manually in WhatsApp
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
