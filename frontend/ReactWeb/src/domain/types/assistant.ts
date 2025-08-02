export interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  category: string;
  isActive: boolean;
  lastUsed?: Date;
  messageCount: number;
}

export interface AssistantCategory {
  id: string;
  name: string;
  icon: string;
} 