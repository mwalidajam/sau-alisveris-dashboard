import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { api_url } from "@/data/url";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    pages: {
      signIn: "/login",
    },
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        type: "credentials",
        async authorize(credentials, req) {
          // console.log(credentials);
          try {
            // const {token} = req?.headers?.cookie;
            console.log(credentials);
            const uri = `${api_url}/api/UserAuth/login`;
            // send request to the server as a POST request
            const response = await axios.post(uri, credentials);
            const { data } = response;
            console.log(data);
            // Add logic here to look up the user from the credentials supplied

            if (data.token) {
              res.setHeader(
                "Set-Cookie",
                "d-token=" + data.token + "; path=/" + "; HttpOnly"
              );
              // Any object returned will be saved in `user` property of the JWT
              return data.user;
            } else {
              // If you return null or false then the credentials will be rejected
              return null;
              // You can also Reject this callback with an Error or with a URL:
              // throw new Error('error message') // Redirect to error page
              // throw '/path/to/redirect'        // Redirect to a URL
            }
          } catch (e) {
            console.log(e);
          }
        },
        id: "credentials",
      }),
    ],
    callbacks: {
      session: async ({ session, user }) => {
        const dtoken = req.cookies["d-token"];
        const { data } = await axios.get(`${api_url}/api/users/get-me`, {
          headers: {
            Authorization: `Bearer ${dtoken}`,
          },
        });
        console.log(data);
        return Promise.resolve(session);
      },
    },
  });
}

// export default NextAuth(authOptions);
