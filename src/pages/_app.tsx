import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import { SessionProvider, useSession } from "next-auth/react";
import LoadingPage from "@/components/Loading";
import { useRouter } from "next/router";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      // make default font-family arabic font
      styleOverrides: `
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap');
                body *{
                    font-family: 'Cairo', sans-serif !important;
                }
            `,
    },
  },
  palette: {
    primary: {
      main: "#194481",
    },
  },
});

const cache = createCache({
  key: "mui",
  stylisPlugins: [prefixer],
});

type AppPropsWithAuth = AppProps & {
  Component: any & {
    requireAuth?: boolean;
    requireLogout?: boolean;
  };
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => {
  return (
    <SessionProvider session={session}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {Component.requireAuth ? (
            <ProtectedLayout>
              <Component {...pageProps} />
            </ProtectedLayout>
          ) : Component.requireLogout ? (
            <NoAuthLayout>
              <Component {...pageProps} />
            </NoAuthLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <LoadingPage />;
  }
  if (!session) {
    router.push("/login");
    return <LoadingPage />;
  }
  return <>{children}</>;
};

const NoAuthLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <LoadingPage />;
  }
  if (session) {
    router.push("/");
    return <LoadingPage />;
  }
  return <>{children}</>;
};

export default MyApp;
