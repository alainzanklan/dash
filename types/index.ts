import { User } from '@/prisma/generated/client';

export type SafeUser = Omit<
  User,
  'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: String;
  updatedAt: string;
  emailVerified?: string | null;
  role: string;
};
