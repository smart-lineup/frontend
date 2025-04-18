import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import Modal from '../../components/Modal';

interface ChangePasswordInput {
    email: string;
    password: string;
    passwordConfirm: string;
}

const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || ''; // Get email from query params
    const token = searchParams.get("token") || ''; // Get token from query params
    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<ChangePasswordInput>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalButtonColor, setModalButtonColor] = useState<string>("bg-blue-600 hover:bg-blue-500");
    const [modalButtonName, setModalButtonName] = useState<string>("확인");

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // If the change is successful, navigate to login page
        if (modalTitle === "비밀번호 변경 성공!") {
            navigate('/login');
        }
    };

    const onSubmit: SubmitHandler<ChangePasswordInput> = async (data) => {
        try {
            await axios.post(`${config.backend}/auth/password/reset`, { email: email, token: token, password: data.password });
            setModalTitle("비밀번호 변경 성공!");
            setModalMessage("비밀번호 변경에 성공했습니다.");
            setModalButtonColor("bg-green-600 hover:bg-green-500");
            setModalButtonName("로그인으로 가기");
            setIsModalOpen(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // If the change is failed.
                setModalTitle("비밀번호 변경 실패!");
                setModalMessage("비밀번호 변경에 실패했습니다.");
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
                    비밀번호 변경
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
                            <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">새 비밀번호</label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    {...register("password", {
                                        required: "비밀번호를 입력해주세요.",
                                        pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                            message: "비밀번호는 최소 8자 이상, 문자와 숫자, 특수문자를 최소 1개씩 이상 함께 사용해야 합니다."
                                        }
                                    })}
                                    id='password'
                                    type="password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <div className="mt-6">
                            <label htmlFor="passwordConfirm" className="block text-sm font-medium leading-5 text-gray-700">새 비밀번호 재입력</label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    {...register("passwordConfirm", {
                                        required: "비밀번호 재입력을 입력해주세요.",
                                        validate: value => value === getValues("password") || "비밀번호가 일치하지 않습니다."
                                    })}
                                    id='passwordConfirm'
                                    type="password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>
                            {errors.passwordConfirm && <p className="mt-2 text-sm text-red-600">{errors.passwordConfirm.message}</p>}
                        </div>

                        <div className="mt-6">
                            <span className="block w-full rounded-md shadow-sm">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                                >
                                    {isSubmitting ? "변경 중..." : "비밀번호 변경하기"}
                                </button>
                            </span>
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

export default ChangePasswordPage;
