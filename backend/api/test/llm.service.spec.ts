import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LlmService } from '../src/modules/llm/llm.service';
import { ChatDto } from '../src/modules/llm/dto/chat.dto';
import { AnalyzeDto } from '../src/modules/llm/dto/analyze.dto';

describe('LlmService', () => {
  let service: LlmService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LlmService>(LlmService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chat', () => {
    it('should make chat request to LLM API', async () => {
      const chatDto: ChatDto = {
        messages: [{ role: 'user', content: 'Hello, how are you?' }],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
      };

      const mockResponse = {
        choices: [
          {
            message: {
              content: 'I am doing well, thank you for asking!',
            },
          },
        ],
      };

      // Mock fetch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      jest.spyOn(configService, 'get').mockReturnValue('http://localhost:8000');

      const result = await service.chat(chatDto);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/chat',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatDto),
        }),
      );
    });

    it('should throw error when API request fails', async () => {
      const chatDto: ChatDto = {
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      jest.spyOn(configService, 'get').mockReturnValue('http://localhost:8000');

      await expect(service.chat(chatDto)).rejects.toThrow('LLM API request failed');
    });
  });

  describe('analyze', () => {
    it('should make analyze request to LLM API', async () => {
      const analyzeDto: AnalyzeDto = {
        text: 'Sample text for analysis',
        analysisType: 'sentiment',
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
      };

      const mockResponse = {
        analysis: {
          sentiment: 'positive',
          confidence: 0.85,
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      jest.spyOn(configService, 'get').mockReturnValue('http://localhost:8000');

      const result = await service.analyze(analyzeDto);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/analyze',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analyzeDto),
        }),
      );
    });
  });
});
