import { ProfileEntity } from '@/domain/entities/Profile';
import type { Profile } from '@/domain/dto/ProfileDto';

describe('ProfileEntity', () => {
  const mockProfileData: Omit<
    Profile,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  > = {
    displayName: 'Test User',
    bio: 'This is a test bio',
    avatar: 'https://example.com/avatar.jpg',
    coverImage: 'https://example.com/cover.jpg',
    location: 'Seoul, Korea',
    website: 'https://example.com',
    socialLinks: {
      twitter: 'https://twitter.com/testuser',
      instagram: 'https://instagram.com/testuser',
      linkedin: 'https://linkedin.com/in/testuser',
      github: 'https://github.com/testuser',
    },
    preferences: {
      theme: 'auto',
      language: 'ko',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        showLastSeen: true,
      },
    },
    stats: {
      followersCount: 100,
      followingCount: 50,
      postsCount: 25,
      viewsCount: 1000,
    },
  };

  describe('create', () => {
    it('should create a new profile entity with valid data', () => {
      const profile = ProfileEntity.create('user123', mockProfileData);

      expect(profile).toBeInstanceOf(ProfileEntity);
      expect(profile.displayName).toBe('Test User');
      expect(profile.bio).toBe('This is a test bio');
      expect(profile.avatar).toBe('https://example.com/avatar.jpg');
      expect(profile.location).toBe('Seoul, Korea');
      expect(profile.website).toBe('https://example.com');
      expect(profile.socialLinks.twitter).toBe('https://twitter.com/testuser');
      expect(profile.preferences.theme).toBe('auto');
      expect(profile.stats.followersCount).toBe(100);
    });

    it('should generate a unique ID for new profile', () => {
      const profile1 = ProfileEntity.create('user123', mockProfileData);
      const profile2 = ProfileEntity.create('user456', mockProfileData);

      expect(profile1.id).toBeDefined();
      expect(profile2.id).toBeDefined();
      expect(profile1.id).not.toBe(profile2.id);
    });

    it('should set default values for optional fields', () => {
      const minimalData = {
        displayName: 'Test User',
      };
      const profile = ProfileEntity.create('user123', minimalData);

      expect(profile.bio).toBeUndefined();
      expect(profile.avatar).toBeUndefined();
      expect(profile.coverImage).toBeUndefined();
      expect(profile.location).toBeUndefined();
      expect(profile.website).toBeUndefined();
      expect(profile.socialLinks).toEqual({});
      expect(profile.preferences.theme).toBe('auto');
      expect(profile.preferences.language).toBe('ko');
      expect(profile.stats.followersCount).toBe(0);
    });
  });

  describe('fromData', () => {
    it('should create profile entity from existing data', () => {
      const existingData: Profile = {
        id: 'profile123',
        userId: 'user123',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        ...mockProfileData,
      };

      const profile = ProfileEntity.fromData(existingData);

      expect(profile.id).toBe('profile123');
      expect(profile.userId).toBe('user123');
      expect(profile.displayName).toBe('Test User');
      expect(profile.createdAt).toEqual(new Date('2023-01-01'));
      expect(profile.updatedAt).toEqual(new Date('2023-01-02'));
    });
  });

  describe('validation', () => {
    it('should throw error for empty display name', () => {
      expect(() => {
        ProfileEntity.create('user123', { displayName: '' });
      }).toThrow('Display name is required');
    });

    it('should throw error for display name longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => {
        ProfileEntity.create('user123', { displayName: longName });
      }).toThrow('Display name must be less than 50 characters');
    });

    it('should throw error for bio longer than 500 characters', () => {
      const longBio = 'a'.repeat(501);
      expect(() => {
        ProfileEntity.create('user123', {
          displayName: 'Test User',
          bio: longBio,
        });
      }).toThrow('Bio must be less than 500 characters');
    });

    it('should throw error for invalid website URL', () => {
      expect(() => {
        ProfileEntity.create('user123', {
          displayName: 'Test User',
          website: 'invalid-url',
        });
      }).toThrow('Invalid website URL');
    });

    it('should accept valid website URL', () => {
      expect(() => {
        ProfileEntity.create('user123', {
          displayName: 'Test User',
          website: 'https://example.com',
        });
      }).not.toThrow();
    });
  });

  describe('updateProfile', () => {
    it('should update profile with new data', () => {
      const profile = ProfileEntity.create('user123', mockProfileData);
      const updatedProfile = profile.updateProfile({
        displayName: 'Updated User',
        bio: 'Updated bio',
        location: 'Busan, Korea',
      });

      expect(updatedProfile.displayName).toBe('Updated User');
      expect(updatedProfile.bio).toBe('Updated bio');
      expect(updatedProfile.location).toBe('Busan, Korea');
      expect(updatedProfile.avatar).toBe('https://example.com/avatar.jpg'); // unchanged
      expect(updatedProfile.updatedAt.getTime()).toBeGreaterThan(
        profile.updatedAt.getTime()
      );
    });

    it('should preserve existing data when updating with partial data', () => {
      const profile = ProfileEntity.create('user123', mockProfileData);
      const updatedProfile = profile.updateProfile({
        displayName: 'Updated User',
      });

      expect(updatedProfile.displayName).toBe('Updated User');
      expect(updatedProfile.bio).toBe('This is a test bio'); // unchanged
      expect(updatedProfile.avatar).toBe('https://example.com/avatar.jpg'); // unchanged
    });
  });

  describe('updateStats', () => {
    it('should update profile stats', () => {
      const profile = ProfileEntity.create('user123', mockProfileData);
      const updatedProfile = profile.updateStats({
        followersCount: 200,
        postsCount: 30,
      });

      expect(updatedProfile.stats.followersCount).toBe(200);
      expect(updatedProfile.stats.postsCount).toBe(30);
      expect(updatedProfile.stats.followingCount).toBe(50); // unchanged
      expect(updatedProfile.stats.viewsCount).toBe(1000); // unchanged
    });
  });

  describe('business logic methods', () => {
    let profile: ProfileEntity;

    beforeEach(() => {
      profile = ProfileEntity.create('user123', mockProfileData);
    });

    it('should correctly identify public profile', () => {
      expect(profile.isPublic()).toBe(true);
    });

    it('should correctly identify private profile', () => {
      const privateProfile = profile.updateProfile({
        preferences: {
          ...profile.preferences,
          privacy: {
            ...profile.preferences.privacy,
            profileVisibility: 'private',
          },
        },
      });
      expect(privateProfile.isPrivate()).toBe(true);
    });

    it('should correctly identify friends-only profile', () => {
      const friendsProfile = profile.updateProfile({
        preferences: {
          ...profile.preferences,
          privacy: {
            ...profile.preferences.privacy,
            profileVisibility: 'friends',
          },
        },
      });
      expect(friendsProfile.isFriendsOnly()).toBe(true);
    });

    it('should check if profile can show online status', () => {
      expect(profile.canShowOnlineStatus()).toBe(true);
    });

    it('should check if profile can show last seen', () => {
      expect(profile.canShowLastSeen()).toBe(true);
    });

    it('should check if profile has social links', () => {
      expect(profile.hasSocialLinks()).toBe(true);
    });

    it('should count social links correctly', () => {
      expect(profile.getSocialLinksCount()).toBe(4);
    });

    it('should return 0 for social links count when no links', () => {
      const profileWithoutLinks = profile.updateProfile({
        socialLinks: {},
      });
      expect(profileWithoutLinks.getSocialLinksCount()).toBe(0);
    });
  });

  describe('toJSON', () => {
    it('should convert profile entity to JSON', () => {
      const profile = ProfileEntity.create('user123', mockProfileData);
      const json = profile.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('userId', 'user123');
      expect(json).toHaveProperty('displayName', 'Test User');
      expect(json).toHaveProperty('bio', 'This is a test bio');
      expect(json).toHaveProperty('avatar', 'https://example.com/avatar.jpg');
      expect(json).toHaveProperty('location', 'Seoul, Korea');
      expect(json).toHaveProperty('website', 'https://example.com');
      expect(json).toHaveProperty('socialLinks');
      expect(json).toHaveProperty('preferences');
      expect(json).toHaveProperty('stats');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });
});
