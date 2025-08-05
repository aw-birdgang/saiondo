import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../common';

interface ProfilePostsProps {
  posts: any[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts }) => {
  const { t } = useTranslation();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('no_posts_yet')}
        </h3>
        <p className="text-gray-500">
          {t('no_posts_description')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {post.author?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {post.author || t('unknown_author')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">
                  {post.content || t('no_content')}
                </p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>{post.comments || 0}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span>{t('share')}</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfilePosts; 