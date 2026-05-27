import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Warranty } from './Warranty';
import '@/src/i18n';

const mockCheckWarranty = vi.fn();
const mockActivateWarranty = vi.fn();
const mockExtractApiError = vi.fn((error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
});

vi.mock('@/src/lib/api', () => ({
  checkWarranty: (...args: unknown[]) => mockCheckWarranty(...args),
  activateWarranty: (...args: unknown[]) => mockActivateWarranty(...args),
  extractApiError: (...args: unknown[]) => mockExtractApiError(...args),
}));

describe('Warranty page', () => {
  beforeEach(() => {
    mockCheckWarranty.mockReset();
    mockActivateWarranty.mockReset();
    mockExtractApiError.mockClear();
  });

  it('opens confirm modal when vehicle has not been activated', async () => {
    mockCheckWarranty.mockResolvedValue({
      found: true,
      vehicle: {
        frame_no: 'FRAME001',
        engine_no: 'ENGINE001',
        model_name: 'Klotus S1',
        model_code: 'S1',
        warranty_status: 'NOT_ACTIVATED',
      },
      active_warranty: null,
    });

    render(
      <MemoryRouter initialEntries={['/bao-hanh?sokhung=FRAME001&somay=ENGINE001']}>
        <Warranty />
      </MemoryRouter>
    );

    expect(await screen.findByText('Xác nhận kích hoạt')).toBeInTheDocument();
  });

  it('shows already activated modal when active warranty exists', async () => {
    mockCheckWarranty.mockResolvedValue({
      found: true,
      vehicle: {
        frame_no: 'FRAME001',
        engine_no: 'ENGINE001',
        model_name: 'Klotus S1',
        model_code: 'S1',
        warranty_status: 'ACTIVE',
      },
      active_warranty: {
        warranty_code: 'WRN-001',
        status: 'ACTIVE',
        activated_date: '2026-05-27',
        activated_at: '2026-05-27T10:30:00.000Z',
        warranty_start_date: '2026-05-27',
        warranty_end_date: '2028-05-27',
      },
    });

    render(
      <MemoryRouter initialEntries={['/bao-hanh?sokhung=FRAME001&somay=ENGINE001']}>
        <Warranty />
      </MemoryRouter>
    );

    expect(await screen.findByText('Đã được kích hoạt')).toBeInTheDocument();
    expect(screen.getByText(/WRN-001/)).toBeInTheDocument();
  });

  it('activates warranty after confirmation', async () => {
    const user = userEvent.setup();
    mockCheckWarranty.mockResolvedValue({
      found: true,
      vehicle: {
        frame_no: 'FRAME001',
        engine_no: 'ENGINE001',
        model_name: 'Klotus S1',
        model_code: 'S1',
        warranty_status: 'NOT_ACTIVATED',
      },
      active_warranty: null,
    });
    mockActivateWarranty.mockResolvedValue({
      message: 'Kích hoạt bảo hành thành công',
      activation: {
        id: 'a1',
        warranty_code: 'WRN-001',
        activated_date: '2026-05-27',
        activated_at: '2026-05-27T10:30:00.000Z',
        warranty_start_date: '2026-05-27',
        warranty_end_date: '2028-05-27',
        status: 'ACTIVE',
      },
      vehicle: {
        id: 'v1',
        frame_no: 'FRAME001',
        engine_no: 'ENGINE001',
        vin: 'VIN001',
        warranty_status: 'ACTIVE',
      },
    });

    render(
      <MemoryRouter initialEntries={['/bao-hanh?sokhung=FRAME001&somay=ENGINE001']}>
        <Warranty />
      </MemoryRouter>
    );

    const confirmButton = await screen.findByRole('button', { name: 'Xác nhận' });
    await user.click(confirmButton);

    expect(await screen.findByText('Kích hoạt thành công!')).toBeInTheDocument();
    expect(mockActivateWarranty).toHaveBeenCalledWith({
      sokhung: 'FRAME001',
      somay: 'ENGINE001',
    });
  });

  it('opens confirm modal when vehicle is not found in DB yet', async () => {
    mockCheckWarranty.mockResolvedValue({
      found: false,
      vehicle: null,
      active_warranty: null,
    });

    render(
      <MemoryRouter initialEntries={['/bao-hanh?sokhung=BAD&somay=BAD']}>
        <Warranty />
      </MemoryRouter>
    );

    expect(await screen.findByText('Xác nhận kích hoạt')).toBeInTheDocument();
  });
});
