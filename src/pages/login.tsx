import { useState } from "react";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    setIsLogin(true);
    const sign = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false,
    });
    if (sign?.error) {
      console.log(sign.error);
    }
    if (sign?.url) {
      router.push(sign.url);
    }
    setIsLogin(false);
  };
  return (
    <>
      <Head>
        <title>SAÜ Alışveriş Uygulaması</title>
      </Head>
      <Grid
        container
        alignItems={"center"}
        direction={"row"}
        justifyContent={"center"}
        height={"100vh"}
        spacing={2}
      >
        <Grid container item md={6}>
          <Grid
            container
            item
            md={12}
            alignItems={"center"}
            direction={"column"}
            justifyContent={"center"}
            mb={1}
          >
            <Grid item xs={12} sx={{ position: "relative" }}>
              <Typography variant={"h4"} textAlign={"center"}>
                SAÜ Alışveriş Uygulaması
              </Typography>
            </Grid>
          </Grid>
          <Grid container item md={12} spacing={2}>
            <Grid item md={12} xs={12}>
              <TextField
                id="email"
                label="E-posta"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                label="Şifre"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={"password"}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                disabled={isLogin}
              >
                Giriş Yap
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
