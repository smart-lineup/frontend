import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";
import axios from 'axios';
import config from '../../config';

export interface AttendeeFormData {
    name: string;
    phone: string;
    uuid: string;
}

const AttendeeInputPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { uuid } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
        watch
    } = useForm<AttendeeFormData>({
        defaultValues: {
            name: '',
            phone: '',
            uuid: uuid || ''
        },
        mode: 'onChange'
    });

    const handleFormSubmit = async (data: AttendeeFormData) => {
        setIsSubmitting(true);
        try {
            axios.post(config.backend + "/attendee/add", {
                name: data.name,
                phone: data.phone,
                uuid: data.uuid
            }, {
                withCredentials: true
            })
                .then((response) => {
                    console.log("Attendee added:", response.data);
                    return response.data;
                })
                .catch((e) => {
                    console.error("Error adding attendee:", e);
                    throw e;
                })
                .finally(() => {
                    reset();
                });
        } finally {
            setIsSubmitting(false);
        }
    };

    // For real-time phone number formatting
    const phone = watch('phone');

    // Format phone as user types
    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 7) {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        } else {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4 sm:mx-auto sm:max-w-md">
            <h2 className="text-xl font-semibold mb-6 dark:text-white text-center">대기열에 추가하기</h2>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 dark:text-gray-300">
                        이름
                    </label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="이름을 입력하세요"
                        {...register("name", {
                            required: "이름을 입력해주세요",
                            minLength: { value: 1, message: "이름은 최소 1자 이상이어야 합니다" }
                        })}
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 dark:text-gray-300">
                        전화번호
                    </label>
                    <div className="relative">
                        <input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="010-1234-5678"
                            {...register("phone", {
                                required: "전화번호를 입력해주세요",
                                pattern: {
                                    value: /^\d{3}-\d{3,4}-\d{4}$/,
                                    message: "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)"
                                }
                            })}
                            onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                e.target.value = formatted;
                                
                                register("phone").onChange({
                                    target: {
                                        name: "phone",
                                        value: formatted
                                    }
                                });
                            }}
                            
                        />
                        {phone && phone.length > 0 && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => reset({ ...watch(), phone: '' })}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {errors.phone && (
                        <p className="mt-2 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            !isValid || isSubmitting
                                ? 'bg-blue-300 text-white cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                처리중...
                            </span>
                        ) : (
                            '추가'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AttendeeInputPage;