import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { LoginDto } from '../src/modules/auth/dto/login.dto';
import { RegisterDto } from '../src/modules/auth/dto/register.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    gender: 'MALE',
    birthDate: new Date('1990-01-01'),
    fcmToken: 'test-fcm-token',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    point: 0,
    walletId: null,
    isSubscribed: false,
    subscriptionUntil: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const userWithHashedPassword = { ...mockUser, password: hashedPassword };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userWithHashedPassword);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(userWithHashedPassword);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      const userWithHashedPassword = { ...mockUser, password: hashedPassword };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userWithHashedPassword);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };
      const mockToken = 'mock-jwt-token';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userWithHashedPassword);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          gender: mockUser.gender,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });
  });

  describe('register', () => {
    it('should create new user and return access token', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        gender: 'FEMALE',
        birthDate: '1995-01-01',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = {
        ...mockUser,
        ...registerDto,
        password: hashedPassword,
        birthDate: new Date(registerDto.birthDate),
      };
      const mockToken = 'mock-jwt-token';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
        },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: expect.any(String), // hashed password
          gender: registerDto.gender,
          birthDate: new Date(registerDto.birthDate),
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: newUser.email,
        sub: newUser.id,
      });
    });
  });
});
