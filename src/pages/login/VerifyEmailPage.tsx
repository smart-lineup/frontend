import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { useState, useRef } from "react";
import config from '../../config';

interface VerifyEmailResponse {
    message: string;
}

const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const isVerified = useRef(false);

    const verify = async () => {
        if (isVerified.current) return;
        isVerified.current = true;

        try {
            const token = searchParams.get("token");
            if (!token) {
                setStatus("error");
                return;
            }

            await axios.post<VerifyEmailResponse>(
                `${config.backend}/auth/verify-email`,
                { token: token }
            );

            setStatus("success");
            return;
        } catch (e) {
            console.error("Fail to Verify:", e);
            setStatus("error");
            return;
        }
    };

    verify(); 

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="w-full max-w-2xl p-4 bg-white shadow-2xl dark:bg-gray-900 sm:p-10 sm:rounded-3xl">
                {status === "loading" && (
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400 verifying"></h1>
                    </div>
                )}
                {status === "success" && (
                    <Success />
                )}
                {status === "error" && (
                    <h1 className="text-4xl font-extrabold text-red-700 dark:text-red-400">
                        ❌ 이메일 인증에 실패하였습니다. ❌<br />계속해서 문제가 발생하면 아래 이메일로 문의해주세요.<br />
                        <a href="mailto:aaa@gmail.com" className="text-blue-600 underline">pkt0758@gmail.com</a>
                    </h1>
                )}
            </div>
        </div>
    );
};

const Success = () => {
    return (
        <>
            <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full dark:bg-green-700">
                    <svg className="h-12 w-12 text-green-600 dark:text-green-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </div>
                <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400">이메일 인증 성공</h1>
                <p className="mt-4 text-lg text-gray-800 dark:text-gray-300">
                    이제 사이트를 이용하실 수 있습니다.
                </p>
            </div>
            <div className="mt-8 text-center">
                <a href="/"
                    className="inline-block px-6 py-2 text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-600 dark:hover:to-blue-600">
                    홈으로 돌아가기
                </a>
            </div>
        </>
    );
}

export default VerifyEmailPage;