import { ApiClient } from "../data/datasources/ApiClient";
import { UserRepositoryImpl } from "../data/repositories/UserRepositoryImpl";
import { GetCurrentUserUseCase, UpdateUserUseCase } from "../domain/usecases";

export class Container {
  private static instance: Container;
  private apiClient: ApiClient;
  private userRepository: UserRepositoryImpl;
  private getCurrentUserUseCase: GetCurrentUserUseCase;
  private updateUserUseCase: UpdateUserUseCase;

  private constructor() {
    this.apiClient = new ApiClient();
    this.userRepository = new UserRepositoryImpl(this.apiClient);
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(this.userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(this.userRepository);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  getApiClient(): ApiClient {
    return this.apiClient;
  }

  getUserRepository(): UserRepositoryImpl {
    return this.userRepository;
  }

  getGetCurrentUserUseCase(): GetCurrentUserUseCase {
    return this.getCurrentUserUseCase;
  }

  getUpdateUserUseCase(): UpdateUserUseCase {
    return this.updateUserUseCase;
  }
}
