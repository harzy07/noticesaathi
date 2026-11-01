/**
 * Calculates deadline based on start date, statutory duration, and business day rules
 */
export function calculateStatutoryDeadline(
  startDateStr: string,
  statutoryDays: number,
  isBusinessDays: boolean
): string {
  if (!startDateStr) return '';
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return '';

  if (!isBusinessDays) {
    // Calendar days
    const result = new Date(date);
    result.setDate(result.getDate() + statutoryDays);
    return result.toISOString().split('T')[0];
  } else {
    // Business days (skip Saturday and Sunday)
    const result = new Date(date);
    let added = 0;
    while (added < statutoryDays) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) {
        added++;
      }
    }
    return result.toISOString().split('T')[0];
  }
}

/**
 * Calculates remaining days until deadline from today (or anchor date 2026-10-31)
 */
export function getRemainingDays(deadlineStr: string, anchorDateStr: string = '2026-10-31'): number {
  if (!deadlineStr) return 0;
  const deadline = new Date(deadlineStr);
  const anchor = new Date(anchorDateStr);
  const diffTime = deadline.getTime() - anchor.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns formatted human string for statutory countdown
 */
export function formatStatutoryCountdown(daysLeft: number): {
  text: string;
  isUrgent: boolean;
  isOverdue: boolean;
} {
  if (daysLeft < 0) {
    return {
      text: `${Math.abs(daysLeft)}d overdue`,
      isUrgent: true,
      isOverdue: true,
    };
  }
  if (daysLeft === 0) {
    return {
      text: 'Due Today',
      isUrgent: true,
      isOverdue: false,
    };
  }
  if (daysLeft <= 7) {
    return {
      text: `${daysLeft}d left (Critical)`,
      isUrgent: true,
      isOverdue: false,
    };
  }
  return {
    text: `${daysLeft}d remaining`,
    isUrgent: false,
    isOverdue: false,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
