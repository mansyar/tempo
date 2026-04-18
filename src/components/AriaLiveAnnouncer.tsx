import React, { useState, useEffect } from 'react';

let announceFn: (message: string) => void = () => {};

export function announce(message: string) {
  announceFn(message);
}

export function AriaLiveAnnouncer() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    announceFn = (msg: string) => {
      setMessage(msg);
      // Clear message after 3 seconds to allow same message to be re-announced
      setTimeout(() => {
        setMessage('');
      }, 3000);
    };

    return () => {
      announceFn = () => {};
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid="aria-live-region"
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
      }}
    >
      {message}
    </div>
  );
}
