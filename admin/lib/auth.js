import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const adminEmails = [
  "georgekibew@gmail.com",
  "georgekibewambui@gmail.com",
  "gyjoyouspatel@gmail.com",
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    error: "/",
  },
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export async function isAdminRequest() {
  const session = await getServerSession(authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    throw Error("Not an admin!");
  }
}
