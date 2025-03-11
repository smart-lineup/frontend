import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import Modal from '../../components/Modal';

interface FindIdInput {
    email: string;
}

const FindIdPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FindIdInput>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalButtonColor, setModalButtonColor] = useState<string>("bg-blue-600 hover:bg-blue-500");
    const [modalButtonName, setModalButtonName] = useState<string>("확인");

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // If the email is found, navigate to login page
        if (modalTitle === "존재하는 아이디입니다") {
            navigate("/login");
        }
    };

    const onSubmit: SubmitHandler<FindIdInput> = async (data) => {
        try {
            const response = await axios.post(`${config.backend}/auth/find/id`, { email: data.email });

            setModalTitle("존재하는 아이디입니다");
            setModalMessage(response.data.message);
            setModalButtonColor("bg-green-600 hover:bg-green-500");
            setModalButtonName("로그인으로 가기");
            setIsModalOpen(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // If the email does not exist or some network error
                setModalTitle("아이디 찾기 실패!");
                setModalMessage("아이디가 존재하지 않습니다. 또는 네트워크 오류가 발생했습니다.");
                setModalButtonColor("bg-red-600 hover:bg-red-500");
                setModalButtonName("확인");
                setIsModalOpen(true);
            }
        }
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    아이디 찾기
                </h2>
                <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                    <button
                        onClick={handleGoToLogin}
                        className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                        로그인으로 가기
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mt-6">
                            <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">이메일</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    {...register("email", {
                                        required: "이메일을 입력해주세요.",
                                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "이메일 형식이 맞지 않습니다." }
                                    })}
                                    id='email'
                                    placeholder="user@example.com"
                                    type="email"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                                <div className={`${errors.email ? '' : 'hidden'} absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}>
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="mt-6">
                            <span className="block w-full rounded-md shadow-sm">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                                >
                                    {isSubmitting ? "조회 중..." : "아이디 찾기"}
                                </button>
                            </span> 
                        </div>
                        <div className='mt-4'>
                            <button
                                onClick={() => navigate('/find/password')}
                                className='hover:underline text-sm text-blue-500'
                            >
                                비밀번호 찾기
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                buttonColor={modalButtonColor}
                buttonName={modalButtonName}
            >
                <p className="text-sm text-gray-500">
                    {modalMessage}
                </p>
            </Modal>
        </div>
    );
};

export default FindIdPage;
