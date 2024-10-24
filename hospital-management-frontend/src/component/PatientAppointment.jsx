// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function PatientAppointments() {
//   const [appointments, setAppointments] = useState([]);
//   const [error, setError] = useState('');
//   const baseURL = import.meta.env.VITE_BASE_URL;

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await axios.get(`${baseURL}/api/appointments/patient`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setAppointments(res.data);
//       } catch (err) {
//         if (err.response && err.response.status === 401) {
//           setError('Authentication failed. Please log in again.');
//         } else {
//           setError('Error fetching appointments. Please try again later.');
//         }
//       }
//     };
//     fetchAppointments();
//   }, []);

//   const cancelAppointment = async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.patch(`${baseURL}/api/appointments/cancel/${id}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAppointments(appointments.filter(appointment => appointment._id !== id)); 
//     } catch (err) {
//       console.error('Error canceling appointment', err);
//       setError('Error canceling the appointment. Please try again.');
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric', 
//       hour: '2-digit', 
//       minute: '2-digit', 
//       hour12: true,
//       timeZone: 'UTC'  
//     };
//     return date.toLocaleString('en-US', options);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'accepted':
//         return 'text-green-600';
//       case 'rejected':
//         return 'text-red-600';
//       case 'canceled':
//         return 'text-gray-600';
//       default:
//         return 'text-yellow-600';
//     }
//   };

//   return (
//     <div className="container mx-auto mt-8 px-4">
//       <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {appointments.length > 0 ? (
//         <ul className="space-y-4">
//           {appointments.map((appointment) => (
//             <li key={appointment._id} className="bg-white shadow-md rounded-lg p-4">
//               <p><strong>Doctor:</strong> {appointment.doctor ? appointment.doctor.name : 'N/A'}</p>
//               <p><strong>Specialization:</strong> {appointment.doctor ? appointment.doctor.specialization : 'N/A'}</p>
//               <p><strong>Date and Time:</strong> {formatDate(appointment.date)}</p>
//               <p>
//                 <strong>Status:</strong> 
//                 <span className={`font-bold ${getStatusColor(appointment.status)}`}>
//                   {' '}{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                 </span>
//               </p>
//               <p><strong>Symptoms:</strong> {appointment.symptoms || 'N/A'}</p>
//               {appointment.status === 'pending' && (
//                 <button 
//                   className="bg-red-500 text-white px-4 py-2 rounded mt-2"
//                   onClick={() => cancelAppointment(appointment._id)}
//                 >
//                   Cancel Appointment
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No appointments found.</p>
//       )}
//     </div>
//   );
// }

// export default PatientAppointments;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${baseURL}/api/appointments/patient`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError('Error fetching appointments. Please try again later.');
        }
      }
    };
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${baseURL}/api/appointments/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.filter(appointment => appointment._id !== id));
      
      // Show toast notification
      toast.success('Appointment canceled successfully');
    } catch (err) {
      console.error('Error canceling appointment', err);
      setError('Error canceling the appointment. Please try again.');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'canceled':
        return 'text-gray-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ToastContainer />
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="bg-white shadow-md rounded-lg p-4">
              <p><strong>Doctor:</strong> {appointment.doctor ? appointment.doctor.name : 'N/A'}</p>
              <p><strong>Specialization:</strong> {appointment.doctor ? appointment.doctor.specialization : 'N/A'}</p>
              <p><strong>Date and Time:</strong> {formatDate(appointment.date)}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`font-bold ${getStatusColor(appointment.status)}`}>
                  {' '}{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </p>
              <p><strong>Symptoms:</strong> {appointment.symptoms || 'N/A'}</p>
              {appointment.status === 'pending' && (
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => cancelAppointment(appointment._id)}
                >
                  Cancel Appointment
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
}

export default PatientAppointments;
