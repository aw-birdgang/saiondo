import { ProfileSource } from '@prisma/client';

export class PersonaProfileDto {
  id: string;
  userId: string;
  categoryCodeId: string;
  content: string;
  isStatic: boolean;
  source: ProfileSource;
  confidenceScore: number;
  createdAt: Date;
  updatedAt: Date;
  // persona, status 제거됨
}
