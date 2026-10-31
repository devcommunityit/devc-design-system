import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './TicketSelector.module.css';

export interface TicketOption {
  id: string;
  name: ReactNode;
  description?: ReactNode;
  price: ReactNode;
  unavailable?: boolean;
}

export interface TicketSelectorProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  tickets: TicketOption[];
  selectedTicketId: string;
  quantity: number;
  onTicketChange: (ticketId: string) => void;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export function TicketSelector({
  title,
  tickets,
  selectedTicketId,
  quantity,
  onTicketChange,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = 10,
  className,
  ...rest
}: TicketSelectorProps) {
  const groupName = useId();
  const headingId = useId();
  const quantityId = useId();

  return (
    <section aria-labelledby={headingId} className={[styles.selector, className].filter(Boolean).join(' ')} {...rest}>
      <h2 id={headingId} className={styles.title}>{title}</h2>
      <fieldset className={styles.options}>
        <legend className={styles.legend}>Choose a ticket</legend>
        {tickets.map((ticket) => (
          <label className={styles.option} key={ticket.id}>
            <input
              type="radio"
              name={groupName}
              value={ticket.id}
              checked={selectedTicketId === ticket.id}
              disabled={ticket.unavailable}
              onChange={() => onTicketChange(ticket.id)}
            />
            <span className={styles.details}>
              <span className={styles.name}>{ticket.name}</span>
              {ticket.description ? <span className={styles.description}>{ticket.description}</span> : null}
            </span>
            <span className={styles.price}>{ticket.unavailable ? 'Unavailable' : ticket.price}</span>
          </label>
        ))}
      </fieldset>
      <div className={styles.quantity}>
        <label htmlFor={quantityId}>Quantity</label>
        <input
          id={quantityId}
          type="number"
          min={minQuantity}
          max={maxQuantity}
          value={quantity}
          onChange={(event) => onQuantityChange(Number(event.currentTarget.value))}
        />
      </div>
    </section>
  );
}
