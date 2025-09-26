
import { create } from 'zustand';

interface UserInfo {
  id: number;
  username: string;
  email?: string | null;
}

interface Store {
  token: string | null;
  user: UserInfo | null;
  setToken: (t: string) => void;
  setUser: (u: UserInfo | null) => void;
  clearAuth: () => void;
}

const TOKEN_KEY = 'srs_token';
const USER_KEY = 'srs_user';

const initialToken = localStorage.getItem(TOKEN_KEY);
const initialUser = (() => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserInfo) : null;
  } catch {
    return null;
  }
})();
console.log('useStore initialized', initialToken, initialUser);
const useStore = create<Store>((set) => ({
  token: initialToken,
  user: initialUser,
  setToken: (t) => {
    localStorage.setItem(TOKEN_KEY, t);
    set({ token: t });
  },
  setUser: (u) => {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
    set({ user: u ?? null });
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
}));

export default useStore;
