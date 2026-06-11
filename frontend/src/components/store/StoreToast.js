'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

let toastFn = null;

export function showToast(msg) {
  if (toastFn) toastFn(msg);
}

export default function StoreToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const trigger = useCallback(function (msg) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    setVisible(true);
    timerRef.current = setTimeout(function () {
      setVisible(false);
    }, 2000);
  }, []);

  useEffect(function () {
    toastFn = trigger;
    return function () { toastFn = null; };
  }, [trigger]);

  return <div className={`fk-toast${visible ? ' on' : ''}`}>{message}</div>;
}
