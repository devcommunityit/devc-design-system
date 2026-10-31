import { useState } from 'react';
import { TicketSelector } from './TicketSelector';

export function Basic() {
  const [ticketId, setTicketId] = useState('general');
  const [quantity, setQuantity] = useState(1);
  return (
    <TicketSelector
      title="Choose your ticket"
      tickets={[
        { id: 'general', name: 'General admission', description: 'Access to all talks.', price: '€49' },
        { id: 'student', name: 'Student', description: 'Student ID required.', price: '€19' },
        { id: 'vip', name: 'VIP', price: '€99', unavailable: true },
      ]}
      selectedTicketId={ticketId}
      quantity={quantity}
      onTicketChange={setTicketId}
      onQuantityChange={setQuantity}
    />
  );
}
