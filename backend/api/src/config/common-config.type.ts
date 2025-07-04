export type CommonConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  llmApiUrl: string;
  wsPort: number;
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
};
