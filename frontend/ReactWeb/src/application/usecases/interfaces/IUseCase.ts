/**
 * UseCase 기본 인터페이스
 * 모든 UseCase가 구현해야 할 공통 메서드를 정의
 */
export interface IUseCase<TRequest = any, TResponse = any> {
  /**
   * UseCase 실행 메서드
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  execute(request?: TRequest): Promise<TResponse>;
}

/**
 * UseCase 메타데이터 인터페이스
 * UseCase의 메타 정보를 정의
 */
export interface IUseCaseMetadata {
  name: string;
  description?: string;
  version?: string;
  dependencies?: string[];
}

/**
 * UseCase 등록 정보
 * DI Container에서 UseCase를 등록할 때 사용
 */
export interface UseCaseRegistration {
  token: string | symbol;
  useCase: new (...args: any[]) => IUseCase;
  dependencies: (string | symbol)[];
  metadata?: IUseCaseMetadata;
}
