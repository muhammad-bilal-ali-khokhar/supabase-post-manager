"use client"
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../../utils/supabase';

const UserForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Generate a unique invite token
        const inviteToken = uuidv4();

        const { data, error } = await supabase
            .from('users')
            .insert([
                { name, email, status: 'inactive', invite_token: inviteToken }, // Set status as 'inactive'
            ]);

        if (error) {
            setErrorMessage('Error creating user: ' + error.message);
            return;
        }

        // Generate invite link
        const inviteLink = `${window.location.origin}/?token=${inviteToken}&email=${encodeURIComponent(email)}`;

        // Output the invite link to manually share with the user
        console.log('Invite Link:', inviteLink);

        // Reset form fields
        setName('');
        setEmail('');
        setSuccessMessage('User created successfully! Invite Link: ' + inviteLink);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">Create User and Generate Invite Link</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
                    Create User
                </button>
            </form>
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
    );
};

export default UserForm;
