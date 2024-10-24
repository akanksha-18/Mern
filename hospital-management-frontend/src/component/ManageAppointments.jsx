import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (userRole !== 'doctor' && userRole !== 'super_admin') {
      navigate('/');
      return;
    }

    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      try {
        const endpoint = userRole === 'super_admin'
          ? `${baseURL}/api/appointments/all`
          : `${baseURL}/api/appointments/doctor`;

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments', err);
        if (err.response && err.response.status === 403) {
          setError('Access denied. You are not allowed to view this information.');
          toast.error('Access denied. You are not allowed to view this information.');
        } else {
          setError('Unable to fetch appointments. Please try again later.');
          toast.error('Unable to fetch appointments. Please try again later.');
        }
      }
    };

    fetchAppointments();
  }, [navigate, userRole]);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${baseURL}/api/appointments/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, status } : app
      ));
      toast.success('Appointment updated successfully!');
    } catch (err) {
      console.error('Error updating appointment', err);
      toast.error('Error updating appointment. Please try again.');
    }
  };

  const handleDeleteAppointment = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${baseURL}/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.filter(app => app._id !== id));
      toast.success('Appointment deleted successfully!');
    } catch (err) {
      console.error('Error deleting appointment', err);
      toast.error('Error deleting appointment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: 'UTC'
    };
    return date.toLocaleString('en-US', options);
  };

  const isDateExpired = (dateString) => {
    const appointmentDate = new Date(dateString);
    return appointmentDate < new Date(); 
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">Manage Appointments</h2>
      {error && <p className="text-red-500 mb-4 text-center lg:text-left">{error}</p>}
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
              <p className="text-center lg:text-left">
                <strong>Patient:</strong> {appointment.patient ? appointment.patient.name : 'Unknown'}
              </p>
              <p className="text-center lg:text-left">
                <strong>Doctor:</strong> {userRole === 'doctor' ? 'You' : (appointment.doctor ? appointment.doctor.name : 'Unknown')}
              </p>
              <p className="text-center lg:text-left"><strong>Slot:</strong> {formatDate(appointment.date)}</p>
              <p className="text-center lg:text-left"><strong>Status:</strong> {appointment.status}</p>
              <p className="text-center lg:text-left"><strong>Symptoms:</strong> {appointment.symptoms || 'No symptoms provided'}</p>
              
              {appointment.status === 'pending' && !isDateExpired(appointment.date) && userRole !== 'super_admin' && (
                <div className="mt-2 flex justify-center lg:justify-start">
                  <button 
                    onClick={() => handleStatusChange(appointment._id, 'accepted')}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleStatusChange(appointment._id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}

              {isDateExpired(appointment.date) && (
                <p className="text-gray-500 mt-2 text-center lg:text-left">This appointment has expired.</p>
              )}

              {/* {userRole === 'super_admin' && (
                <div className="mt-2 flex justify-center lg:justify-start">
                  <button 
                    onClick={() => handleDeleteAppointment(appointment._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
                  >
                    Delete Appointment
                  </button>
                </div>
              )} */}
              {userRole === 'super_admin' && (
  <div className="mt-2 flex justify-center lg:justify-start">
    <button 
      onClick={() => {
        const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
        if (confirmDelete) {
          handleDeleteAppointment(appointment._id);
        }
      }}
      className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
    >
      Delete Appointment
    </button>
  </div>
)}

            </li>
          ))}
        </ul>
      ) : (
        !error && <p className="text-center">No appointments found.</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default ManageAppointments;
