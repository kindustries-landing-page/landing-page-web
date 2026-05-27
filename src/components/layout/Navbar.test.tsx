import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { MemoryRouter } from 'react-router';

describe('Navbar Component', () => {
  it('should render without crashing', () => {
    // Currently Navbar returns null as per code block, but if we render it:
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
});
