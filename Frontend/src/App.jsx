import { Route, Routes } from 'react-router'
import StartPage from './Pages/startpage'
import { useDispatch, useSelector } from 'react-redux';
import { SignUp } from './Pages/SignUp';
import { Login } from './Pages/Login';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  return (
    <Routes>
      <Route path='/' element={<StartPage />}></Route>
      {/* <Route path="/home" element={isAuthenticated?<HomePage/>:<Navigate to="/signup"/>}></Route> */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />}></Route>
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUp></SignUp>}></Route>
    </Routes>
  )
}

export default App
