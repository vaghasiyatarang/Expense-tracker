import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "models/User";
import { connectToDatabase } from "lib/mongo";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials?.email });
        if (user && bcrypt.compareSync(credentials!.password, user.passwordHash)) {
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
  if (token?.id) {
    session.user = {
      ...session.user,
      id: token.id as string,
    };
  }
  return session;
}

  },
  secret: process.env.NEXTAUTH_SECRET
};
