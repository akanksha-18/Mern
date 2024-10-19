import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name);
        setUserRole(userData.role);

        if (userData.role === 'patient' && isLoggedIn) {
          navigate('/appointment');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    } else {
      setUserName('');
      setUserRole('');
    }
  }, [isLoggedIn]);

  const handleUserLogout = () => {
    handleLogout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="flex items-center space-x-3">
        <img
          src="https://img.freepik.com/premium-vector/hospital-logo-vector_1277164-14253.jpg"
          alt="Logo"
          className="h-10 w-10 rounded-full border-2 border-white shadow-md"
        />
        <span className="text-2xl font-bold tracking-wide">My Hospital</span>
      </div>

      <ul className="flex items-center space-x-8">
        {userRole === 'patient' && (
          <>
            <li>
              <Link
                to="/appointment"
                className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
              >
                Appointment
              </Link>
            </li>
            <li>
              <Link
                to="/my-appointments"
                className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
              >
                My Appointments
              </Link>
            </li>
          </>
        )}
        {userRole === 'doctor' && (
          <li>
            <Link
              to="/manage-appointments"
              className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
            >
              Manage Appointments
            </Link>
          </li>
        )}
        {userRole === 'super_admin' && (
          <>
        
             <li>
              <Link
                to="/manage-appointments"
                className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
              >
                Manage Appointments
              </Link>
            </li>
            <li>
              <Link
                to="/Admin-Dashboard"
                className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
              >
                Admin Dashboard
              </Link>
            </li>
          </>
        )}

        {isLoggedIn ? (
          <li className="flex items-center space-x-4">
            <span className="font-semibold">{userName}</span>
            <button
              onClick={handleUserLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg shadow-md transition ease-in-out duration-300"
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
