import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         
          <div className="flex items-center">
            <img
              src="https://img.freepik.com/premium-vector/hospital-logo-vector_1277164-14253.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-full border-2 border-white shadow-md"
            />
            <span className="ml-3 text-2xl font-bold tracking-wide">My Hospital</span>
          </div>

         
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>

       
          <div className="hidden md:flex items-center space-x-8">
            {userRole === 'patient' && (
              <>
                <Link
                  to="/appointment"
                  className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
                >
                  Appointment
                </Link>
                <Link
                  to="/my-appointments"
                  className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
                >
                  My Appointments
                </Link>
              </>
            )}
            {userRole === 'doctor' && (
              <Link
                to="/manage-appointments"
                className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
              >
                Manage Appointments
              </Link>
            )}
            {userRole === 'super_admin' && (
              <>
                <Link
                  to="/manage-appointments"
                  className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
                >
                  Manage Appointments
                </Link>
                <Link
                  to="/Admin-Dashboard"
                  className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
                >
                  Admin Dashboard
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{userName}</span>
                <button
                  onClick={handleUserLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg shadow-md transition ease-in-out duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-yellow-300 hover:underline transition ease-in-out duration-300"
                >
                 Patient Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

     
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {userRole === 'patient' && (
              <>
                <Link
                  to="/appointment"
                  className="block text-white hover:bg-purple-700 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Appointment
                </Link>
                <Link
                  to="/my-appointments"
                  className="block text-white hover:bg-purple-700 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Appointments
                </Link>
              </>
            )}
            {userRole === 'doctor' && (
              <Link
                to="/manage-appointments"
                className="block text-white hover:bg-purple-700 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Appointments
              </Link>
            )}
            {userRole === 'super_admin' && (
              <>
                <Link
                  to="/manage-appointments"
                  className="block text-white hover:bg-purple-700 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Appointments
                </Link>
                <Link
                  to="/Admin-Dashboard"
                  className="block text-white hover:bg-purple-700 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-semibold">{userName}</span>
                <button
                  onClick={handleUserLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg shadow-md transition ease-in-out duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-white hover:bg-purple-700 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-white hover:bg-purple-700 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

