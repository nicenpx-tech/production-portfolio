import * as React from 'react';
import type { Colors, Shadow, Radius, Spacing, Typography } from '@repo/design-tokens';

export type Theme = {
	colors: Colors;
	shadow: Shadow;
	radius: Radius;
	spacing: Spacing;
	typography: Typography;
};

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
	theme: Theme;
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	resolvedMode: 'light' | 'dark';
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultMode?: ThemeMode;
	storageKey?: string;
}

export function ThemeProvider({
	children,
	defaultMode = 'system',
	storageKey = 'portfolio-theme',
}: ThemeProviderProps) {
	const [mode, setModeState] = React.useState<ThemeMode>(() => {
		if (typeof window === 'undefined') return defaultMode;
		const stored = localStorage.getItem(storageKey) as ThemeMode;
		return stored || defaultMode;
	});

	const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>(() => {
		if (mode === 'system') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return mode;
	});

	React.useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove('light', 'dark');
		root.classList.add(resolvedMode);
	}, [resolvedMode]);

	React.useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = () => {
			if (mode === 'system') {
				setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [mode]);

	const setMode = React.useCallback(
		(newMode: ThemeMode) => {
			setModeState(newMode);
			localStorage.setItem(storageKey, newMode);

			if (newMode === 'system') {
				const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				setResolvedMode(isDark ? 'dark' : 'light');
			} else {
				setResolvedMode(newMode);
			}
		},
		[storageKey]
	);

	const value = React.useMemo(
		() => ({
			mode,
			resolvedMode,
			setMode,
			theme: {} as Theme, // Will be populated from design tokens
		}),
		[mode, resolvedMode, setMode]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}