/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';


jest.mock('axios');

describe('Login Component', () => {
  let setIsLoggedIn;

  beforeEach(() => {
    setIsLoggedIn = jest.fn();
    render(
      <Router>
        <Login setIsLoggedIn={setIsLoggedIn} />
      </Router>
    );
  });

  test('renders the login form', () => {
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows an error message when fields are empty', async () => {
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });
  });

  test('shows an error message for invalid credentials', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'User not found' } } });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  test('logs in successfully and navigates to home', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fakeToken',
        user: { role: 'user' },
      },
    });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    });
  });

  test('shows loading state during login', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fakeToken',
        user: { role: 'user' },
      },
    });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
  });
});
