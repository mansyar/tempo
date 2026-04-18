import { useState } from 'react';

const STORAGE_KEYS = {
  IDENTITY_ID: 'pointy_identityId',
  NICKNAME: 'pointy_nickname',
};

// Helper to get sync state from localStorage
function getInitialIdentity() {
  if (typeof window === 'undefined') return { id: null, name: '' };

  let id = localStorage.getItem(STORAGE_KEYS.IDENTITY_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.IDENTITY_ID, id);
  }

  const name = localStorage.getItem(STORAGE_KEYS.NICKNAME) || '';
  return { id, name };
}

export function useIdentity() {
  const [identity] = useState(getInitialIdentity);
  const [nickname, setNicknameState] = useState<string>(identity.name);

  const setNickname = (newNickname: string) => {
    setNicknameState(newNickname);
    localStorage.setItem(STORAGE_KEYS.NICKNAME, newNickname);
  };

  return {
    identityId: identity.id,
    nickname,
    setNickname,
  };
}
