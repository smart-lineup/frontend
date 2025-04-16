"use client"

import type React from "react"
import { useState } from "react"
import type { Attendee } from "../../components/types"

interface AttendeeFormProps {
    isEditing: boolean
    editingAttendee: { queueId: number; attendee: Attendee } | null
    onSubmit: (phone: string, name: string, infoFields: { key: string; value: string }[]) => void
    onCancel: () => void
}

const AttendeeForm: React.FC<AttendeeFormProps> = ({ isEditing, editingAttendee, onSubmit, onCancel }) => {
    const [phone, setPhone] = useState(editingAttendee?.attendee.phone || "")
    const [name, setName] = useState(editingAttendee?.attendee.name || "손님")
    const [phoneError, setPhoneError] = useState<string | null>(null)
    const [infoFields, setInfoFields] = useState<{ key: string; value: string }[]>(
        editingAttendee ? parseAttendeeInfo(editingAttendee.attendee.info) : [{ key: "메모", value: "" }],
    )

    // 전화번호 유효성 검사 함수
    const validatePhone = (phoneNumber: string): boolean => {
        // 한국 휴대폰 번호 정규식 (010-XXXX-XXXX 또는 010XXXXXXXX 형식)
        const mobileRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
        return mobileRegex.test(phoneNumber)
    }

    // 전화번호 입력 핸들러
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPhone(value)

        // 값이 비어있으면 에러 메시지 초기화
        if (!value.trim()) {
            setPhoneError("전화번호를 입력해주세요")
            return
        }

        // 유효성 검사
        if (!validatePhone(value)) {
            setPhoneError("유효한 휴대폰 번호 형식이 아닙니다 (예: 010-1234-5678)")
        } else {
            setPhoneError(null)
        }
    }

    const handleAddInfoField = () => {
        setInfoFields([...infoFields, { key: "", value: "" }])
    }

    const handleRemoveInfoField = (index: number) => {
        setInfoFields(infoFields.filter((_, i) => i !== index))
    }

    const handleInfoFieldChange = (index: number, field: "key" | "value", value: string) => {
        const newFields = [...infoFields]
        newFields[index][field] = value
        setInfoFields(newFields)
    }

    const handleSubmit = () => {
        if (!phone.trim()) {
            setPhoneError("전화번호를 입력해주세요")
            return
        }

        if (phoneError) {
            // 전화번호 오류가 있으면 제출하지 않음
            return
        }

        onSubmit(phone, name, infoFields)
    }

    function parseAttendeeInfo(infoJson: string): { key: string; value: string }[] {
        try {
            const info = JSON.parse(infoJson)
            if (typeof info === "object" && info !== null) {
                return Object.entries(info).map(([key, value]) => ({ key, value: String(value) }))
            }
        } catch (e) {
            // 파싱 실패 시 기본값 반환
        }
        return [{ key: "메모", value: "" }]
    }

    return (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {isEditing ? "대기자 정보 수정" : "대기열에 추가하기"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                기다리고 있는 손님과 같은 번호가 있으면 추가할 수 없습니다.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
                        placeholder="손님 이름"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        전화번호
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 ${phoneError ? "border-red-500 dark:border-red-500" : ""
                            }`}
                        placeholder="010-1234-5678"
                        required
                    />
                    {phoneError && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{phoneError}</p>}
                </div>

                {/* Additional Info Fields */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">추가 정보</label>
                        <button
                            type="button"
                            onClick={handleAddInfoField}
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            + 필드 추가
                        </button>
                    </div>

                    <div className="space-y-2 max-w-full">
                        {infoFields.map((field, index) => (
                            <div key={index} className="flex gap-2 items-start w-full">
                                <input
                                    type="text"
                                    value={field.key}
                                    onChange={(e) => handleInfoFieldChange(index, "key", e.target.value)}
                                    placeholder="필드명"
                                    className="w-1/3 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 text-sm"
                                />
                                <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e) => handleInfoFieldChange(index, "value", e.target.value)}
                                    placeholder="값"
                                    className="w-2/3 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 text-sm"
                                />
                                {infoFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInfoField(index)}
                                        className="p-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                        aria-label="필드 삭제"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 ${phoneError || !phone.trim() ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                            } text-white rounded-md`}
                        disabled={!!phoneError || !phone.trim()}
                    >
                        {isEditing ? "수정" : "추가"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AttendeeForm
