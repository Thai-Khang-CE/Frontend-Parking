/**
 * Billing Details Table Component
 * Displays unpaid parking sessions and allows selection
 */

import { formatCurrency, formatDate } from '../../../mock/paymentMock';
import styles from './BillingDetailsTable.module.css';

function BillingDetailsTable({ 
  sessions = [], 
  selectedIds = [],
  onToggleSelection,
  onSelectAll,
  onDeselectAll
}) {
  if (sessions.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Unpaid Sessions</h3>
        <div className={styles.empty}>
          <p>No unpaid parking sessions</p>
          <span className={styles.emoji}>✅</span>
          <p className={styles.message}>Your account is up to date!</p>
        </div>
      </div>
    );
  }

  const allSelected = sessions.length > 0 && selectedIds.length === sessions.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < sessions.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Unpaid Sessions</h3>
        <div className={styles.selectActions}>
          <button 
            className={styles.selectButton}
            onClick={onSelectAll}
          >
            Select All
          </button>
          <button 
            className={styles.selectButton}
            onClick={onDeselectAll}
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thCheckbox}>
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => allSelected ? onDeselectAll() : onSelectAll()}
                  className={styles.checkbox}
                />
              </th>
              <th className={styles.thDate}>Date</th>
              <th className={styles.thZone}>Zone</th>
              <th className={styles.thSlot}>Slot</th>
              <th className={styles.thDuration}>Duration</th>
              <th className={styles.thFee}>Fee</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const isSelected = selectedIds.includes(session.id);
              return (
                <tr key={session.id} className={`${styles.row} ${isSelected ? styles.selected : ''}`}>
                  <td className={styles.tdCheckbox}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => onToggleSelection(session.id)}
                      className={styles.checkbox}
                    />
                  </td>
                  <td className={styles.tdDate}>
                    <div className={styles.dateGroup}>
                      <div className={styles.dateFull}>{formatDate(session.entryTime)}</div>
                      <div className={styles.timeRange}>
                        {new Date(session.entryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.exitTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className={styles.tdZone}>
                    <span className={styles.zoneBadge}>{session.zoneName}</span>
                  </td>
                  <td className={styles.tdSlot}>{session.slot}</td>
                  <td className={styles.tdDuration}>
                    {session.duration.toFixed(2)}h
                  </td>
                  <td className={styles.tdFee}>
                    <span className={styles.fee}>{formatCurrency(session.fee)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className={styles.selectionSummary}>
          <p>{selectedIds.length} session(s) selected for payment</p>
        </div>
      )}
    </div>
  );
}

export default BillingDetailsTable;
