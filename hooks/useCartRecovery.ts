'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/useCartStore';

export function useCartRecovery() {
  const { items, applyCoupon } = useCartStore();
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Exit-intent: user moves mouse above top boundary to leave/close tab
      if (e.clientY <= 10 && items.length > 0) {
        const isDismissed = sessionStorage.getItem('nex_recovery_dismissed');
        if (!isDismissed) {
          setIsRecoveryOpen(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [items.length]);

  const openRecovery = useCallback(() => {
    setIsRecoveryOpen(true);
  }, []);

  const closeRecovery = useCallback(() => {
    setIsRecoveryOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nex_recovery_dismissed', 'true');
    }
  }, []);

  const handleClaimIncentive = useCallback(
    (code = 'COMEBACK10') => {
      applyCoupon(code);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('applied_recovery_code', code);
        sessionStorage.setItem('nex_recovery_dismissed', 'true');
      }
      setIsRecoveryOpen(false);
    },
    [applyCoupon]
  );

  return {
    isRecoveryOpen,
    openRecovery,
    closeRecovery,
    handleClaimIncentive,
  };
}
