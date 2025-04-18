import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/login/LoginPage';
import Signup from './pages/login/Signup';
import VerifyEmailPage from './pages/login/VerifyEmailPage';
import FindIdPage from './pages/login/FindIdPage';
import FindPasswordPage from './pages/login/FindPasswordPage';
import ChangePasswordPage from './pages/login/ChangePasswordPage';
import HomePage from './pages/HomePage';
import LinePage from './pages/line/LinePage';
import { DarkModeProvider } from './components/DarkModeContext';
import AttendeeInputPage from './pages/attendee/AttendeeInputPage';
import { AuthProvider } from './components/AuthContext';
// import PaymentPage from './pages/payment/PaymentPage';
import PaymentProcessing from './pages/payment/PaymentProcessing';
import PaymentSuccessPage from './pages/payment/PaymentSuccess';
import PricingPage from './pages/payment/Pricing';
import SettingsPage from './pages/settings/SettingsPage';
import FeedbackPage from './pages/feedback/feedback';
import AttendeeFullPage from './pages/attendee/AttendeeFullPage';
import AttendeeView from './pages/attendee/AttendeeView';
import CancelPage from './pages/attendee/CancelPage';
import BetaInfoPage from './pages/beta/BetaInfoPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <DarkModeProvider>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/line' element={<LinePage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/verify-email' element={<VerifyEmailPage />} />
                        <Route path='/attendee/:uuid' element={<AttendeeInputPage />} />
                        <Route path='/find/id' element={<FindIdPage />} />
                        <Route path='/find/password' element={<FindPasswordPage />} />
                        <Route path='/find/password/reset' element={<ChangePasswordPage />} />
                        <Route path='/pricing' element={<PricingPage />} />
                        {/* <Route path='/payment' element={<PaymentPage/>} /> */}
                        <Route path='/payment' element={<BetaInfoPage/>} />
                        <Route path='/payment/success' element={<PaymentProcessing />} />
                        <Route path='/payment/pay/success' element={<PaymentSuccessPage />} />
                        <Route path='/settings' element={<SettingsPage/>}/>
                        <Route path="/feedback" element={<FeedbackPage />} />
                        <Route path="/attendee/full" element={<AttendeeFullPage />} />
                        <Route path="/attendee/view/:uuid" element={<AttendeeView />} />
                        <Route path="/cancel" element={<CancelPage />} />
                        <Route path='/beta' element={< BetaInfoPage />} />
                    </Routes>
                </DarkModeProvider>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
