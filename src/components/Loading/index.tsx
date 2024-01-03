import React from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Head from "next/head";

const Loading = () => {
  return (
    <>
      <Head>
        <title>SAÜ Alışveriş Uygulaması</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Grid
        container
        alignItems={"center"}
        direction={"column"}
        justifyContent={"center"}
        spacing={2}
        height={"100vh"}
      >
        <CircularProgress sx={{ mt: 2 }} />
      </Grid>
    </>
  );
};

export default Loading;
