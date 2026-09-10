import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'outline', 'link', 'destructive'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl', 'icon'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: 'Click me',
	},
};

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: 'Primary Button',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Secondary Button',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Outline Button',
	},
};

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		children: 'Ghost Button',
	},
};

export const Link: Story = {
	args: {
		variant: 'link',
		children: 'Link Button',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		children: 'Delete',
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
			<Button size="xl">Extra Large</Button>
		</div>
	),
};

export const Loading: Story = {
	args: {
		loading: true,
		children: 'Loading...',
	},
};

export const WithIcons: Story = {
	args: {
		leftIcon: <span>→</span>,
		rightIcon: <span>←</span>,
		children: 'With Icons',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: 'Disabled',
	},
};