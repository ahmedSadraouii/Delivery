import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';

import type { User } from '@/app/lib/definitions';
import GoogleProvider from 'next-auth/providers/google';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const response = await fetch(
            'http://localhost:9000/api/v1/auth/login',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            },
          );

          if (response.ok) {
            const user = await response.json();
            return user;
          } else {
            const errorResponse = await response.json();
            const errorMessage =
              errorResponse?.error ||
              'Failed to authenticate user with external API';

            switch (errorMessage) {
              case 'Please confirm your email':
                throw new AuthError('Please confirm your email');
              case 'Invalid credentials':
                throw new AuthError('Invalid credentials');
              case 'User not found':
                throw new AuthError('User not found');
              default:
                console.log('Failed to authenticate user with external API');
                throw new AuthError('Something went wrong');
            }
          }
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
