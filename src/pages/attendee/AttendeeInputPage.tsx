"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import axios from "axios"
import config from "../../config"
import { Users, ArrowRight } from "lucide-react"

const AttendeeInputPage: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            phone: "",
        },
    })

    const phone = watch("phone")

    const formatPhoneNumber = (value: string) => {
        // 숫자만 추출
        const numbers = value.replace(/\D/g, "")

        // 숫자를 형식에 맞게 변환
        if (numbers.length <= 3) {
            return numbers
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
        }
    }

    useEffect(() => {
        const fetchLineInfo = async () => {
            if (!uuid) return

            setLoading(true)
            try {
                const canJoinResponse = await axios.get(`${config.backend}/attendee/${uuid}/can-join`)
                if (!canJoinResponse.data.canJoin) {
                    navigate("/attendee/full")
                    return
                }
            } catch (e) {
                console.error("Error checking if attendee can join:", e)
            } finally {
                setLoading(false)
            }
        }

        fetchLineInfo()
    }, [])

    const onSubmit = async (data: { name: string; phone: string }) => {
        try {
            setSubmitting(true)
            setError(null)

            const response = await axios.post(`${config.backend}/attendee/add`, {
                uuid,
                name: data.name,
                phone: data.phone,
            })
            if (response.data == "ok") {
                navigate(`/attendee/view/${uuid}?phone=${encodeURIComponent(data.phone)}`)
            } else {
                setError(response.data)
            }
        } catch (error: any) {
            console.error("Error adding attendee:", error)

            // 대기열이 가득 찼을 경우 full 페이지로 리다이렉션
            if (
                error.response &&
                error.response.status === 400 &&
                (error.response.data.message === "Queue is full" || error.response.data.message === "Cannot join queue")
            ) {
                navigate("/attendee/full")
                return
            }

            setError(error.response?.data?.message || "대기열에 추가하는데 실패했습니다.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">대기열에 참여하려면 아래 정보를 입력해주세요.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        이름
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                        placeholder="이름을 입력하세요"
                                        {...register("name", { required: "이름을 입력해주세요" })}
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
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
                                            className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                                            placeholder="010-1234-5678"
                                            {...register("phone", {
                                                required: "전화번호를 입력해주세요",
                                                pattern: {
                                                    value: /^\d{3}-\d{3,4}-\d{4}$/,
                                                    message: "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)",
                                                },
                                            })}
                                            onChange={(e) => {
                                                const formatted = formatPhoneNumber(e.target.value)
                                                e.target.value = formatted

                                                register("phone").onChange({
                                                    target: {
                                                        name: "phone",
                                                        value: formatted,
                                                    },
                                                })
                                            }}
                                        />
                                        {phone && phone.length > 0 && (
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => reset({ ...watch(), phone: "" })}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                                >
                                    {submitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            대기열에 참여하기
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendeeInputPage
