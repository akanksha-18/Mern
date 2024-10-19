/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  const mockHandleLogout = jest.fn();

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders the Navbar with logo and title', () => {
    render(
      <MemoryRouter>
        <Navbar isLoggedIn={false} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    const logo = screen.getByAltText('Logo');
    const title = screen.getByText('My Hospital');

    expect(logo).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  test('renders login and register links when not logged in', () => {
    render(
      <MemoryRouter>
        <Navbar isLoggedIn={false} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    const loginLink = screen.getByText('Login');
    const registerLink = screen.getByText('Register');

    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });

  test('renders user information and logout button when logged in as patient', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'John Doe', role: 'patient' }));

    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    const userName = screen.getByText('John Doe');
    const logoutButton = screen.getByText('Logout');
    const appointmentLink = screen.getByText('Appointment');
    const myAppointmentsLink = screen.getByText('My Appointments');

    expect(userName).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(appointmentLink).toBeInTheDocument();
    expect(myAppointmentsLink).toBeInTheDocument();
  });

  test('renders doctor-specific links when logged in as doctor', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Dr. Smith', role: 'doctor' }));

    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    const userName = screen.getByText('Dr. Smith');
    const logoutButton = screen.getByText('Logout');
    const manageAppointmentsLink = screen.getByText('Manage Appointments');

    expect(userName).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(manageAppointmentsLink).toBeInTheDocument();
  });

  test('renders super_admin-specific links when logged in as super_admin', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'super_admin' }));

    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    const userName = screen.getByText('Admin');
    const logoutButton = screen.getByText('Logout');
    const appointmentLink = screen.getByText('Appointment');
    const myAppointmentsLink = screen.getByText('My Appointments');
    const manageAppointmentsLink = screen.getByText('Manage Appointments');
    const adminDashboardLink = screen.getByText('Admin Dashboard');

    expect(userName).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(appointmentLink).toBeInTheDocument();
    expect(myAppointmentsLink).toBeInTheDocument();
    expect(manageAppointmentsLink).toBeInTheDocument();
    expect(adminDashboardLink).toBeInTheDocument();
  });

  test('calls handleLogout and clears localStorage on logout', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'John Doe', role: 'patient' }));

    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockHandleLogout).toHaveBeenCalled();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
