import React from 'react';
import { IconCreditCard, IconLock } from '@tabler/icons-react';
import { Input } from '@/components/ui/Input';

export function PaymentPanel() {
  return (
    <div className="bg-card-cream border-sketch p-6">
      <div className="flex items-center gap-3 mb-6 border-b-4 border-card-outline/10 pb-4">
        <IconCreditCard size={32} className="text-pastel-pink transform -rotate-6" />
        <h2 className="font-handwriting font-bold text-3xl text-card-outline">Payment Details</h2>
      </div>

      <div className="flex flex-col gap-5">
        <Input 
          id="cardName" 
          label="Name on Card" 
          placeholder="Ash Ketchum" 
        />
        <Input 
          id="cardNumber" 
          label="Card Number" 
          placeholder="0000 0000 0000 0000" 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            id="expiry" 
            label="Expiry Date" 
            placeholder="MM/YY" 
          />
          <Input 
            id="cvv" 
            label="CVV" 
            placeholder="123" 
            type="password"
          />
        </div>

        <div className="mt-4 p-4 bg-pastel-yellow border-sketch-sm flex items-center justify-center gap-2 transform rotate-1">
          <IconLock size={20} className="text-pastel-pink" />
          <span className="font-bold text-card-text/80 text-lg">Secure & Encrypted Transaction</span>
        </div>
      </div>
    </div>
  );
}
