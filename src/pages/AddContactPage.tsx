
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import { findUserByUserId, addContact } from '../services/userService';
import { useAuth } from '../hooks/useAuth';

const AddContactPage: React.FC = () => {
    const [searchId, setSearchId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!user || !user.userId) return;
        if (searchId === user.userId) {
            setError("You cannot add yourself as a contact.");
            return;
        }

        setIsLoading(true);
        try {
            const foundUser = await findUserByUserId(searchId);
            if (foundUser) {
                await addContact(user.userId, foundUser.userId);
                setSuccessMessage(`Added ${foundUser.userId}! Redirecting to chat...`);
                setTimeout(() => {
                    navigate(`/chat/${foundUser.userId}`);
                }, 1500);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add contact.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout title="Add Contact">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-textPrimary mb-4">Find someone by their User ID</h2>
                <form onSubmit={handleAddContact} className="space-y-4">
                    <Input 
                        id="search-id"
                        label="User ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Enter a User ID"
                    />
                    <Button type="submit" isLoading={isLoading}>
                        Add Contact
                    </Button>
                </form>

                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                {successMessage && <p className="mt-4 text-center text-green-500">{successMessage}</p>}
            </div>
        </Layout>
    );
};

export default AddContactPage;