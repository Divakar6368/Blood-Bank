import { Navigate, Route, Routes } from 'react-router'
import StartPage from './Pages/startpage'
import { useDispatch, useSelector } from 'react-redux';
import { SignUp } from './Pages/SignUp';
import { Login } from './Pages/Login';
import { HomePage } from './Pages/Home';
import { useEffect } from 'react';
import { checkAuth } from '../authslice';
import StoreDetails from './Pages/Store';
import AdminDashboard from './Pages/admin';
import BillingPage from './Pages/Billing';
import MyBookings from './Pages/my-bookings';
import MyProfile from './Pages/Profile';


function App() {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    authInitialized,
  } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
    return (
      <Routes>
        <Route path='/' element={<StartPage />}></Route>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />}></Route>
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUp></SignUp>}></Route>
        <Route path='/home' element={!isAuthenticated ? <Navigate to="/" /> : <HomePage />}></Route>
        <Route path='/admin' element={<AdminDashboard />}></Route>
        <Route path="/store/:storeId" element={<StoreDetails />} />
        <Route path="/:storeId/billing" element={<BillingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path='/profile' element={<MyProfile></MyProfile> }></Route>
      </Routes>
    )
  }

  export default App
