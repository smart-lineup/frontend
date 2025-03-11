import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import Modal from '../../components/Modal';

interface FormInput {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const Signup: React.FC = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormInput>();

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            const response = await axios.post(`${config.backend}/auth/signup`, {
                name: data.name,
                email: data.email,
                password: data.password
            });
            
            setIsModalOpen(true);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 400) { // 중복 이메일 등의 에러 처리
                    alert(e.response?.data?.message || "계정 정보가 일치하지 않습니다.");
                    return;
                }
            }
            console.log(e);
            alert("예기치 못한 오류가 발생했습니다.");
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    계정 생성하기
                </h2>
                <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                    <a href={`${config.frontend}/login`} className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                        로그인으로 가기
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form method="POST" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">이름</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    {...register("name", { required: "이름을 입력해주세요.", maxLength: { value: 50, message: "최대 길이는 50자입니다." } })}
                                    placeholder="Your nick name"
                                    type="text" id='name'
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                                <div className={`${errors.name ? '' : 'hidden'} absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}>
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">비밀번호</label>
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
                            <label htmlFor="password_confirmation" className="block text-sm font-medium leading-5 text-gray-700">비밀번호 재입력</label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    {...register("passwordConfirm", {
                                        required: "비밀번호 재입력을 입력해주세요.",
                                        validate: value => value === getValues("password") || "비밀번호가 일치하지 않습니다."
                                    })}
                                    id='password_confirmation'
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
                                    {isSubmitting ? "제출 중..." : "회원가입"}
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Reusable Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title="회원가입 성공" 
                buttonColor="bg-green-600 hover:bg-green-500" 
                buttonName="로그인으로 가기"
            >
                <p className="text-sm text-gray-500">
                    성공적으로 회원가입에 성공하였습니다. 이메일을 확인해주세요
                </p>
            </Modal>
        </div>
    );
};

export default Signup;