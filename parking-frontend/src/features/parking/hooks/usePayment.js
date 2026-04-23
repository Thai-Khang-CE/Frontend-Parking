/**
 * usePayment Hook
 * Manages Payment page state and payment processing
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import {
  getPaymentData,
  processPayment,
  PAYMENT_METHODS,
} from "../../../mock/paymentMock";

export function usePayment() {
  const { user } = useAuth();
  const userId = user?.email || "user-001";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);

  const getPaymentMethodLabel = useCallback(
    (paymentMethodId) =>
      PAYMENT_METHODS.find((method) => method.id === paymentMethodId)?.label ||
      paymentMethodId,
    [],
  );

  const syncPaymentData = useCallback(() => {
    const nextData = getPaymentData(userId);
    setData(nextData);
    setSelectedSessions((prev) => {
      if (!prev.length) {
        return nextData.unpaidSessions.map((session) => session.id);
      }

      const validSessionIds = new Set(nextData.unpaidSessions.map((session) => session.id));
      return prev.filter((sessionId) => validSessionIds.has(sessionId));
    });
  }, [userId]);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      const initialData = getPaymentData(userId);
      setData(initialData);
      setSelectedSessions(initialData.unpaidSessions.map((session) => session.id));
    } catch (err) {
      setError("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const calculateAmount = useCallback(() => {
    if (!data || !selectedSessions.length) return 0;
    return data.unpaidSessions
      .filter((session) => selectedSessions.includes(session.id))
      .reduce((sum, session) => sum + session.fee, 0);
  }, [data, selectedSessions]);

  const toggleSessionSelection = useCallback((sessionId) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId],
    );
  }, []);

  const selectAllSessions = useCallback(() => {
    if (data?.unpaidSessions) {
      setSelectedSessions(data.unpaidSessions.map((session) => session.id));
    }
  }, [data]);

  const deselectAllSessions = useCallback(() => {
    setSelectedSessions([]);
  }, []);

  const handlePayment = useCallback(
    async (paymentMethod) => {
      if (!selectedSessions.length) {
        setError("Please select at least one session to pay");
        return;
      }

      if (!paymentMethod) {
        setError("Please select a payment method");
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const amount = calculateAmount();
        const paymentMethodLabel = getPaymentMethodLabel(paymentMethod);
        const result = await processPayment(
          userId,
          selectedSessions,
          amount,
          paymentMethod,
        );

        if (result.success) {
          syncPaymentData();

          setPaymentResult({
            success: true,
            transactionId: result.transactionId,
            amount,
            paymentMethod: paymentMethodLabel,
            receipt: {
              ...result.receipt,
              method: paymentMethodLabel,
            },
            sessionsCount: selectedSessions.length,
          });

          setSelectedSessions([]);
          setSelectedMethod(null);
        } else {
          setPaymentResult({
            success: false,
            error: result.message || "Payment could not be completed.",
          });
        }
      } catch (err) {
        setError("Payment processing failed: " + err.message);
        setPaymentResult({
          success: false,
          error: "An error occurred during payment processing",
        });
      }

      setIsProcessing(false);
    },
    [calculateAmount, getPaymentMethodLabel, selectedSessions, syncPaymentData, userId],
  );

  const clearPaymentResult = useCallback(() => {
    setPaymentResult(null);
    syncPaymentData();
  }, [syncPaymentData]);

  const stats = data
    ? {
        payableUnpaidAmount: data.totalUnpaid,
        currentEstimatedFee: data.activeEstimate?.fee || 0,
        totalAmountDue: data.totalAmountDue,
        unpaidCount: data.unpaidSessions.length,
        selectedCount: selectedSessions.length,
        amountToPay: calculateAmount(),
      }
    : null;

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
    calculateAmount,
  };
}

export default usePayment;
