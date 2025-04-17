"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { Sun, Moon, Settings, LogIn, Menu, X, MessageSquare, Beaker } from "lucide-react"
import { useDarkMode } from "./DarkModeContext"
import config from "../config"
import axios from "axios"
import profile from "../assets/images/profile.png"

const Navbar: React.FC = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const navigate = useNavigate()
    const { username, isAuthenticated, logout, isPremium, fetchUser } = useAuth()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState<"success" | "error">("success")

    const handleGoToManage = () => {
        navigate("/line")
        setIsMobileMenuOpen(false)
    }

    const handleGoToLogin = () => {
        navigate("/login")
        setIsMobileMenuOpen(false)
    }

    const handleGoToPricing = () => {
        navigate("/pricing")
        setIsMobileMenuOpen(false)
    }

    const handleGoToFeedback = () => {
        navigate("/feedback")
        setIsMobileMenuOpen(false)
    }

    const handleLogout = async () => {
        await logout()
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)
        navigate("/")
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleBetaTest = async () => {
        try {
            await axios.post(
                `${config.backend}/user/apply/beta`,
                {},
                {
                    withCredentials: true,
                },
            )
            // 성공 시 모달 표시
            setModalMessage("베타테스트 신청이 완료되었습니다. 감사합니다!")
            setModalType("success")
            setShowModal(true)
            await fetchUser();
        } catch (e) {
            console.error(e)
            // 실패 시 모달 표시
            setModalMessage("베타테스트 신청 중 오류가 발생했습니다. 다시 시도해주세요.")
            setModalType("error")
            setShowModal(true)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <header className="bg-white dark:bg-gray-800 shadow h-16 flex items-center justify-between px-4 md:px-6 transition-colors duration-200">
            <div className="text-lg md:text-xl font-bold dark:text-white">
                <Link to="/">Smart Line Up</Link>
            </div>

            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
            >
                {isMobileMenuOpen ? (
                    <X size={24} className="text-gray-600 dark:text-gray-200" />
                ) : (
                    <Menu size={24} className="text-gray-600 dark:text-gray-200" />
                )}
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-2">
                {/* Dark mode button */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? (
                        <Moon size={20} className="text-gray-600 dark:text-gray-200" />
                    ) : (
                        <Sun size={20} className="text-yellow-400" />
                    )}
                </button>

                {/* Feedback button */}
                <button
                    onClick={handleGoToFeedback}
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                    <MessageSquare size={16} className="mr-1" />
                    <span>건의하기</span>
                </button>

                {/* Manage button - only when authenticated */}
                {isAuthenticated && (
                    <button
                        onClick={handleGoToManage}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Settings size={16} className="mr-1" />
                        <span>관리하러 가기</span>
                    </button>
                )}

                {/* Subscribe button - only when authenticated and not premium */}
                {isAuthenticated && !isPremium && (
                    <button
                        onClick={handleBetaTest}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                        <Beaker size={16} className="mr-1" />
                        <span>베타테스트 신청하기</span>
                    </button>
                )}

                {/* 이전 구독하기 버튼 (주석 처리)
                    {isAuthenticated && !isPremium && (
                    <button
                        onClick={handleGoToPricing}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                        <CreditCard size={16} className="mr-1" />
                        <span>구독하기</span>
                    </button>
                    )}
                */}

                {/* Login button - only when not authenticated */}
                {!isAuthenticated && (
                    <button
                        onClick={handleGoToLogin}
                        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                        <LogIn size={16} className="mr-1" />
                        <span>로그인</span>
                    </button>
                )}

                {/* User profile - only when authenticated */}
                {isAuthenticated && (
                    <div className="relative flex items-center ml-2">
                        <button
                            ref={buttonRef}
                            type="button"
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            aria-expanded={isDropdownOpen}
                            onClick={toggleDropdown}
                        >
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="w-8 h-8 rounded-full"
                                src={profile}
                                alt="user photo"
                            />
                        </button>

                        {/* Desktop dropdown menu */}
                        {isDropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600 z-50"
                                style={{ top: "100%" }}
                            >
                                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white" role="none">
                                    <div className="font-medium truncate">{username}</div>
                                    {isPremium && <div className="text-xs mt-1 text-green-600 dark:text-green-400">프리미엄 구독자</div>}
                                </div>
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-user-button">
                                    <li>
                                        <Link
                                            to="/settings?tab=profile"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem"
                                        >
                                            계정 설정
                                        </Link>
                                    </li>
                                    {!isPremium && (
                                        <li>
                                            <button
                                                onClick={handleBetaTest}
                                                className="block px-4 py-2 text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-green-700 dark:hover:text-green-300"
                                                role="menuitem"
                                            >
                                                베타테스트 신청하기
                                            </button>
                                        </li>
                                    )}

                                    {/* 이전 프리미엄 업그레이드 링크 (주석 처리)
                                        {!isPremium && (
                                            <li>
                                            <Link
                                                to="/pricing"
                                                className="block px-4 py-2 text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-green-700 dark:hover:text-green-300"
                                                role="menuitem"
                                            >
                                                프리미엄으로 업그레이드
                                            </Link>
                                            </li>
                                        )}
                                    */}
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
                                            role="menuitem"
                                        >
                                            로그아웃
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50 md:hidden">
                    <div className="flex flex-col p-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <span>다크모드</span>
                            {darkMode ? (
                                <Moon size={20} className="text-gray-600 dark:text-gray-200" />
                            ) : (
                                <Sun size={20} className="text-yellow-400" />
                            )}
                        </button>

                        {/* Feedback button */}
                        <button
                            onClick={handleGoToFeedback}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <span>건의하기</span>
                            <MessageSquare size={16} />
                        </button>

                        {/* Manage button - only when authenticated */}
                        {isAuthenticated && (
                            <button
                                onClick={handleGoToManage}
                                className="flex items-center justify-between px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <span>관리하러 가기</span>
                                <Settings size={16} />
                            </button>
                        )}

                        {/* Subscribe button - only when authenticated and not premium */}
                        {isAuthenticated && !isPremium && (
                            <button
                                onClick={handleBetaTest}
                                className="flex items-center justify-between px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <span>베타테스트 신청하기</span>
                                <Beaker size={16} />
                            </button>
                        )}

                        {/* 이전 구독하기 버튼 (주석 처리)
                            {isAuthenticated && !isPremium && (
                            <button
                                onClick={handleGoToPricing}
                                className="flex items-center justify-between px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <span>구독하기</span>
                                <CreditCard size={16} />
                            </button>
                            )}
                        */}

                        {/* Login button - only when not authenticated */}
                        {!isAuthenticated && (
                            <button
                                onClick={handleGoToLogin}
                                className="flex items-center justify-between px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                <span>로그인</span>
                                <LogIn size={16} />
                            </button>
                        )}

                        {/* User options - only when authenticated */}
                        {isAuthenticated && (
                            <>
                                <div className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200">
                                    <img
                                        className="w-8 h-8 rounded-full mr-2"
                                        src={profile}
                                        alt="user photo"
                                    />
                                    <div>
                                        <div className="font-medium truncate">{username}</div>
                                        {isPremium && <div className="text-xs text-green-600 dark:text-green-400">프리미엄 구독자</div>}
                                    </div>
                                </div>
                                <Link
                                    to="/settings?tab=profile"
                                    className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                    계정 설정
                                </Link>
                                {!isPremium && (
                                    <button
                                        onClick={handleBetaTest}
                                        className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400"
                                    >
                                        베타테스트 신청하기
                                    </button>
                                )}

                                {/* 이전 프리미엄 업그레이드 링크 (주석 처리)
                                    {!isPremium && (
                                    <Link
                                        to="/pricing"
                                        className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400"
                                    >
                                        프리미엄으로 업그레이드
                                    </Link>
                                    )}
                                */}
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left"
                                >
                                    로그아웃
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* 베타테스트 신청 결과 모달 */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl ${modalType === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center">
                            {modalType === "success" ? (
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-green-600 dark:text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            ) : (
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-red-600 dark:text-red-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            )}
                            <div className="ml-4">
                                <h3
                                    className={`text-lg font-medium ${modalType === "success" ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                                        }`}
                                >
                                    {modalType === "success" ? "성공" : "오류"}
                                </h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{modalMessage}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className={`px-4 py-2 ${modalType === "success" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                    } text-white rounded-md`}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
