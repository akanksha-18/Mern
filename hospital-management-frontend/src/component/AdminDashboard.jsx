import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const [editingPatientId, setEditingPatientId] = useState(null);
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
            const response = await axios.post(`${baseURL}/api/superadmin/doctors`, {
                name: doctorName,
                specialization: doctorSpecialization,
                email: doctorEmail,
                password: doctorPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
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
            const response = await axios.put(`${baseURL}/api/superadmin/doctors/${editingDoctorId}`, {
                name: doctorName,
                specialization: doctorSpecialization,
                email: doctorEmail,
                password: doctorPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
            setDoctors(doctors.map(doc => doc._id === editingDoctorId ? response.data.doctor : doc));
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
            setDoctors(doctors.filter(doc => doc._id !== id));
        } catch (err) {
            setErrorMessage('Error deleting doctor: ' + (err.response?.data?.error || err.message));
        }
    };

    const clearDoctorForm = () => {
        setDoctorName('');
        setDoctorSpecialization('');
        setDoctorEmail('');
        setDoctorPassword('');
        setEditingDoctorId(null);
    };

    const handleEditDoctorClick = (doctor) => {
        setDoctorName(doctor.name);
        setDoctorSpecialization(doctor.specialization);
        setDoctorEmail(doctor.email);
        setDoctorPassword('');
        setEditingDoctorId(doctor._id);
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
            const response = await axios.post(`${baseURL}/api/superadmin/patients`, {
                name: patientName,
                email: patientEmail,
                password: patientPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
            setPatients([...patients, response.data.patient]);
            clearPatientForm();
        } catch (err) {
            setErrorMessage('Error adding patient: ' + (err.response?.data?.error || err.message));
        }
    };

    const updatePatient = async () => {
        const token = localStorage.getItem('token');
        if (!patientName || !patientEmail) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (!validateEmail(patientEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.put(`${baseURL}/api/superadmin/patients/${editingPatientId}`, {
                name: patientName,
                email: patientEmail,
                password: patientPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
            setPatients(patients.map(patient => patient._id === editingPatientId ? response.data.patient : patient));
            clearPatientForm();
        } catch (err) {
            setErrorMessage('Error updating patient: ' + (err.response?.data?.error || err.message));
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

    const clearPatientForm = () => {
        setPatientName('');
        setPatientEmail('');
        setPatientPassword('');
        setEditingPatientId(null);
    };

    const handleEditPatientClick = (patient) => {
        setPatientName(patient.name);
        setPatientEmail(patient.email);
        setEditingPatientId(patient._id);
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
            {errorMessage && <div className="text-red-500 mb-4 text-center">{errorMessage}</div>}
            
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Manage Doctors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" className="border rounded p-2" placeholder="Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                    <input type="text" className="border rounded p-2" placeholder="Specialization" value={doctorSpecialization} onChange={(e) => setDoctorSpecialization(e.target.value)} />
                    <input type="email" className="border rounded p-2" placeholder="Email" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} />
                    <input type="password" className="border rounded p-2" placeholder="Password" value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} />
                </div>
                <div className="mt-4">
                    {editingDoctorId ? (
                        <button onClick={updateDoctor} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Update Doctor</button>
                    ) : (
                        <button onClick={addDoctor} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Doctor</button>
                    )}
                </div>
                <ul className="mt-4 list-disc list-inside space-y-4">
                    {doctors.map(doctor => (
                        <li key={doctor._id} className="flex justify-between items-center p-2 border-b">
                            <span className="font-medium">{doctor.name}</span>
                            <div>
                                <button onClick={() => handleEditDoctorClick(doctor)} className="text-blue-500 hover:text-blue-600 mr-4">Edit</button>
                                <button onClick={() => deleteDoctor(doctor._id)} className="text-red-500 hover:text-red-600">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Manage Patients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" className="border rounded p-2" placeholder="Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                    <input type="email" className="border rounded p-2" placeholder="Email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
                    <input type="password" className="border rounded p-2" placeholder="Password" value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)} />
                </div>
                <div className="mt-4">
                    {editingPatientId ? (
                        <button onClick={updatePatient} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Update Patient</button>
                    ) : (
                        <button onClick={addPatient} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Patient</button>
                    )}
                </div>
                <ul className="mt-4 list-disc list-inside space-y-4">
                    {patients.map(patient => (
                        <li key={patient._id} className="flex justify-between items-center p-2 border-b">
                            <span className="font-medium">{patient.name}</span>
                            <div>
                                <button onClick={() => handleEditPatientClick(patient)} className="text-blue-500 hover:text-blue-600 mr-4">Edit</button>
                                <button onClick={() => deletePatient(patient._id)} className="text-red-500 hover:text-red-600">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
