// src/context/OnboardingContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@onboarding_state_v1';

// Shape of the data you collect during onboarding.
// Keep your existing fields and feel free to add more.
export interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  sport: string;
  // You can keep adding dynamic keys if you like:
  [key: string]: any;
}

interface OnboardingContextProps {
  // Collected form data
  data: OnboardingData;
  // Merge new values into the current onboarding data and persist
  setData: (values: Partial<OnboardingData>) => void;

  // Whether the user has finished onboarding (controls initial routing)
  completed: boolean;
  // Mark onboarding complete/incomplete and persist
  setCompleted: (value: boolean) => void;

  // True once we've loaded any saved state from disk (prevents flash/loops)
  isHydrated: boolean;

  // Handy dev utility to clear everything
  resetOnboarding: () => Promise<void>;
}

const initialData: OnboardingData = {
  name: '',
  age: '',
  gender: '',
  sport: '',
};

const OnboardingContext = createContext<OnboardingContextProps | undefined>(
  undefined
);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<OnboardingData>(initialData);
  const [completed, setCompletedState] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // ---- Load saved state once (app start) ----
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            data?: OnboardingData;
            completed?: boolean;
          };
          if (parsed.data) setDataState(parsed.data);
          if (typeof parsed.completed === 'boolean')
            setCompletedState(parsed.completed);
        }
      } catch {
        // ignore; we'll just use defaults
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  // Persist helper
  const persist = async (nextData: OnboardingData, nextCompleted: boolean) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: nextData, completed: nextCompleted })
      );
    } catch {
      // ignore write failures for now
    }
  };

  // Public setters that also persist
  const setData = (values: Partial<OnboardingData>) => {
    setDataState(prev => {
      const next = { ...prev, ...values };
      // fire-and-forget persist
      persist(next, completed);
      return next;
    });
  };

  const setCompleted = (value: boolean) => {
    setCompletedState(value);
    // fire-and-forget persist with current data
    persist(data, value);
  };

  const resetOnboarding = async () => {
    setDataState(initialData);
    setCompletedState(false);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({
      data,
      setData,
      completed,
      setCompleted,
      isHydrated,
      resetOnboarding,
    }),
    [data, completed, isHydrated]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return ctx;
};