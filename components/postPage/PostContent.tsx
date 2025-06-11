import React from 'react';

interface PostContentProps {
    title: string;
    categories: string[];
    description: string;
}

const PostContent: React.FC<PostContentProps> = ({ title, categories, description }) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <div className="flex flex-wrap mb-4">
                {categories.map((category, index) => (
                    <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {category}
                    </span>
                ))}
            </div>
            <p className="text-gray-700">{description}</p>
        </div>
    );
};

export default PostContent;