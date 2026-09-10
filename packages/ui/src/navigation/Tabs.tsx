import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const tabsListVariants = cva('inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800');

const tabsTriggerVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950',
	{
		variants: {
			variant: {
				default: 'text-gray-500 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
}

export interface TabsTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
	value: string;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error('Tabs components must be used within Tabs');
	}
	return context;
};

/**
 * Tabs - A tabbed navigation component
 * Allows switching between different content panels
 */
export const Tabs = Object.assign(
	React.forwardRef<HTMLDivElement, TabsProps>(
		({ defaultValue, value, onValueChange, children, className, ...props }, ref) => {
			const [activeTab, setActiveTab] = React.useState(defaultValue || '');

			const handleValueChange = (tabValue: string) => {
				setActiveTab(tabValue);
				onValueChange?.(tabValue);
			};

			return (
				<TabsContext.Provider value={{ value: value ?? activeTab, onValueChange: handleValueChange }}>
					<div ref={ref} className={cn(className)} {...props}>
						{children}
					</div>
				</TabsContext.Provider>
			);
		}
	),
	{
		List: function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
			return <div className={cn(tabsListVariants(), className)} {...props} />;
		},
		Trigger: function TabsTrigger(props: TabsTriggerProps) {
			const { value, className, children, ...rest } = props;
			const context = useTabsContext();
			const isActive = context.value === value;

			return (
				<button
					type="button"
					data-state={isActive ? 'active' : 'inactive'}
					onClick={() => context.onValueChange(value)}
					className={cn(tabsTriggerVariants(), isActive && 'shadow-sm', className)}
					{...rest}
				>
					{children}
				</button>
			);
		},
		Content: function TabsContent(props: TabsContentProps) {
			const { value, className, children, ...rest } = props;
			const context = useTabsContext();
			const isActive = context.value === value;

			if (!isActive) return null;

			return (
				<div className={cn('mt-2', className)} {...rest}>
					{children}
				</div>
			);
		},
	}
);

Tabs.displayName = 'Tabs';
