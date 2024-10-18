/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Appointment from './Appointment';

// Mock the axios module
jest.mock('axios');

describe('Appointment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the appointment form', async () => {
    await act(async () => {
      render(<Appointment />);
    });

    expect(screen.getByRole('heading', { name: /book appointment/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/select doctor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select date and time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/describe your symptoms/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument();
  });

  test('displays error when no doctors are available', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    await act(async () => {
      render(<Appointment />);
    });

    expect(await screen.findByText(/no doctors available at the moment/i)).toBeInTheDocument();
  });

  test('fetches and displays doctors', async () => {
    const doctors = [
      { _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' },
      { _id: '2', name: 'Dr. Johnson', specialization: 'Dermatologist' },
    ];
    axios.get.mockResolvedValueOnce({ data: doctors });

    await act(async () => {
      render(<Appointment />);
    });

    expect(await screen.findByText(/dr\. smith/i)).toBeInTheDocument();
    expect(await screen.findByText(/dr\. johnson/i)).toBeInTheDocument();
  });

  test('shows error when not logged in', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' }] });

    await act(async () => {
      render(<Appointment />);
    });

    fireEvent.change(screen.getByLabelText(/select doctor/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/describe your symptoms/i), { target: { value: 'Fever' } });
    
    // Mocking date selection
    const date = new Date();
    fireEvent.change(screen.getByLabelText(/select date and time/i), { target: { value: date.toString() } });

    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText(/you need to log in to book an appointment/i)).toBeInTheDocument();
    });
  });

  test('books an appointment successfully', async () => {
    localStorage.setItem('token', 'fakeToken'); // Simulate being logged in

    const doctors = [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' }];
    axios.get.mockResolvedValueOnce({ data: doctors });
    axios.post.mockResolvedValueOnce({}); // Mock successful appointment booking

    await act(async () => {
      render(<Appointment />);
    });

    fireEvent.change(screen.getByLabelText(/select doctor/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/describe your symptoms/i), { target: { value: 'Fever' } });
    
    // Mocking date selection
    const date = new Date();
    fireEvent.change(screen.getByLabelText(/select date and time/i), { target: { value: date.toString() } });

    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText(/appointment booked successfully/i)).toBeInTheDocument();
    });
  });

  test('shows error on failed appointment booking', async () => {
    localStorage.setItem('token', 'fakeToken'); // Simulate being logged in

    const doctors = [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiologist' }];
    axios.get.mockResolvedValueOnce({ data: doctors });
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Booking failed' } } });

    await act(async () => {
      render(<Appointment />);
    });

    fireEvent.change(screen.getByLabelText(/select doctor/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/describe your symptoms/i), { target: { value: 'Fever' } });
    
    // Mocking date selection
    const date = new Date();
    fireEvent.change(screen.getByLabelText(/select date and time/i), { target: { value: date.toString() } });

    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred while booking the appointment/i)).toBeInTheDocument();
    });
  });
});
