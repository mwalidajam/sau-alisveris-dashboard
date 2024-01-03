import Head from "next/head";
import Drawer from "./drawer";

type Props = {
  children: React.ReactNode;
  tabBarContents?: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ title: string; href?: string }>;
};

const RootLayout: React.FC<Props> = ({
  children,
  title = "SSUNION Dashbaord",
  tabBarContents,
  breadcrumbs,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Drawer
        title={title}
        children={children}
        tabBarContents={tabBarContents}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
};

export default RootLayout;
