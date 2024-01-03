import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Cookies from "cookies";
import { api_url } from "@/data/url";
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";

var mv = require("mv");
type Data = {
  status: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cookies = Cookies(req, res);
  const token = cookies.get("d-token");
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields: any, files: any) => {
      if (err) return reject(err);
      console.log(fields, files);
      const formData = new FormData();
      formData.append("name", fields.name[0]);
      formData.append("details", fields.details[0]);
      if (files?.image) {
        var oldPath = files?.image[0]?.filepath;
        var newPath = `./public/uploads/${files?.image[0]?.originalFilename}`;
        mv(oldPath, newPath, async function (err: any) {
          const blob = new Blob([await fs.readFile(newPath)]);
          formData.append("image", blob);
          console.log(formData);
          const { data } = await axios.post(
            `${api_url}/api/products/create`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          // delete the file from the server
          await fs.unlink(newPath);
          console.log(data);
          res.status(200).json({ status: data.status });
        });
      } else {
        (async () => {
          const { data } = await axios.post(
            `${api_url}/api/products/create`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(data);
          res.status(200).json({ status: data.status });
        })();
      }
    });
  });
}
