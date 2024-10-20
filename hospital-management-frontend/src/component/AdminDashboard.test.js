/* eslint-disable no-undef */
// /* eslint-disable no-undef */
// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import axios from 'axios';
// import AdminDashboard from './AdminDashboard'; // Adjust the import path accordingly
// import { BrowserRouter as Router } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';

// jest.mock('axios');

// describe('AdminDashboard', () => {
//   beforeEach(() => {
//     localStorage.setItem('token', 'test_token');
//     localStorage.setItem('role', 'super_admin');
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders AdminDashboard and fetches doctors and patients', async () => {
//     const doctors = [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiology' }];
//     const patients = [{ _id: '1', name: 'John Doe' }];

//     axios.get.mockResolvedValueOnce({ data: doctors });
//     axios.get.mockResolvedValueOnce({ data: patients });

//     render(
//       <Router>
//         <AdminDashboard />
//         <ToastContainer />
//       </Router>
//     );

//     expect(await screen.findByText(/admin dashboard/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Dr. Smith/i)).toBeInTheDocument();
//     expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
//   });

//   test('shows error message if fetch fails', async () => {
//     axios.get.mockRejectedValueOnce(new Error('Network Error'));

//     render(
//       <Router>
//         <AdminDashboard />
//         <ToastContainer />
//       </Router>
//     );

//     expect(await screen.findByText(/error fetching data/i)).toBeInTheDocument();
//   });



//   test('adds a doctor successfully', async () => {
//     axios.post.mockResolvedValueOnce({
//       data: {
//         doctor: { _id: '2', name: 'Dr. Jones', specialization: 'Pediatrics' }
//       }
//     });

//     render(
//       <Router>
//         <AdminDashboard />
//         <ToastContainer />
//       </Router>
//     );

//     fireEvent.change(screen.getByPlaceholderText(/doctor's name/i), { target: { value: 'Dr. Jones' } });
//     fireEvent.change(screen.getByPlaceholderText(/specialization/i), { target: { value: 'Pediatrics' } });
//     fireEvent.change(screen.getByPlaceholderText(/doctor's email/i), { target: { value: 'dr.jones@example.com' } });
//     fireEvent.change(screen.getByPlaceholderText(/doctor's password/i), { target: { value: 'password123' } });

//     fireEvent.click(screen.getByRole('button', { name: /add doctor/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/dr. jones - pediatrics/i)).toBeInTheDocument();
//     });
//   });

//   test('adds a patient successfully', async () => {
//     axios.post.mockResolvedValueOnce({
//       data: {
//         patient: { _id: '2', name: 'Jane Doe' }
//       }
//     });

//     render(
//       <Router>
//         <AdminDashboard />
//         <ToastContainer />
//       </Router>
//     );

//     fireEvent.change(screen.getByPlaceholderText(/patient's name/i), { target: { value: 'Jane Doe' } });
//     fireEvent.change(screen.getByPlaceholderText(/patient's email/i), { target: { value: 'jane.doe@example.com' } });
//     fireEvent.change(screen.getByPlaceholderText(/patient's password/i), { target: { value: 'password123' } });

//     fireEvent.click(screen.getByRole('button', { name: /add patient/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
//     });
//   });

//   test('deletes a doctor successfully', async () => {
//     const doctors = [{ _id: '1', name: 'Dr. Smith', specialization: 'Cardiology' }];
//     axios.get.mockResolvedValueOnce({ data: doctors });
//     axios.delete.mockResolvedValueOnce({});

//     render(
//       <Router>
//         <AdminDashboard />
//         <ToastContainer />
//       </Router>
//     );

//     await waitFor(() => expect(screen.getByText(/Dr. Smith/i)).toBeInTheDocument());

//     fireEvent.click(screen.getByText(/delete/i));

//     await waitFor(() => {
//       expect(screen.queryByText(/Dr. Smith/i)).not.toBeInTheDocument();
//     });
//   });

//   test('deletes a patient successfully', async () => {
//     const patients = [{ _id: '1', name: 'John Doe' }];
//     axios.get.mockResolvedValueOnce({ data: patients });
//     axios.delete.mockResolvedValueOnce({});

//     render(
//       <Router>
//         <AdminDashboard />
//         <ToastContainer />
//       </Router>
//     );

//     await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

//     fireEvent.click(screen.getByText(/delete/i));

//     await waitFor(() => {
//       expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
//     });
//   });
// });


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard'; // Adjust the import path if necessary
import { BrowserRouter as Router } from 'react-router-dom'; // for handling the routing with useNavigate

jest.mock('axios');

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'dummyToken'); // mock the localStorage token
  });

  test('renders Admin Dashboard with doctors and patients', async () => {
    // Mock data
    const mockDoctors = [{ _id: '1', name: 'Dr. John', specialization: 'Cardiologist' }];
    const mockPatients = [{ _id: '1', name: 'Patient 1' }];

    axios.get.mockResolvedValueOnce({ data: mockDoctors }).mockResolvedValueOnce({ data: mockPatients });

    render(
      <Router>
        <AdminDashboard />
      </Router>
    );

    await waitFor(() => expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/dr. john/i)).toBeInTheDocument());
  });

  test('handles form validation error when adding a doctor', async () => {
    render(
      <Router>
        <AdminDashboard />
      </Router>
    );

    fireEvent.click(screen.getByText(/add doctor/i));

    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
  });

  test('handles invalid email validation error', async () => {
    render(
      <Router>
        <AdminDashboard />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/doctor's name/i), { target: { value: 'Dr. Jane' } });
    fireEvent.change(screen.getByPlaceholderText(/specialization/i), { target: { value: 'Dentist' } });
    fireEvent.change(screen.getByPlaceholderText(/doctor's email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/add doctor/i));

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test('successfully adds a doctor', async () => {
    const mockDoctor = { _id: '1', name: 'Dr. Jane', specialization: 'Dentist', email: 'jane@dentist.com' };
    
    axios.post.mockResolvedValueOnce({ data: { doctor: mockDoctor } });

    render(
      <Router>
        <AdminDashboard />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/doctor's name/i), { target: { value: 'Dr. Jane' } });
    fireEvent.change(screen.getByPlaceholderText(/specialization/i), { target: { value: 'Dentist' } });
    fireEvent.change(screen.getByPlaceholderText(/doctor's email/i), { target: { value: 'jane@dentist.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/add doctor/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByText(/dr. jane/i)).toBeInTheDocument());
  });

  test('edits a doctor', async () => {
    const mockDoctor = { _id: '1', name: 'Dr. Jane', specialization: 'Dentist' };

    axios.get.mockResolvedValueOnce({ data: [mockDoctor] });
    axios.put.mockResolvedValueOnce({ data: { doctor: { _id: '1', name: 'Dr. Jane Edited', specialization: 'Dentist' } } });

    render(
      <Router>
        <AdminDashboard />
      </Router>
    );

    await waitFor(() => screen.getByText(/dr. jane/i));

    fireEvent.click(screen.getByText(/edit/i));

    fireEvent.change(screen.getByPlaceholderText(/doctor's name/i), { target: { value: 'Dr. Jane Edited' } });

    fireEvent.click(screen.getByText(/update doctor/i));

    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByText(/dr. jane edited/i)).toBeInTheDocument());
  });

  test('deletes a doctor', async () => {
    const mockDoctors = [{ _id: '1', name: 'Dr. John', specialization: 'Cardiologist' }];

    axios.get.mockResolvedValueOnce({ data: mockDoctors });
    axios.delete.mockResolvedValueOnce();

    render(
      <Router>
        <AdminDashboard />
      </Router>
    );

    await waitFor(() => screen.getByText(/dr. john/i));

    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(/dr. john/i)).not.toBeInTheDocument();
  });

  test('handles fetch error for doctors and patients', async () => {
    axios.get.mockRejectedValueOnce({ message: 'Network Error' });

    render(
      <Router>
        <AdminDashboard />
      </Router>
    );

    await waitFor(() => expect(screen.getByText(/error fetching data: network error/i)).toBeInTheDocument());
  });
});
