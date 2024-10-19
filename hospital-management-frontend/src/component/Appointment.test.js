/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Appointment from './Appointment';

// Mock the DatePicker component
jest.mock('react-datepicker', () => {
  const FakeDatePicker = jest.fn(({ onChange }) => (
    <input
      type="text"
      onChange={(e) => onChange(new Date(e.target.value))}
      data-testid="date-picker"
    />
  ));
  return FakeDatePicker;
});

jest.mock('axios');

describe('Appointment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders the appointment form', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' }] });

    render(<Appointment />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /book appointment/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/select doctor/i)).toBeInTheDocument();
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
      expect(screen.getByLabelText(/describe your symptoms/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument();
    });
  });

  test('displays error when no doctors are available', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Appointment />);

    await waitFor(() => {
      expect(screen.getByText(/no doctors available at the moment/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays doctors', async () => {
    const doctors = [
      { _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' },
      { _id: '2', name: 'Dr. Johnson', specialization: 'Dermatologist' },
    ];
    axios.get.mockResolvedValueOnce({ data: doctors });

    render(<Appointment />);

    await waitFor(() => {
      expect(screen.getByText(/dr\. smith/i)).toBeInTheDocument();
      expect(screen.getByText(/dr\. johnson/i)).toBeInTheDocument();
    });
  });

  test('shows error when not logged in', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' }] });

    render(<Appointment />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/select doctor/i), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2023-10-20 10:00 AM' } });
      fireEvent.change(screen.getByLabelText(/describe your symptoms/i), { target: { value: 'Fever' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText(/you need to log in to book an appointment/i)).toBeInTheDocument();
    });
  });

  test('books an appointment successfully', async () => {
    localStorage.setItem('token', 'fakeToken');

    const doctors = [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' }];
    axios.get.mockResolvedValueOnce({ data: doctors });
    axios.post.mockResolvedValueOnce({});

    render(<Appointment />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/select doctor/i), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2023-10-20 10:00 AM' } });
      fireEvent.change(screen.getByLabelText(/describe your symptoms/i), { target: { value: 'Fever' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText(/appointment booked successfully/i)).toBeInTheDocument();
    });
  });

  test('shows error on failed appointment booking', async () => {
    localStorage.setItem('token', 'fakeToken');

    const doctors = [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' }];
    axios.get.mockResolvedValueOnce({ data: doctors });
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Booking failed' } } });

    render(<Appointment />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/select doctor/i), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2023-10-20 10:00 AM' } });
      fireEvent.change(screen.getByLabelText(/describe your symptoms/i), { target: { value: 'Fever' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText('Booking failed')).toBeInTheDocument();
    });
  });
});