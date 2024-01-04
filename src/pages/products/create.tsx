import type { NextPage, GetServerSideProps } from "next";
import { AppProps } from "next/app";
import RootLayout from "@/components/admin/Layout";
import { useEffect, useState } from "react";
import { ProtectedPageProps } from "@/data/props";
import axios from "axios";
import { api_url } from "@/data/url";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useRouter } from "next/router";

type PropsStatus = AppProps & {
  router: AppProps;
};

const Home: NextPage<PropsStatus> & ProtectedPageProps = ({}) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [is_submitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("details", details);
    formData.append("price", price.toString());
    formData.append("image", image as Blob);
    const { data } = await axios.post(`/api/products/create`, formData);
    console.log(data);
    if (data.status === "success") {
      router.push("/products");
    } else {
      alert(data.message);
    }
    setIsSubmitting(false);
  };
  useEffect(() => {}, []);
  return (
    <RootLayout
      title={`Yeni Ürün Oluştur`}
      breadcrumbs={[
        {
          title: "Ürünler",
          href: "/products",
        },
        {
          title: "Yeni Ürün Oluştur",
        },
      ]}
    >
      <>
        <Grid container justifyContent={"center"} p={2}>
          <Grid container spacing={3} justifyContent={"center"}>
            <Grid item mt={3} md={6} xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="name"
                  label="Ürün Adı"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} justifyContent={"center"}>
            <Grid item mt={3} md={6} xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="details"
                  label="Ürün Açıklaması"
                  value={details}
                  onChange={(e) => {
                    setDetails(e.target.value);
                  }}
                  multiline
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} justifyContent={"center"}>
            <Grid item mt={3} md={6} xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="price"
                  label="Ürün Fiyatı"
                  value={price}
                  onChange={(e) => {
                    setPrice(parseInt(e.target.value));
                  }}
                  type={"number"}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} justifyContent={"center"}>
            <Grid item mt={3} md={6} xs={12}>
              <InputLabel htmlFor="image">Ürün Resmi</InputLabel>
              <FormControl fullWidth>
                <TextField
                  id="image"
                  label=""
                  type="file"
                  onChange={(e) => {
                    // @ts-ignore
                    setImage(e.target.files[0]);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"center"} mb={3}>
            <Grid item mt={3} md={6} xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={is_submitting}
                onClick={handleSubmit}
              >
                {is_submitting ? "Yükleniyor..." : "Ekle"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    </RootLayout>
  );
};

Home.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  try {
    // get d-token from cookies
    const token = req.cookies["d-token"];
    return {
      props: {},
    };
  } catch (e) {
    res.writeHead(302, { Location: "/login" });
    res.end();
    return { props: {} };
  }
};

export default Home;
