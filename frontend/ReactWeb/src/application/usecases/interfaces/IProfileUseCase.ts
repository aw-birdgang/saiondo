import type {
  CreateProfileRequest,
  CreateProfileResponse,
  GetProfileRequest,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  DeleteProfileRequest,
  DeleteProfileResponse,
  SearchProfilesRequest,
  SearchProfilesResponse,
  GetProfileStatsRequest,
  GetProfileStatsResponse,
  UpdateProfileStatsRequest,
  UpdateProfileStatsResponse,
  FollowUserRequest,
  FollowUserResponse,
  UnfollowUserRequest,
  UnfollowUserResponse,
  GetFollowersRequest,
  GetFollowersResponse,
  GetFollowingRequest,
  GetFollowingResponse
} from '../../../domain/dto/ProfileDto';

export interface IProfileUseCase {
  // Basic CRUD operations
  createProfile(request: CreateProfileRequest): Promise<CreateProfileResponse>;
  getProfile(request: GetProfileRequest): Promise<GetProfileResponse>;
  updateProfile(request: UpdateProfileRequest): Promise<UpdateProfileResponse>;
  deleteProfile(request: DeleteProfileRequest): Promise<DeleteProfileResponse>;
  
  // Search operations
  searchProfiles(request: SearchProfilesRequest): Promise<SearchProfilesResponse>;
  
  // Stats operations
  getProfileStats(request: GetProfileStatsRequest): Promise<GetProfileStatsResponse>;
  updateProfileStats(request: UpdateProfileStatsRequest): Promise<UpdateProfileStatsResponse>;
  
  // Social operations
  followUser(request: FollowUserRequest): Promise<FollowUserResponse>;
  unfollowUser(request: UnfollowUserRequest): Promise<UnfollowUserResponse>;
  getFollowers(request: GetFollowersRequest): Promise<GetFollowersResponse>;
  getFollowing(request: GetFollowingRequest): Promise<GetFollowingResponse>;
  
  // Utility operations
  profileExists(userId: string): Promise<boolean>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getProfileCacheStats(): Promise<any>;
  clearProfileCache(userId?: string): Promise<boolean>;
  
  // Validation
  validateProfileRequest(request: CreateProfileRequest | UpdateProfileRequest): string[];
} 