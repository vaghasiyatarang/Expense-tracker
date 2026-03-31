import { authOptions } from "auth/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
console.log('handler', handler)
export { handler as GET, handler as POST };
