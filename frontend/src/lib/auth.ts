import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { sql } from './neon/db';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;

        if (!user || !('password_hash' in user)) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          (user as any).password_hash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.nama_lengkap,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // Ensure user exists in our DB
        const [existing] = await sql`SELECT id FROM users WHERE id = ${user.id}`;
        if (!existing) {
          await sql`
            INSERT INTO users (id, email, nama_lengkap)
            VALUES (${user.id}, ${user.email}, ${user.name || ''})
            ON CONFLICT (id) DO NOTHING
          `;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});
