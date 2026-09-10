import * as React from 'react';

/**
 * Polynomial easing function for smooth transitions
 */
export const easeInOutPoly = (t: number): number => {
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

/**
 * useForwardedRef - Hook to handle forwarded refs safely
 */
export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
	const innerRef = React.useRef<T>(null);

	React.useEffect(() => {
		if (!ref) return;
		if (typeof ref === 'function') {
			ref(innerRef.current);
		} else {
			ref.current = innerRef.current;
		}
	}, [ref]);

	return innerRef;
}

/**
 * useControllableState - Hook to manage both controlled and uncontrolled state
 */
export function useControllableState<T>({
	value,
	defaultValue,
	onChange,
}: {
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
}) {
	const [internalValue, setInternalValue] = React.useState<T>(defaultValue as T);
	const isControlled = value !== undefined;
	const currentValue = isControlled ? value : internalValue;

	const setValue = React.useCallback(
		(newValue: T) => {
			if (!isControlled) {
				setInternalValue(newValue);
			}
			onChange?.(newValue);
		},
		[isControlled, onChange]
	);

	return [currentValue, setValue] as const;
}

/**
 * useOnClickOutside - Hook to detect clicks outside a component
 */
export function useOnClickOutside<T extends HTMLElement>(
	ref: React.RefObject<T | null>,
	handler: (event: MouseEvent | TouchEvent) => void
) {
	React.useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			handler(event);
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [ref, handler]);
}

/**
 * useEscapeKey - Hook to detect Escape key press
 */
export function useEscapeKey(handler: () => void, enabled = true) {
	React.useEffect(() => {
		if (!enabled) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handler();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [handler, enabled]);
}

/**
 * useIsomorphicLayoutEffect - Hook that works on both server and client
 */
export const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * useMediaQuery - Hook to listen to CSS media queries
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = React.useState(false);

	React.useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) {
			setMatches(media.matches);
		}

		const listener = () => setMatches(media.matches);
		media.addEventListener('change', listener);

		return () => media.removeEventListener('change', listener);
	}, [matches, query]);

	return matches;
}

/**
 * useToggle - Hook to toggle between true/false
 */
export function useToggle(initialValue = false) {
	const [value, setValue] = React.useState(initialValue);

	const toggle = React.useCallback(() => setValue((v) => !v), []);
	const setTrue = React.useCallback(() => setValue(true), []);
	const setFalse = React.useCallback(() => setValue(false), []);

	return { value, setValue, toggle, setTrue, setFalse } as const;
}

/**
 * useBoolean - Alias for useToggle with clearer naming
 */
export const useBoolean = useToggle;

/**
 * usePrevious - Hook to get previous value
 */
export function usePrevious<T>(value: T): T | undefined {
	const ref = React.useRef<T | undefined>(undefined);

	React.useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}

/**
 * useMountedState - Hook to check if component is mounted
 */
export function useMountedState() {
	const mounted = React.useRef(false);

	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	return React.useCallback(() => mounted.current, []);
}

/**
 * useInterval - Hook to set interval
 */
export function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = React.useRef(callback);

	React.useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		if (delay === null) return;
		const id = setInterval(() => savedCallback.current(), delay);
		return () => clearInterval(id);
	}, [delay]);
}

/**
 * useWindowSize - Hook to get window dimensions
 */
export function useWindowSize() {
	const [size, setSize] = React.useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	});

	React.useEffect(() => {
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return size;
}

/**
 * useScrollPosition - Hook to get scroll position
 */
export function useScrollPosition() {
	const [scrollPosition, setScrollPosition] = React.useState({ x: 0, y: 0 });

	React.useEffect(() => {
		const updatePosition = () => {
			setScrollPosition({
				x: window.scrollX,
				y: window.scrollY,
			});
		};

		window.addEventListener('scroll', updatePosition);
		return () => window.removeEventListener('scroll', updatePosition);
	}, []);

	return scrollPosition;
}

/**
 * useLocalStorage - Hook to sync with localStorage
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
	const [storedValue, setStoredValue] = React.useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});

	const setValue = React.useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				if (typeof window !== 'undefined') {
					window.localStorage.setItem(key, JSON.stringify(valueToStore));
				}
			} catch (error) {
				console.error(error);
			}
		},
		[key, storedValue]
	);

	return [storedValue, setValue] as const;
}

/**
 * useDebounce - Hook to debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	React.useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}

/**
 * useThrottle - Hook to throttle a value
 */
export function useThrottle<T>(value: T, limit: number): T {
	const [throttledValue, setThrottledValue] = React.useState(value);
	const lastRan = React.useRef(Date.now());

	React.useEffect(() => {
		const handler = setTimeout(() => {
			if (Date.now() - lastRan.current >= limit) {
				setThrottledValue(value);
				lastRan.current = Date.now();
			}
		}, limit - (Date.now() - lastRan.current));

		return () => clearTimeout(handler);
	}, [value, limit]);

	return throttledValue;
}