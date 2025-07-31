import { RemoteUserDataSource } from '../data/datasources/RemoteUserDataSource';
import { UserRepositoryImpl } from '../data/repositories/UserRepositoryImpl';
import { GetCurrentUserUseCase } from '../domain/usecases/GetCurrentUserUseCase';
import { UpdateUserUseCase } from '../domain/usecases/UpdateUserUseCase';

class Container {
  private static instance: Container;
  private dependencies: Map<string, any> = new Map();

  private constructor() {
    this.initializeDependencies();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeDependencies(): void {
    // Data Sources
    this.dependencies.set('UserDataSource', new RemoteUserDataSource());

    // Repositories
    const userDataSource = this.get<UserDataSource>('UserDataSource');
    this.dependencies.set('UserRepository', new UserRepositoryImpl(userDataSource));

    // Use Cases
    const userRepository = this.get<UserRepository>('UserRepository');
    this.dependencies.set('GetCurrentUserUseCase', new GetCurrentUserUseCase(userRepository));
    this.dependencies.set('UpdateUserUseCase', new UpdateUserUseCase(userRepository));
  }

  get<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found`);
    }
    return dependency as T;
  }

  set<T>(key: string, value: T): void {
    this.dependencies.set(key, value);
  }
}

export default Container;

// Type aliases for better readability
export type UserDataSource = import('../data/datasources/UserDataSource').UserDataSource;
export type UserRepository = import('../domain/repositories/UserRepository').UserRepository; 