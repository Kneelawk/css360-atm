import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	test('should render h1', () => {
		render(Page, { data: { user: { username: 'test-user', id: 'test-id' } } });
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hi, test-user!');
	});
});
