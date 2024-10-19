/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ManageAppointments from './ManageAppointments';

// Mocks
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Helper function to render the component
const renderManageAppointments = (role) => {
  localStorage.setItem('role', role);
  localStorage.setItem('token', 'fake-token');
  return render(
    <Router>
      <ManageAppointments />
    </Router>
  );
};

describe('ManageAppointments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders correctly for doctor role', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderManageAppointments('doctor');

    expect(screen.getByText('Manage Appointments')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('No appointments found.')).toBeInTheDocument();
    });
  });

  test('renders correctly for super_admin role', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderManageAppointments('super_admin');

    expect(screen.getByText('Manage Appointments')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('No appointments found.')).toBeInTheDocument();
    });
  });

  test('displays appointments when data is fetched', async () => {
    const mockAppointments = [
      {
        _id: '1',
        patient: { name: 'John Doe' },
        doctor: { name: 'Dr. Smith' },
        date: '2023-10-20T10:00:00Z',
        status: 'pending',
        symptoms: 'Headache',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockAppointments });
    renderManageAppointments('doctor');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('You')).toBeInTheDocument();
      expect(screen.getByText('Headache')).toBeInTheDocument();
    });
  });

  test('handles appointment status change for doctor', async () => {
    const mockAppointments = [
      {
        _id: '1',
        patient: { name: 'John Doe' },
        date: '2099-10-20T10:00:00Z',
        status: 'pending',
        symptoms: 'Headache',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockAppointments });
    axios.patch.mockResolvedValueOnce({});
    renderManageAppointments('doctor');

    await waitFor(() => {
      fireEvent.click(screen.getByText('Accept'));
    });

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/api/appointments/1'),
      { status: 'accepted' },
      expect.any(Object)
    );
    expect(toast.success).toHaveBeenCalledWith('Appointment updated successfully!');
  });

  test('handles appointment deletion for super_admin', async () => {
    const mockAppointments = [
      {
        _id: '1',
        patient: { name: 'John Doe' },
        doctor: { name: 'Dr. Smith' },
        date: '2023-10-20T10:00:00Z',
        status: 'pending',
        symptoms: 'Headache',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockAppointments });
    axios.delete.mockResolvedValueOnce({});
    renderManageAppointments('super_admin');

    await waitFor(() => {
      fireEvent.click(screen.getByText('Delete Appointment'));
    });

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/appointments/1'),
      expect.any(Object)
    );
    expect(toast.success).toHaveBeenCalledWith('Appointment deleted successfully!');
  });

  test('displays error message when fetching appointments fails', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });
    renderManageAppointments('doctor');

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch appointments. Please try again later.')).toBeInTheDocument();
    });
    expect(toast.error).toHaveBeenCalledWith('Unable to fetch appointments. Please try again later.');
  });

  test('displays access denied message for unauthorized access', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 403 } });
    renderManageAppointments('doctor');

    await waitFor(() => {
      expect(screen.getByText('Access denied. You are not allowed to view this information.')).toBeInTheDocument();
    });
    expect(toast.error).toHaveBeenCalledWith('Access denied. You are not allowed to view this information.');
  });

  test('shows expired message for past appointments', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const mockAppointments = [
      {
        _id: '1',
        patient: { name: 'John Doe' },
        doctor: { name: 'Dr. Smith' },
        date: pastDate.toISOString(),
        status: 'pending',
        symptoms: 'Headache',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockAppointments });
    renderManageAppointments('doctor');

    await waitFor(() => {
      expect(screen.getByText('This appointment has expired.')).toBeInTheDocument();
    });
  });
});