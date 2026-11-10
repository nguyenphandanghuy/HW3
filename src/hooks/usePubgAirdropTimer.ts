import { useEffect, useState } from 'react';

export function usePubgAirdropTimer(targetEpochMs: number) {
  const calcRemaining = () => Math.max(0, targetEpochMs - Date.now());
  const [remainingMs, setRemainingMs] = useState(calcRemaining);

  useEffect(() => {
    const syncClock = () => setRemainingMs(calcRemaining());
    syncClock();

    const timerId = window.setInterval(syncClock, 200);

    const onWake = () => {
      if (document.visibilityState === 'visible') syncClock();
    };

    document.addEventListener('visibilitychange', onWake);

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [targetEpochMs]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { remainingMs, formattedTime };
}