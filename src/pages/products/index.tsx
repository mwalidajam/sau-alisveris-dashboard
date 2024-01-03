import type { NextPage, GetServerSideProps } from "next";
import { AppProps } from "next/app";
import RootLayout from "@/components/admin/Layout";
import { usePermissions } from "@/contexts/Permissions";
import React, { useEffect, useState } from "react";
import { ProtectedPageProps, ProductProps } from "@/data/props";
import axios from "axios";
import { api_url } from "@/data/url";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Link from "next/link";

type PropsStatus = AppProps & {
  router: AppProps;
  products: ProductProps[];
};

const Home: NextPage<PropsStatus> & ProtectedPageProps = ({ products }) => {
  const [isGridLoading, setIsGridLoading] = useState(true);
  const [list, setList] = useState<ProductProps[]>([]);
  const columns: GridColDef[] = [
    {
      field: "name",
      flex: 1,
      headerName: "Ürün",
      renderCell: (params: GridRenderCellParams) => <>{params.row.name}</>,
    },
    {
      field: "id",
      flex: 1,
      headerName: "Seçenekler",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Link href={`/products/${params.row.id}/update`} passHref>
              <Button variant="contained" color="primary">
                Düzenle
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    setList(products);
    setIsGridLoading(false);
  }, []);
  return (
    <RootLayout
      title="Ütünler"
      tabBarContents={
        <Link href="/products/create" passHref>
          <Button variant="contained" color="primary">
            Yeni Ürün Oluştur
          </Button>
        </Link>
      }
    >
      <>
        <DataGrid
          rows={list}
          columns={columns}
          autoHeight
          rowCount={list.length}
          pagination
          paginationMode={"server"}
          loading={isGridLoading}
        />
      </>
    </RootLayout>
  );
};

Home.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // get d-token from cookies
  try {
    const token = req.cookies["d-token"];
    const { data } = await axios.get(`${api_url}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    return {
      props: {
        products: data.products,
      },
    };
  } catch (e) {
    res.writeHead(302, { Location: "/login" });
    res.end();
    return { props: {} };
  }
};

export default Home;
