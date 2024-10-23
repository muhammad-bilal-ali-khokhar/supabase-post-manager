"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
const Home = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);

    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const emailParam = query.get('email');

    
  const pathname = usePathname();
  const isInvitedUser = pathname.includes(query || emailParam)
    useEffect(() => {
        const checkInviteToken = async () => {
            if (token && emailParam) {
                setEmail(emailParam);
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', emailParam)
                    .eq('invite_token', token)
                    .single();

                if (user && !error) {
                    if (user.status === 'inactive') {
                        setIsTokenValid(true);
                    } else {
                        setErrorMessage('This invite link is no longer valid.');
                    }
                } else {
                    setErrorMessage('Invalid invite link.');
                }
            }
        };

        checkInviteToken();
    }, [token, emailParam]);

    // Handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();

        // If the user is trying to log in with the invited link
        if (isTokenValid) {
            // Update user status and password
            const { error: updateError } = await supabase
                .from('users')
                .update({ status: 'active', password }) // Update status and password
                .eq('email', email);

            if (updateError) {
                setErrorMessage('Error updating user status: ' + updateError.message);
                return;
            }
            router.replace('/users');
            setSuccessMessage('User logged in successfully and status updated to active.');
            return;
        }

        // If user is trying to log in with email and password
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user || error) {
            setErrorMessage('Invalid email or password.');
            return;
        }

        if (user.password !== password) {
            setErrorMessage('Invalid email or password.');
            return;
        }

        if (user.status === 'inactive') {
            setErrorMessage('This account is not active. Please check your email for the activation link.');
            return;
        }

        // If all checks pass, update status to active
        const { error: updateError } = await supabase
            .from('users')
            .update({ status: 'active' }) // Update status to active
            .eq('id', user.id);

        if (updateError) {
            setErrorMessage('Error updating user status: ' + updateError.message);
            return;
        }
        router.replace('/users');
        setSuccessMessage('User logged in successfully and status updated to active.');
    };

    const renderForm = () => {
        if (!isTokenValid && !isInvitedUser && errorMessage) {
            return <p className="text-red-500">{errorMessage}</p>;
        }

        return (
            <>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            readOnly={!isInvitedUser}
                            className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </>
        );
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {renderForm()}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            
        </div>
    );
};

export default Home;
