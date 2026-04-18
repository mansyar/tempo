import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  IDENTITY_ID: 'pointy_identityId',
  NICKNAME: 'pointy_nickname',
};

// Helper to generate a UUID if not in secure context or for older browsers
function simpleUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useIdentity() {
  // Initialize with empty/null for SSR stability
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [nickname, setNicknameState] = useState<string>('');

  useEffect(() => {
    // Client-side initialization
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem(STORAGE_KEYS.IDENTITY_ID);
      if (!id) {
        id = simpleUUID();
        localStorage.setItem(STORAGE_KEYS.IDENTITY_ID, id);
      }
      setIdentityId(id);

      const name = localStorage.getItem(STORAGE_KEYS.NICKNAME) || '';
      setNicknameState(name);
    }
  }, []);

  const setNickname = (newNickname: string) => {
    setNicknameState(newNickname);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NICKNAME, newNickname);
    }
  };

  return {
    identityId,
    nickname,
    setNickname,
  };
}
