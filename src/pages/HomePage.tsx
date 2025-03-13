import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="mt-20 p-4">
                {/* YouTube Video */}
                <div className="max-w-4xl mx-auto mb-8">
                    <h2 className="text-2xl font-bold mb-4">Application Introduction</h2>
                    <div className="relative" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
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
                    <h2 className="text-2xl font-bold mb-4">How to Use</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold mb-2">Step 1: Sign Up</h3>
                            <p>Create an account to get started. You can sign up with your email.</p>
                        </div>
                        <div className="p-6 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold mb-2">Step 2: Verify Email</h3>
                            <p>Go to verify email for make your account is right.</p>
                        </div>
                        <div className="p-6 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold mb-2">Step 3: Add Your Line</h3>
                            <p>Add some line that you want to manage.</p>
                        </div>
                        <div className="p-6 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold mb-2">Step 4: Check Your Line</h3>
                            <p>Check your line in web site.</p>
                        </div>
                    </div>
                </div>
                
            </main>
        </div>
    );
};

export default HomePage;
