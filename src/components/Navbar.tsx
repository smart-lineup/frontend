import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UseAuth';
import axios from "axios";

interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = () => {
    const navigate = useNavigate();
    const { username, isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleGoToManage = () => {
        navigate('/line');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button onClick={handleGoToHome} className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Smart LineUp
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center">
                            {isAuthenticated && (
                                <button
                                    onClick={handleGoToManage}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    관리하러 가기
                                </button>
                            )}
                            {/* Login button when not authenticated */}
                            {!isAuthenticated && (
                                <button
                                    onClick={handleGoToLogin}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
                                >
                                    로그인
                                </button>
                            )}
                            {/* User profile when authenticated */}
                            {isAuthenticated && (
                                <div className="relative flex items-center ms-3">
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
                                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                            alt="user photo"
                                        />
                                    </button>

                                    {/* Dropdown content */}
                                    {isDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                                            style={{ top: '100%' }}
                                        >
                                            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white" role="none">
                                                <div className="font-medium truncate">{username}</div>
                                            </div>
                                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-user-button">
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        세팅
                                                    </a>
                                                </li>
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
                    </div>
                </div>
            </nav>
            <div className="h-[66px]"></div>
        </>
    );
};

export default Navbar;
