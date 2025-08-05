import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from '../../common';
import { useProfileStore } from '../../../../stores/profileStore';
import type { Profile } from '../../../../domain/dto/ProfileDto';

interface ProfileSearchProps {
  onProfileSelect?: (profile: Profile) => void;
  className?: string;
}

const ProfileSearch: React.FC<ProfileSearchProps> = ({
  onProfileSelect,
  className = '',
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    hasSocialLinks: false,
    profileVisibility: 'public' as 'public' | 'private' | 'friends',
  });

  const { searchProfiles } = useProfileStore();

  // 디바운스된 검색
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, searchFilters: typeof filters) => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchProfiles({
          query: searchQuery,
          limit: 20,
          offset: 0,
          filters: searchFilters,
        });

        if (response.success) {
          setSearchResults(response.profiles);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [searchProfiles]
  );

  // 검색어나 필터가 변경될 때 검색 실행
  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(query, filters);
  };

  const handleProfileClick = (profile: Profile) => {
    onProfileSelect?.(profile);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('search_profiles')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className='space-y-4'>
          <div className='relative'>
            <Input
              type='text'
              placeholder={t('search_profiles_placeholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className='pr-10'
            />
            {query && (
              <button
                type='button'
                onClick={clearSearch}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>

          {/* 필터 옵션 */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('location')}
              </label>
              <Input
                type='text'
                placeholder={t('location_placeholder')}
                value={filters.location}
                onChange={e =>
                  setFilters(prev => ({ ...prev, location: e.target.value }))
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('profile_visibility')}
              </label>
              <select
                value={filters.profileVisibility}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    profileVisibility: e.target.value as
                      | 'public'
                      | 'private'
                      | 'friends',
                  }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='public'>{t('public')}</option>
                <option value='private'>{t('private')}</option>
                <option value='friends'>{t('friends_only')}</option>
              </select>
            </div>

            <div className='flex items-center'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={filters.hasSocialLinks}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      hasSocialLinks: e.target.checked,
                    }))
                  }
                  className='mr-2'
                />
                <span className='text-sm text-gray-700'>
                  {t('has_social_links')}
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* 검색 결과 */}
        <div className='space-y-2'>
          {isSearching && (
            <div className='text-center py-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='text-sm text-gray-500 mt-2'>{t('searching')}</p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div>
              <h3 className='text-sm font-medium text-gray-700 mb-2'>
                {t('search_results')} ({searchResults.length})
              </h3>
              <div className='space-y-2 max-h-96 overflow-y-auto'>
                {searchResults.map(profile => (
                  <ProfileSearchResult
                    key={profile.id}
                    profile={profile}
                    onClick={() => handleProfileClick(profile)}
                  />
                ))}
              </div>
            </div>
          )}

          {!isSearching && query && searchResults.length === 0 && (
            <div className='text-center py-4'>
              <p className='text-gray-500'>{t('no_search_results')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 검색 결과 아이템 컴포넌트
interface ProfileSearchResultProps {
  profile: Profile;
  onClick: () => void;
}

const ProfileSearchResult: React.FC<ProfileSearchResultProps> = ({
  profile,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className='flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
      onClick={onClick}
    >
      <div className='flex-shrink-0'>
        <div className='w-12 h-12 bg-gray-200 rounded-full overflow-hidden'>
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold'>
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 min-w-0'>
        <h4 className='text-sm font-medium text-gray-900 truncate'>
          {profile.displayName}
        </h4>
        {profile.bio && (
          <p className='text-sm text-gray-500 truncate'>{profile.bio}</p>
        )}
        <div className='flex items-center space-x-4 mt-1 text-xs text-gray-500'>
          {profile.location && (
            <span className='flex items-center'>
              <svg
                className='w-3 h-3 mr-1'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                  clipRule='evenodd'
                />
              </svg>
              {profile.location}
            </span>
          )}
          <span>
            {profile.stats.followersCount} {t('followers')}
          </span>
          <span>
            {profile.stats.postsCount} {t('posts')}
          </span>
        </div>
      </div>

      <div className='flex-shrink-0'>
        <Button variant='outline' size='sm'>
          {t('view_profile')}
        </Button>
      </div>
    </div>
  );
};

// 디바운스 유틸리티 함수
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default ProfileSearch;
