'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconX,
  IconBrandWhatsapp,
  IconSparkles,
  IconPencil,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';
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

// Strip to digits only: "+60 12-345 6789" → "60123456789"
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Opens WhatsApp App (mobile) or wa.me landing on desktop
function waAppLink(phone: string, text: string): string {
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(text)}`;
}

// Always opens WhatsApp Web in the browser — no landing page
function waWebLink(phone: string, text: string): string {
  return `https://web.whatsapp.com/send?phone=${cleanPhone(phone)}&text=${encodeURIComponent(text)}`;
}

export function FollowUpModal({ customer, agentName, onClose }: FollowUpModalProps) {
  const [draft, setDraft] = useState(() => buildDraftMessage(customer, agentName));
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-game-text/40 z-40"
      />

      {/* Bottom sheet */}
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card-cream rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col border-t-2 border-card-outline/40"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-card-outline/30" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-start justify-between border-b-2 border-card-outline/20 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-game-pink-soft border border-game-pink/30 flex items-center justify-center">
                <IconSparkles size={14} className="text-game-pink" />
              </div>
              <p className="font-handwriting text-lg text-game-text">Follow-up Draft</p>
            </div>
            <p className="text-xs text-game-purple/60 mt-0.5 ml-9">
              To: <span className="font-bold text-game-purple">{customer.fullName}</span>
              <span className="mx-1.5 opacity-40">·</span>
              <span className="font-mono">{customer.phone}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-game-purple/40 hover:text-game-purple hover:bg-pastel-lavender transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-game-purple/50">
              <IconPencil size={12} />
              <span>Review and edit before sending</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold text-game-purple bg-pastel-lavender px-2.5 py-1 rounded-xl border border-card-outline/20 hover:border-card-outline/40 transition-colors"
            >
              {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={10}
            className="w-full rounded-2xl border-2 border-card-outline/40 bg-pastel-yellow text-game-text text-sm px-4 py-3 resize-none focus:outline-none focus:border-card-outline leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs text-game-purple/40">
            <span className="italic">⚠ Advisor review required before sending</span>
            <span>{draft.length} chars</span>
          </div>
        </div>

        {/* Footer — two WhatsApp options */}
        <div className="px-5 py-4 border-t-2 border-card-outline/20 shrink-0 space-y-3">
          <p className="text-xs font-bold text-game-text uppercase tracking-wider flex items-center gap-1.5">
            <IconBrandWhatsapp size={13} className="text-[#25D366]" />
            Open in WhatsApp — choose where
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {/* App button — opens native WhatsApp app on mobile */}
            <a
              href={waAppLink(customer.phone, draft)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:bg-[#18a84f] text-white font-bold text-xs transition-colors shadow-sm text-center"
            >
              <div className="flex items-center gap-1.5">
                <IconDeviceMobile size={16} />
                <span className="text-sm font-bold">WhatsApp App</span>
              </div>
              <span className="text-white/70 font-normal text-xs">Opens mobile app</span>
            </a>

            {/* Web button — always opens WhatsApp Web, no landing page */}
            <a
              href={waWebLink(customer.phone, draft)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-card-cream border-2 border-[#25D366] text-[#1ebe5a] font-bold text-xs transition-colors hover:bg-game-mint/20 text-center"
            >
              <div className="flex items-center gap-1.5">
                <IconDeviceDesktop size={16} />
                <span className="text-sm font-bold">WhatsApp Web</span>
              </div>
              <span className="text-[#25D366]/70 font-normal text-xs">Opens in browser</span>
            </a>
          </div>

          <p className="text-center text-xs text-game-purple/40">
            Message will be pre-filled — you send it manually
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
