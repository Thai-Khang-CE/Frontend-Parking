/**
 * usePayment Hook
 * Manages Payment page state and payment processing
 */

import { useState, useCallback } from 'react';
import { getPaymentData, processPayment } from '../../mock/paymentMock';

export function usePayment() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Payment processing state
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);

  // Initialize data on mount
  useState(() => {
    try {
      const initialData = getPaymentData();
      setData(initialData);
      // Select all unpaid sessions by default
      setSelectedSessions(initialData.unpaidSessions.map(s => s.id));
      setLoading(false);
    } catch (err) {
      setError('Failed to load payment data');
      setLoading(false);
    }
  }, []);

  // Calculate amount to pay based on selected sessions
  const calculateAmount = useCallback(() => {
    if (!data || !selectedSessions.length) return 0;
    return data.unpaidSessions
      .filter(s => selectedSessions.includes(s.id))
      .reduce((sum, s) => sum + s.fee, 0);
  }, [data, selectedSessions]);

  // Toggle session selection
  const toggleSessionSelection = useCallback((sessionId) => {
    setSelectedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  }, []);

  // Select all unpaid sessions
  const selectAllSessions = useCallback(() => {
    if (data?.unpaidSessions) {
      setSelectedSessions(data.unpaidSessions.map(s => s.id));
    }
  }, [data]);

  // Deselect all sessions
  const deselectAllSessions = useCallback(() => {
    setSelectedSessions([]);
  }, []);

  // Process payment
  const handlePayment = useCallback(async (paymentMethod) => {
    if (!selectedSessions.length) {
      setError('Please select at least one session to pay');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const amount = calculateAmount();
      const result = await processPayment(amount, paymentMethod);

      if (result.success) {
        // Update data to mark sessions as paid
        setData(prevData => ({
          ...prevData,
          unpaidSessions: prevData.unpaidSessions.filter(
            s => !selectedSessions.includes(s.id)
          ),
          transactionHistory: [
            {
              id: `txn-${Date.now()}`,
              date: new Date(),
              sessions: selectedSessions,
              amount,
              paymentMethod,
              status: 'completed',
              transactionId: result.transactionId,
              receipt: result.receipt
            },
            ...prevData.transactionHistory
          ]
        }));

        setPaymentResult({
          success: true,
          transactionId: result.transactionId,
          amount,
          paymentMethod,
          receipt: result.receipt,
          sessionsCount: selectedSessions.length
        });

        setSelectedSessions([]);
      } else {
        setPaymentResult({
          success: false,
          error: result.message
        });
      }
    } catch (err) {
      setError('Payment processing failed: ' + err.message);
      setPaymentResult({
        success: false,
        error: 'An error occurred during payment processing'
      });
    }

    setIsProcessing(false);
  }, [selectedSessions, calculateAmount]);

  // Clear payment result
  const clearPaymentResult = useCallback(() => {
    setPaymentResult(null);
  }, []);

  const stats = data ? {
    totalUnpaid: data.totalUnpaid,
    unpaidCount: data.unpaidSessions.length,
    selectedCount: selectedSessions.length,
    amountToPay: calculateAmount()
  } : null;

  return {
    data,
    loading,
    error,
    stats,
    selectedMethod,
    setSelectedMethod,
    isProcessing,
    paymentResult,
    clearPaymentResult,
    selectedSessions,
    toggleSessionSelection,
    selectAllSessions,
    deselectAllSessions,
    handlePayment,
    calculateAmount
  };
}

export default usePayment;
