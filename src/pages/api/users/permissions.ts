// create handler for register

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { api_url } from "@/data/url";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get d-token from cookies
  const dtoken = req.cookies["d-token"];
  const { data } = await axios.get(`${api_url}/api/users/get-me`, {
    headers: {
      Authorization: `Bearer ${dtoken}`,
    },
  });
  res.status(200).json(data);
}
