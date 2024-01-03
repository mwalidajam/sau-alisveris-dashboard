import type { NextPage, GetServerSideProps } from "next";
import { AppProps } from "next/app";
import RootLayout from "@/components/admin/Layout";
import { usePermissions } from "@/contexts/Permissions";
import React, { useEffect, useState } from "react";
import { ProtectedPageProps } from "@/data/props";
import axios from "axios";
import { api_url } from "@/data/url";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type PropsStatus = AppProps & {
  router: AppProps;
};

const Home: NextPage<PropsStatus> & ProtectedPageProps = ({}) => {
  return (
    <RootLayout title="SAÜ Alışveriş Uygulaması">
      <></>
    </RootLayout>
  );
};

Home.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // get d-token from cookies
  try {
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
