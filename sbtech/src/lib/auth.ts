import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

const users = [
  {
    id: "1",
    name: "Test User",
    email: "user@example.com",
    passwordHash: bcrypt.hashSync("password123", 10),
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find((u) => u.email === credentials?.email);
        if (user && credentials?.password && bcrypt.compareSync(credentials.password, user.passwordHash)) {
          return { id: user.id, name: user.name, email: user.email } as any;
        }
        return null;
      },
    }),
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })
      : (undefined as any),
    process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? GitHubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! })
      : (undefined as any),
  ].filter(Boolean) as any,
  pages: {
    signIn: "/auth/signin",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev_secret",
};