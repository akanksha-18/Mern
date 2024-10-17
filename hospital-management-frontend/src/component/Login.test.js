/* eslint-disable no-undef */
// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Login from './Login'; // Adjust the import path as necessary

jest.mock('axios');

describe('Login Component', () => {
  let setIsLoggedInMock;

  beforeEach(() => {
    setIsLoggedInMock = jest.fn();
    render(<Login setIsLoggedIn={setIsLoggedInMock} />);
  });

  test('renders Login component', () => {
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('displays error message when fields are empty', async () => {
    fireEvent.click(screen.getByText(/Login/i));
    expect(await screen.findByText(/Please fill in all fields./i)).toBeInTheDocument();
  });

  test('displays error message on failed login', async () => {
    axios.post.mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/Login/i));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  test('displays success message on successful login', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: { email: 'test@example.com', role: 'user' },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => expect(setIsLoggedInMock).toHaveBeenCalledWith(true));
    expect(await screen.findByText(/Logged in successfully!/i)).toBeInTheDocument();
  });

  test('disables button and shows loading state during submission', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: { email: 'test@example.com', role: 'user' },
      },
    };
    axios.post.mockImplementation(() => new Promise(() => {})); // Simulate a delay

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
    const button = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(button);

    expect(button).toBeDisabled(); // Button should be disabled
    expect(button).toHaveTextContent('Logging in...'); // Loading state
  });
});
