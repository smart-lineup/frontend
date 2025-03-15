import React from 'react';
import Navbar from '../components/Navbar';
import { useDarkMode } from '../components/DarkModeContext';

const HomePage: React.FC = () => {
    const { darkMode } = useDarkMode();

    return (
        <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
            <Navbar />

            <main className="container mx-auto px-4 py-6 md:py-10 lg:mt-10">
                {/* YouTube Video */}
                <div className="max-w-4xl mx-auto mb-8">
                    <h2 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${darkMode ? 'dark:text-white' : 'text-gray-800'} transition-colors duration-200`}>
                        Application Introduction
                    </h2>
                    <div className="relative w-full rounded-lg overflow-hidden shadow-md" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src="https://www.youtube.com/embed/your-youtube-video-id" // Replace with your video ID
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* How-to-Use Section */}
                <div className="max-w-4xl mx-auto">
                    <h2 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${darkMode ? 'dark:text-white' : 'text-gray-800'} transition-colors duration-200`}>
                        How to Use
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                        <div className={`p-4 md:p-6 rounded-lg shadow-md ${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-white'}`}>
                            <h3 className="text-base md:text-lg font-semibold mb-2">Step 1: Sign Up</h3>
                            <p className="text-sm md:text-base">Create an account to get started. You can sign up with your email.</p>
                        </div>
                        <div className={`p-4 md:p-6 rounded-lg shadow-md ${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-white'}`}>
                            <h3 className="text-base md:text-lg font-semibold mb-2">Step 2: Verify Email</h3>
                            <p className="text-sm md:text-base">Go to verify email for make your account is right.</p>
                        </div>
                        <div className={`p-4 md:p-6 rounded-lg shadow-md ${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-white'}`}>
                            <h3 className="text-base md:text-lg font-semibold mb-2">Step 3: Add Your Line</h3>
                            <p className="text-sm md:text-base">Add some line that you want to manage.</p>
                        </div>
                        <div className={`p-4 md:p-6 rounded-lg shadow-md ${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-white'}`}>
                            <h3 className="text-base md:text-lg font-semibold mb-2">Step 4: Check Your Line</h3>
                            <p className="text-sm md:text-base">Check your line in web site.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;