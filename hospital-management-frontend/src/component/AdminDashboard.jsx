import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [doctorSpecialization, setDoctorSpecialization] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [doctorPassword, setDoctorPassword] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
      const [patientPassword, setPatientPassword] = useState('');
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const doctorResponse = await axios.get(`${baseURL}/api/superadmin/doctors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(doctorResponse.data);

            const patientResponse = await axios.get(`${baseURL}/api/superadmin/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(patientResponse.data);
        } catch (err) {
            setErrorMessage('Error fetching data: ' + (err.response?.data?.error || err.message));
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const addDoctor = async () => {
        const token = localStorage.getItem('token');
        if (!doctorName || !doctorEmail || !doctorPassword || !doctorSpecialization) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (!validateEmail(doctorEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/api/superadmin/doctors`,
                {
                    name: doctorName,
                    specialization: doctorSpecialization,
                    email: doctorEmail,
                    password: doctorPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDoctors([...doctors, response.data.doctor]);
            clearDoctorForm();
        } catch (err) {
            setErrorMessage('Error adding doctor: ' + (err.response?.data?.error || err.message));
        }
    };


    const updateDoctor = async () => {
        const token = localStorage.getItem('token');
        if (!doctorName || !doctorEmail || !doctorSpecialization) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (!validateEmail(doctorEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.put(`${baseURL}/api/superadmin/doctors/${editingDoctorId}`,
                {
                    name: doctorName,
                    specialization: doctorSpecialization,
                    email: doctorEmail
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDoctors(doctors.map(doctor => doctor._id === editingDoctorId ? response.data.doctor : doctor));
            clearDoctorForm();
        } catch (err) {
            setErrorMessage('Error updating doctor: ' + (err.response?.data?.error || err.message));
        }
    };

    const deleteDoctor = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${baseURL}/api/superadmin/doctors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(doctors.filter(doctor => doctor._id !== id));
        } catch (err) {
            setErrorMessage('Error deleting doctor: ' + (err.response?.data?.error || err.message));
        }
    };
        const addPatient = async () => {
        const token = localStorage.getItem('token');
        if (!patientName || !patientEmail || !patientPassword) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (!validateEmail(patientEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/api/superadmin/patients`, 
                { 
                    name: patientName,
                    email: patientEmail,
                    password: patientPassword
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPatients([...patients, response.data.patient]);
            setPatientName('');
            setPatientEmail('');
            setPatientPassword('');
        } catch (err) {
            setErrorMessage('Error adding patient: ' + (err.response?.data?.error || err.message));
        }
    };
    const deletePatient = async (id) => {
                const token = localStorage.getItem('token');
                try {
                    await axios.delete(`${baseURL}/api/superadmin/patients/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPatients(patients.filter(patient => patient._id !== id));
                } catch (err) {
                    setErrorMessage('Error deleting patient: ' + (err.response?.data?.error || err.message));
                }
            };

    const clearDoctorForm = () => {
        setDoctorName('');
        setDoctorSpecialization('');
        setDoctorEmail('');
        setDoctorPassword('');
        setEditingDoctorId(null);
    };

    const handleEditClick = (doctor) => {
        setDoctorName(doctor.name);
        setDoctorSpecialization(doctor.specialization);
        setDoctorEmail(doctor.email);
        setEditingDoctorId(doctor._id);
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}</h2>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Doctor's Name"
                        value={doctorName}
                        onChange={e => setDoctorName(e.target.value)}
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        placeholder="Specialization"
                        value={doctorSpecialization}
                        onChange={e => setDoctorSpecialization(e.target.value)}
                        className="border rounded p-2"
                    />
                    <input
                        type="email"
                        placeholder="Doctor's Email"
                        value={doctorEmail}
                        onChange={e => setDoctorEmail(e.target.value)}
                        className="border rounded p-2"
                    />
                    {editingDoctorId ? (
                        <button
                            onClick={updateDoctor}
                            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
                        >
                            Update Doctor
                        </button>
                    ) : (
                        <button
                            onClick={addDoctor}
                            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Add Doctor
                        </button>
                    )}
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Doctors</h2>
            <ul className="list-disc list-inside mb-6">
                {doctors.map(doctor => (
                    <li key={doctor._id} className="flex justify-between items-center mb-2">
                        <span>{doctor.name} - {doctor.specialization}</span>
                        <div>
                            <button
                                onClick={() => handleEditClick(doctor)}
                                className="text-blue-500 hover:text-blue-600 mr-4"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteDoctor(doctor._id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mb-6">
               <h2 className="text-xl font-semibold mb-2">Add Patient</h2>
              <div className="flex flex-col space-y-4">
                  <input 
                        type="text" 
                        placeholder="Patient's Name" 
                        value={patientName} 
                        onChange={e => setPatientName(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <input 
                        type="email" 
                        placeholder="Patient's Email"  
                        value={patientEmail} 
                        onChange={e => setPatientEmail(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <input 
                        type="password" 
                        placeholder="Patient's Password"  
                        value={patientPassword} 
                        onChange={e => setPatientPassword(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <button 
                        onClick={addPatient} 
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Add Patient
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Patients</h2>
            <ul className="list-disc list-inside">
                {patients.map(patient => (
                    <li key={patient._id} className="flex justify-between items-center mb-2">
                        <span>{patient.name}</span>
                        <button onClick={() => deletePatient(patient._id)} className="text-red-500 hover:text-red-600">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        
    );
};

export default AdminDashboard;
