import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '../src/modules/user/user.services';
import { WalletService } from '../src/modules/wallet/wallet.service';
import { RedisService } from '../src/common/redis/redis.service';
import { RelationalUserRepository } from '../src/database/user/infrastructure/persistence/relational/repositories/user.repository';
import { CreateUserDto, Gender } from '../src/modules/user/dto/user.dto';
import { User } from '../src/database/user/domain/user';

describe('UserService', () => {
  let service: UserService;
  let userRepository: RelationalUserRepository;
  let walletService: WalletService;
  let redisService: RedisService;

  const mockUser: User = {
    id: 'test-user-id',
    name: 'Test User',
    gender: Gender.MALE,
    birthDate: new Date('1990-01-01'),
    email: 'test@example.com',
    password: 'hashedPassword',
    fcmToken: 'test-fcm-token',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    point: 0,
    walletId: null,
    wallet: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: RelationalUserRepository,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findWithRelations: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: WalletService,
          useValue: {
            createWalletForUser: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<RelationalUserRepository>(RelationalUserRepository);
    walletService = module.get<WalletService>(WalletService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(userRepository, 'findAll').mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        gender: Gender.MALE,
        birthDate: '1990-01-01',
        email: 'test@example.com',
        password: 'password123',
        fcmToken: 'test-fcm-token',
      };

      jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser);
      jest.spyOn(walletService, 'createWalletForUser').mockResolvedValue({} as any);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        gender: createUserDto.gender,
        birthDate: new Date(createUserDto.birthDate),
        email: createUserDto.email,
        password: createUserDto.password,
        fcmToken: createUserDto.fcmToken,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
        point: 0,
        walletId: null,
        wallet: null,
      });
      expect(walletService.createWalletForUser).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw BadRequestException when name is missing', async () => {
      const createUserDto: CreateUserDto = {
        name: '',
        gender: Gender.MALE,
        birthDate: '1990-01-01',
        email: 'test@example.com',
        password: 'password123',
        fcmToken: 'test-fcm-token',
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when gender is missing', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        gender: undefined as any,
        birthDate: '1990-01-01',
        email: 'test@example.com',
        password: 'password123',
        fcmToken: 'test-fcm-token',
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return user from cache if available', async () => {
      const userId = 'test-user-id';
      const cachedUser = JSON.stringify(mockUser);

      jest.spyOn(redisService, 'get').mockResolvedValue(cachedUser);

      const result = await service.findById(userId);

      expect(result).toEqual(mockUser);
      expect(redisService.get).toHaveBeenCalledWith(`user:${userId}`);
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should fetch user from database and cache it if not in cache', async () => {
      const userId = 'test-user-id';

      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(redisService, 'set').mockResolvedValue('OK');

      const result = await service.findById(userId);

      expect(result).toEqual(mockUser);
      expect(redisService.get).toHaveBeenCalledWith(`user:${userId}`);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(redisService.set).toHaveBeenCalledWith(
        `user:${userId}`,
        JSON.stringify(mockUser),
        'EX',
        60 * 10,
      );
    });

    it('should return null if user not found', async () => {
      const userId = 'non-existent-user-id';

      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(result).toBeNull();
      expect(redisService.get).toHaveBeenCalledWith(`user:${userId}`);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateFcmToken', () => {
    it('should update FCM token and clear cache', async () => {
      const userId = 'test-user-id';
      const newFcmToken = 'new-fcm-token';

      jest.spyOn(userRepository, 'update').mockResolvedValue(mockUser);
      jest.spyOn(redisService, 'del').mockResolvedValue(1);

      const result = await service.updateFcmToken(userId, newFcmToken);

      expect(result).toEqual(mockUser);
      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        fcmToken: newFcmToken,
      });
      expect(redisService.del).toHaveBeenCalledWith(`user:${userId}`);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 'test-user-id';

      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(undefined);

      const result = await service.deleteUser(userId);

      expect(result).toBe(true);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.remove).toHaveBeenCalledWith(userId);
    });

    it('should return false if user not found', async () => {
      const userId = 'non-existent-user-id';

      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      const result = await service.deleteUser(userId);

      expect(result).toBe(false);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.remove).not.toHaveBeenCalled();
    });
  });
});
