import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LlmService } from '../src/modules/llm/llm.service';
import { AnalyzeRequestDto } from '../src/modules/llm/dto/analyze.dto';
import axios from 'axios';

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

  describe('forwardToLLM', () => {
    it('should make chat request to LLM API', async () => {
      const prompt = 'Hello, how are you?';
      const model = 'openai';

      const mockResponse = {
        response: 'I am doing well, thank you for asking!',
      };

      // Mock axios
      jest.spyOn(axios, 'post').mockResolvedValue({ data: mockResponse });

      jest.spyOn(configService, 'getOrThrow').mockReturnValue({
        llmApiUrl: 'http://localhost:8000',
      });

      const result = await service.forwardToLLM(prompt, model);

      expect(result).toEqual(mockResponse.response);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/chat', { prompt, model });
    });

    it('should throw error when API request fails', async () => {
      const prompt = 'Hello';
      const model = 'openai';

      jest.spyOn(axios, 'post').mockRejectedValue(new Error('API Error'));

      jest.spyOn(configService, 'getOrThrow').mockReturnValue({
        llmApiUrl: 'http://localhost:8000',
      });

      await expect(service.forwardToLLM(prompt, model)).rejects.toThrow('API Error');
    });
  });

  describe('analyze', () => {
    it('should make analyze request to LLM API', async () => {
      const analyzeDto: AnalyzeRequestDto = {
        user_prompt: 'Sample user text',
        partner_prompt: 'Sample partner text',
        user_gender: 'male',
        partner_gender: 'female',
        model: 'openai',
      };

      const mockResponse = {
        user_traits: 'Sample traits',
        match_result: 'Sample match',
        advice: 'Sample advice',
      };

      jest.spyOn(axios, 'post').mockResolvedValue({ data: mockResponse });

      jest.spyOn(configService, 'getOrThrow').mockReturnValue({
        llmApiUrl: 'http://localhost:8000',
      });

      const result = await service.analyze(analyzeDto);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/analyze', analyzeDto);
    });
  });
});
