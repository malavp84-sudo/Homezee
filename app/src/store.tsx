import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from './authService';

type User = { phone: string } | null;

export type Address = {
  id: string;
  tag: 'Home' | 'Work' | 'Other';
  flat: string;
  street: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
};

type Ctx = {
  ready: boolean;
  user: User;
  guest: boolean;
  continueAsGuest: () => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  logout: () => void;
  addresses: Address[];
  active: Address | null;
  city: string;
  addAddress: (a: Omit<Address, 'id'>) => void;
  selectAddress: (id: string) => void;
  removeAddress: (id: string) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
};

const StoreContext = createContext<Ctx>(null as unknown as Ctx);
const KEY = 'homezee:v2';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [guest, setGuest] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const d = JSON.parse(raw);
        setUser(d.user ?? null);
        setGuest(!!d.guest);
        setAddresses(d.addresses ?? []);
        setActiveId(d.activeId ?? null);
        setSaved(d.saved ?? []);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify({ user, guest, addresses, activeId, saved })).catch(() => {});
  }, [ready, user, guest, addresses, activeId, saved]);

  const toggleSaved = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const active = addresses.find((a) => a.id === activeId) ?? null;

  const value: Ctx = {
    ready,
    user,
    guest,
    continueAsGuest: () => setGuest(true),
    sendOtp: auth.sendOtp,
    verifyOtp: async (phone, code) => setUser(await auth.verifyOtp(phone, code)),
    logout: () => {
      auth.signOut().catch(() => {});
      setUser(null);
      setGuest(false);
    },
    addresses,
    active,
    city: active?.city ?? 'Indore',
    addAddress: (a) => {
      const id = String(Date.now());
      setAddresses((l) => [{ ...a, id }, ...l]);
      setActiveId(id);
    },
    selectAddress: setActiveId,
    removeAddress: (id) => {
      setAddresses((l) => l.filter((a) => a.id !== id));
      setActiveId((cur) => (cur === id ? null : cur));
    },
    saved,
    toggleSaved,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
