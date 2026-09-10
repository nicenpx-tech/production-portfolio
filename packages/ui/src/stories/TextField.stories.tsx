import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../forms/TextField';

const meta: Meta<typeof TextField> = {
	title: 'Forms/TextField',
	component: TextField,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
	args: {
		label: 'Username',
		placeholder: 'Enter your username',
	},
};

export const WithError: Story = {
	args: {
		label: 'Email',
		error: 'Please enter a valid email address',
	},
};

export const WithHelperText: Story = {
	args: {
		label: 'Password',
		type: 'password',
		helperText: 'Must be at least 8 characters',
	},
};

export const WithIcons: Story = {
	args: {
		label: 'Search',
		placeholder: 'Search...',
		leftIcon: <span>🔍</span>,
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="space-y-4">
			<TextField size="sm" label="Small" placeholder="Small input" />
			<TextField size="md" label="Medium" placeholder="Medium input" />
			<TextField size="lg" label="Large" placeholder="Large input" />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		label: 'Disabled',
		disabled: true,
		value: 'Cannot edit',
	},
};