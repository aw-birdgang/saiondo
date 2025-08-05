import React from 'react';
import { UserAvatar, HeartIcon } from '../common';

interface User {
  name: string;
  profileUrl?: string;
  mbti?: string;
}

interface CoupleProfileProps {
  user1: User;
  user2: User;
  className?: string;
}

const CoupleProfile: React.FC<CoupleProfileProps> = ({
  user1,
  user2,
  className = '',
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 shadow-lg border border-primary/20 ${className}`}
    >
      <div className='flex items-center justify-center space-x-8 mb-8'>
        <div className='text-center'>
          <UserAvatar
            name={user1.name}
            profileUrl={user1.profileUrl}
            size='lg'
          />
          <p className='text-sm font-medium text-txt mt-3 leading-tight'>
            {user1.name}
          </p>
          {user1.mbti && (
            <span className='inline-block px-3 py-1.5 bg-secondary text-txt-secondary text-xs rounded-full mt-2 font-medium'>
              {user1.mbti}
            </span>
          )}
        </div>

        <div className='flex flex-col items-center'>
          <HeartIcon size='lg' animated={true} />
          <p className='text-xs text-txt-secondary mt-3 font-medium'>커플</p>
        </div>

        <div className='text-center'>
          <UserAvatar
            name={user2.name}
            profileUrl={user2.profileUrl}
            size='lg'
          />
          <p className='text-sm font-medium text-txt mt-3 leading-tight'>
            {user2.name}
          </p>
          {user2.mbti && (
            <span className='inline-block px-3 py-1.5 bg-secondary text-txt-secondary text-xs rounded-full mt-2 font-medium'>
              {user2.mbti}
            </span>
          )}
        </div>
      </div>

      <div className='text-center'>
        <h2 className='text-2xl font-bold text-txt mb-3 leading-tight'>
          {user1.name} & {user2.name}
        </h2>
        {user1.mbti && user2.mbti && (
          <p className='text-sm text-txt-secondary leading-relaxed'>
            {user1.mbti} × {user2.mbti} 조합
          </p>
        )}
      </div>
    </div>
  );
};

export default CoupleProfile;
