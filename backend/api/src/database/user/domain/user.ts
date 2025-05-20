import { Gender } from '@prisma/client';

export class User {
  id: string;
  name: string;
  birthDate: Date;
  gender: Gender;
  mbti?: string;
  createdAt: Date;
  updatedAt: Date;
}
