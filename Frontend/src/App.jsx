import { Route,Routes } from 'react-router'
import StartPage from './Pages/startpage'

function App() {
  return(
    <Routes>
      <Route path='/' element={<StartPage/>}></Route>
    </Routes>
  )
}

export default App
