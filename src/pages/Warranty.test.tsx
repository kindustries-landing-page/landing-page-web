import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
  checkWarranty: (sokhung: string, somay: string) => mockCheckWarranty(sokhung, somay),
  activateWarranty: (payload: unknown) => mockActivateWarranty(payload),
  extractApiError: (error: unknown, fallback: string) => mockExtractApiError(error, fallback),
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

    expect(await screen.findByText('Thông tin kích hoạt')).toBeInTheDocument();
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

    // Fill required fields
    const nameInput = screen.getByLabelText(/Họ và Tên khách hàng/i);
    const phoneInput = screen.getByLabelText(/Số điện thoại/i);
    const addrInput = screen.getByLabelText(/Địa chỉ/i);

    await user.type(nameInput, 'Nguyen Van A');
    await user.type(phoneInput, '0987654321');
    await user.type(addrInput, 'Hanoi');

    const dealerTrigger = screen.getByRole('combobox', { name: /Đại lý kích hoạt/i });
    await user.click(dealerTrigger);

    const dealerOption = await screen.findByRole('option', { name: /Đại lý Khánh Huyền/i });
    await user.click(dealerOption);

    fireEvent.submit(confirmButton.closest('form')!);

    await waitFor(() => {
      expect(mockActivateWarranty).toHaveBeenCalledWith({
        sokhung: 'FRAME001',
        somay: 'ENGINE001',
        customer_name: 'Nguyen Van A',
        customer_phone: '0987654321',
        customer_address: 'Hanoi',
        dealer_id: 'KL0001',
        dealer_name: 'Đại lý Khánh Huyền',
        customer_dob: undefined,
        customer_email: undefined,
      });
    });

    expect(await screen.findByText('Kích hoạt thành công!')).toBeInTheDocument();
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

    expect(await screen.findByText('Thông tin kích hoạt')).toBeInTheDocument();
  });

  it('triggers check when user submits form manually', async () => {
    const user = userEvent.setup();
    mockCheckWarranty.mockResolvedValue({
      found: true,
      vehicle: {
        frame_no: 'FRAME_MANUAL',
        engine_no: 'ENGINE_MANUAL',
        model_name: 'Klotus S1',
        model_code: 'S1',
        warranty_status: 'NOT_ACTIVATED',
      },
      active_warranty: null,
    });

    render(
      <MemoryRouter initialEntries={['/bao-hanh']}>
        <Warranty />
      </MemoryRouter>
    );

    const sokhungInput = screen.getByLabelText('Số khung xe');
    const somayInput = screen.getByLabelText('Số máy xe');
    const checkButton = screen.getByRole('button', { name: 'Kiểm tra bảo hành' });

    await user.type(sokhungInput, 'FRAME_MANUAL');
    await user.type(somayInput, 'ENGINE_MANUAL');
    await user.click(checkButton);

    expect(await screen.findByText('Thông tin kích hoạt')).toBeInTheDocument();
  });

  it('parses malformed query when somay is concatenated without ampersand', async () => {
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
      <MemoryRouter initialEntries={['/bao-hanh?sokhung=FRAME001somay=ENGINE001']}>
        <Warranty />
      </MemoryRouter>
    );

    expect(await screen.findByText('Thông tin kích hoạt')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockCheckWarranty).toHaveBeenCalledWith('FRAME001', 'ENGINE001');
    });
  });
});
