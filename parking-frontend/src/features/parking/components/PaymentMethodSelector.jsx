/**
 * Payment Method Selector Component
 * Allows user to select payment method
 */

import { PAYMENT_METHODS } from '../../../mock/paymentMock';
import styles from './PaymentMethodSelector.module.css';

function PaymentMethodSelector({ selectedMethod, onSelect, disabled = false }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Select Payment Method</h3>
      <div className={styles.methodsGrid}>
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            className={`${styles.methodCard} ${selectedMethod === method.id ? styles.selected : ''}`}
            onClick={() => onSelect(method.id)}
            disabled={disabled}
          >
            <div className={styles.icon}>{method.icon}</div>
            <h4 className={styles.label}>{method.label}</h4>
            <p className={styles.description}>{method.description}</p>
            <div className={styles.details}>
              <span className={styles.fee}>
                {method.fee === 0 ? 'No fee' : `+${method.fee.toLocaleString()} fee`}
              </span>
              <span className={styles.time}>{method.processingTime}</span>
            </div>
            {selectedMethod === method.id && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethodSelector;
