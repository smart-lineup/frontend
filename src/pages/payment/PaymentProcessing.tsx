import axios from "axios";
import type React from "react"
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config";
import { CreditCard, RefreshCw } from "lucide-react"
import { useDarkMode } from "../../components/DarkModeContext";

const PaymentProcessing = () => {
    const location = useLocation();
    const naviagte = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const customerKey = queryParams.get("customerKey");
    const authKey = queryParams.get("authKey");
    const darkMode = useDarkMode();

    let isAlreadySend = false;
    useEffect(() => {
        if (!customerKey || !authKey) {
            naviagte("/payment/fail");
            return;
        };
        if (isAlreadySend) {
            return;
        }
        isAlreadySend = true;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ""
            return ""
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        async function process() {
            try {
                if (customerKey != "existing") {
                    await axios.post(config.backend + '/payment/issue/key', {
                        customerKey,
                        authKey
                    }, {
                        withCredentials: true
                    });
                }

                await axios.post(config.backend + '/payment/pay', {}, {
                    withCredentials: true
                });

                naviagte("/payment/pay/success");
            } catch (e) {
                console.log(e);
                naviagte("/payment/fail");
            }
        }
        process();
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                {/* 큰 원형 로딩 애니메이션 */}
                                <div className="w-24 h-24 rounded-full border-4 border-blue-100 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>

                                {/* 중앙에 카드 아이콘 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CreditCard className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-3">결제 진행중입니다</h1>

                        <div className="flex items-center justify-center mb-6">
                            <RefreshCw className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin mr-2" />
                            <p className="text-gray-600 dark:text-gray-400">잠시만 기다려주세요...</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                결제 정보를 처리하고 있습니다. 이 페이지를 닫지 마세요.
                            </p>
                        </div>

                        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
                            결제가 완료되면 자동으로 다음 페이지로 이동합니다.
                            <br />
                            문제가 발생하면 고객센터로 문의해주세요.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentProcessing;