/* eslint-disable no-undef */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom';
import PatientAppointments from './PatientAppointment'; // Adjust the path accordingly

// Mocking axios
jest.mock('axios');

describe('PatientAppointments Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks
  });

  test('renders the component correctly with no appointments', async () => {
    // Mocking axios.get to return an empty array for appointments
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<PatientAppointments />);

    expect(screen.getByText('My Appointments')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No appointments found.')).toBeInTheDocument();
    });
  });

  test('displays appointments when the API call is successful', async () => {
    // Mocking axios.get to return a list of appointments
    const mockAppointments = [
      {
        _id: '1',
        doctor: { name: 'Dr. Smith', specialization: 'Cardiology' },
        date: '2024-10-10T10:00:00.000Z',
        status: 'accepted',
        symptoms: 'Chest pain',
      },
      {
        _id: '2',
        doctor: { name: 'Dr. Doe', specialization: 'Dermatology' },
        date: '2024-10-12T14:00:00.000Z',
        status: 'pending',
        symptoms: 'Skin rash',
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockAppointments });

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Chest pain')).toBeInTheDocument();
      expect(screen.getByText('Accepted')).toHaveClass('text-green-600');
      expect(screen.getByText('Pending')).toHaveClass('text-yellow-600');
    });
  });

  test('displays an error message when the API call fails', async () => {
    // Mocking axios.get to simulate an error
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText('Authentication failed. Please log in again.')).toBeInTheDocument();
    });
  });

  test('displays the correct status color for different statuses', async () => {
    const mockAppointments = [
      {
        _id: '1',
        doctor: { name: 'Dr. Jane', specialization: 'Neurology' },
        date: '2024-10-11T09:00:00.000Z',
        status: 'rejected',
        symptoms: 'Headache',
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockAppointments });

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText('Rejected')).toHaveClass('text-red-600');
    });
  });

  test('renders error message if no token found', async () => {
    // Clear localStorage to simulate no token being available
    localStorage.removeItem('token');

    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText('Authentication failed. Please log in again.')).toBeInTheDocument();
    });
  });
});
