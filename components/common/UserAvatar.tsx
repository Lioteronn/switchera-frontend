import React from 'react';

interface UserAvatarProps {
    userImage?: string | null;
    userName: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userImage, userName }) => {
    const fallbackImage = '/assets/react-logo.svg'; // Path to the fallback image

    return (
        <div className="flex items-center">
            <img
                src={userImage || fallbackImage}
                alt={userName}
                className="w-10 h-10 rounded-full"
            />
            <span className="ml-2 text-sm font-semibold">{userName}</span>
        </div>
    );
};

export default UserAvatar;