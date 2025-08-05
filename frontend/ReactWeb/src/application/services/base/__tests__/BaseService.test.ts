import { BaseService } from '../BaseService';
import { ConsoleLogger } from '../../../../domain/interfaces/ILogger';

// 테스트용 Mock Repository
class MockRepository {
  async findById(id: string): Promise<any> {
    return { id, name: 'Test User' };
  }
}

// 테스트용 Service 구현체
class TestService extends BaseService<MockRepository> {
  protected repository: MockRepository;

  constructor(logger?: ConsoleLogger) {
    super(logger);
    this.repository = new MockRepository();
  }

  async testMeasurePerformance(): Promise<string> {
    return await this.measurePerformance(
      'test_operation',
      async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'test result';
      },
      { test: true }
    );
  }

  testValidateInput(data: any, schema: any): any {
    return this.validateInput(data, schema, 'test context');
  }

  testHandleError(error: unknown, operation: string): never {
    return this.handleError(error, operation, { test: true });
  }

  testValidateBusinessRules(data: any, rules: any[]): any {
    return this.validateBusinessRules(data, rules);
  }
}

describe('BaseService', () => {
  let testService: TestService;
  let mockLogger: jest.Mocked<ConsoleLogger>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    };
    testService = new TestService(mockLogger);
  });

  describe('measurePerformance', () => {
    it('should measure performance and log operation', async () => {
      const result = await testService.testMeasurePerformance();

      expect(result).toBe('test result');
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Starting operation: test_operation'),
        expect.objectContaining({
          operationId: expect.any(String),
          operation: 'test_operation',
          context: { test: true },
        })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Operation completed: test_operation'),
        expect.objectContaining({
          operationId: expect.any(String),
          operation: 'test_operation',
          duration: expect.stringMatching(/\d+\.\d+ms/),
          context: { test: true },
        })
      );
    });

    it('should handle errors during performance measurement', async () => {
      const errorService = new TestService(mockLogger);

      await expect(
        errorService.measurePerformance('error_operation', async () => {
          throw new Error('Test error');
        })
      ).rejects.toThrow('Test error');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Operation failed: error_operation'),
        expect.objectContaining({
          operationId: expect.any(String),
          operation: 'error_operation',
          error: expect.any(Error),
        })
      );
    });
  });

  describe('validateInput', () => {
    it('should validate input successfully', () => {
      const schema = {
        name: { required: true, type: 'string', minLength: 2 },
        age: { required: true, type: 'number', min: 18 },
      };

      const data = { name: 'John', age: 25 };
      const result = testService.testValidateInput(data, schema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return validation errors for invalid input', () => {
      const schema = {
        name: { required: true, type: 'string', minLength: 2 },
        age: { required: true, type: 'number', min: 18 },
      };

      const data = { name: 'J', age: 15 };
      const result = testService.testValidateInput(data, schema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: expect.stringContaining('minimum length'),
        })
      );
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'age',
          message: expect.stringContaining('minimum value'),
        })
      );
    });

    it('should handle missing required fields', () => {
      const schema = {
        name: { required: true, type: 'string' },
        email: { required: true, type: 'string' },
      };

      const data = { name: 'John' };
      const result = testService.testValidateInput(data, schema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('required'),
        })
      );
    });
  });

  describe('handleError', () => {
    it('should log error and re-throw', () => {
      const error = new Error('Test error');

      expect(() => {
        testService.testHandleError(error, 'test_operation');
      }).toThrow('Test error');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error in test_operation'),
        expect.objectContaining({
          error: error,
          operation: 'test_operation',
          context: { test: true },
        })
      );
    });

    it('should handle non-Error objects', () => {
      const error = 'String error';

      expect(() => {
        testService.testHandleError(error, 'test_operation');
      }).toThrow('String error');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error in test_operation'),
        expect.objectContaining({
          error: error,
          operation: 'test_operation',
          context: { test: true },
        })
      );
    });
  });

  describe('validateBusinessRules', () => {
    it('should validate business rules successfully', () => {
      const rules = [
        {
          name: 'user_age_check',
          validate: (data: any) => data.age >= 18,
          message: 'User must be at least 18 years old',
        },
        {
          name: 'user_name_check',
          validate: (data: any) => data.name.length > 0,
          message: 'User name cannot be empty',
        },
      ];

      const data = { name: 'John', age: 25 };
      const result = testService.testValidateBusinessRules(data, rules);

      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should return violations for failed business rules', () => {
      const rules = [
        {
          name: 'user_age_check',
          validate: (data: any) => data.age >= 18,
          message: 'User must be at least 18 years old',
        },
        {
          name: 'user_name_check',
          validate: (data: any) => data.name.length > 0,
          message: 'User name cannot be empty',
        },
      ];

      const data = { name: '', age: 15 };
      const result = testService.testValidateBusinessRules(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(2);
      expect(result.violations).toContainEqual(
        expect.objectContaining({
          rule: 'user_age_check',
          message: 'User must be at least 18 years old',
        })
      );
      expect(result.violations).toContainEqual(
        expect.objectContaining({
          rule: 'user_name_check',
          message: 'User name cannot be empty',
        })
      );
    });
  });
});
