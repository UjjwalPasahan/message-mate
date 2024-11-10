"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useAuthStore } from "./zustand/useAuthStore";

const Auth = () => {
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { authName, isAuthenticated, updateAuthName } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && authName) {
            router.replace('/chat');
        }
    }, [isAuthenticated, authName, router]);

    const signUpFunc = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/auth/signup', {
                username,
                password
            }, { withCredentials: true });

            if(res.data.msg === "User already exists") {
                alert('User already exists');
            } else {
                updateAuthName(username);
                router.replace('/chat')
            }
 
        } catch (error) {
            console.error("Error in signup function:", error.response?.data?.msg || error.message);
            alert(error.response?.data?.msg || "Signup failed");
        }
    };

    const loginFunc = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/auth/login', {
                username,
                password
            }, { withCredentials: true });
            
            updateAuthName(username);
            router.replace('/chat')
        } catch (error) {
            console.error("Error in login function:", error.response?.data?.msg || error.message);
            alert(error.response?.data?.msg || "Login failed");
        }
    };

    // If already authenticated, don't render the form
    if (isAuthenticated && authName) {
        return null;
    }

    return (
        <div className="mt-[30%] min-h-screen flex items-center justify-center ">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign up or login to continue</p>
                </div>
                <form className="mt-8 space-y-6" >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <div className="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            onClick={signUpFunc}
                            className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign Up
                        </button>
                        <button
                            type="submit"
                            onClick={loginFunc}
                            className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Auth;