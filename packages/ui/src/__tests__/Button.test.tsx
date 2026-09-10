import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../components/Button';

describe('Button', () => {
	it('renders children', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole('button')).toHaveTextContent('Click me');
	});

	it('applies variant classes', () => {
		render(<Button variant="primary">Primary</Button>);
		expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');
	});

	it('applies size classes', () => {
		render(<Button size="lg">Large</Button>);
		expect(screen.getByRole('button')).toHaveClass('h-12');
	});

	it('shows loading state', () => {
		render(<Button loading>Loading</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('is disabled when disabled prop is true', () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('calls onClick handler', () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click</Button>);
		screen.getByRole('button').click();
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});