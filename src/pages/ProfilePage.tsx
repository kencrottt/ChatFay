
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../services/userService';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';

const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setSuccessMessage('');
        setError('');
        
        try {
            const updatedUser = await updateProfile(user.id, { 
                displayName, 
                avatarUrl: avatarUrl.trim() === '' ? null : avatarUrl.trim()
            });
            setUser(updatedUser); // Update user in global context
            setSuccessMessage('Profile updated successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <Layout title="Profile"><p>Loading...</p></Layout>;
    }

    return (
        <Layout title="Profile">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center p-4"
            >
                <div className="relative mb-6">
                    <Avatar displayName={user.displayName} avatarUrl={user.avatarUrl} size="lg" />
                </div>
                
                <div className="w-full max-w-md text-center mb-8">
                    <h2 className="text-2xl font-bold text-textPrimary">{user.displayName}</h2>
                    <p className="text-textSecondary">@{user.userId}</p>
                    <p className="text-textSecondary text-sm">{user.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <h3 className="text-lg font-semibold text-textPrimary border-b pb-2">Edit Profile</h3>
                    <Input 
                        id="displayName"
                        label="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                    <Input 
                        id="avatarUrl"
                        label="Avatar URL (optional)"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/image.png"
                    />
                    <Button type="submit" isLoading={isLoading}>
                        Save Changes
                    </Button>
                    {successMessage && <p className="text-green-500 text-center mt-2">{successMessage}</p>}
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </form>
            </motion.div>
        </Layout>
    );
};

export default ProfilePage;