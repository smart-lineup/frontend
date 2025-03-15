import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UseAuth';
import { Sun, Moon, Settings, LogIn } from 'lucide-react';
import { useDarkMode } from './DarkModeContext';

const Navbar: React.FC = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const { username, isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleGoToManage = () => {
        navigate('/line');
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
        <header className="bg-white dark:bg-gray-800 shadow h-16 flex items-center justify-between px-6 transition-colors duration-200">
            <div className="text-xl font-bold dark:text-white">Smart Line Up</div>

            <div className="flex items-center space-x-2">
                {/* 다크모드 버튼 */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="다크모드 전환"
                >
                    {darkMode ? (
                        <Moon size={20} className="text-gray-600" />
                    ) : (
                        <Sun size={20} className="text-yellow-400" />
                    )}
                </button>

                {/* 관리하러가기 버튼 - 로그인 상태일 때만 표시 */}
                {isAuthenticated && (
                    <button
                        onClick={handleGoToManage}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Settings size={16} className="mr-1" />
                        <span>관리하러 가기</span>
                    </button>
                )}

                {/* 로그인 버튼 - 비로그인 상태일 때만 표시 */}
                {!isAuthenticated && (
                    <button
                        onClick={handleGoToLogin}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                        <LogIn size={16} className="mr-1" />
                        <span>로그인</span>
                    </button>
                )}

                {/* 사용자 프로필 - 로그인 상태일 때만 표시 */}
                {isAuthenticated && (
                    <div className="relative flex items-center ml-2">
                        <button
                            ref={buttonRef}
                            type="button"
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            aria-expanded={isDropdownOpen}
                            onClick={toggleDropdown}
                        >
                            <span className="sr-only">사용자 메뉴 열기</span>
                            <img
                                className="w-8 h-8 rounded-full"
                                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                alt="user photo"
                            />
                        </button>

                        {/* 드롭다운 메뉴 */}
                        {isDropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600 z-50"
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
        </header>
    );
};

export default Navbar;
