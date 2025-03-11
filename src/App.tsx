import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/login/LoginPage';
import Signup from './pages/login/Signup';
import VerifyEmailPage from './pages/login/VerifyEmailPage';
import FindIdPage from './pages/login/FindIdPage';
import FindPasswordPage from './pages/login/FindPasswordPage';
import ChangePasswordPage from './pages/login/ChangePasswordPage';
import HomePage from './pages/HomePage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/verify-email' element={<VerifyEmailPage />} />
          <Route path='/find/id' element={<FindIdPage />} />
          <Route path='/find/password' element={<FindPasswordPage />} />
          <Route path='/find/password/reset' element={<ChangePasswordPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
