import CheckLogin from "@/libs/client/checkLogin";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (
    page: ReactElement,
    pageProps: JSX.IntrinsicAttributes
  ) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div>
        <CheckLogin />
        {getLayout(<Component {...pageProps} />, pageProps)}
      </div>
    </SWRConfig>
  );
}

export default MyApp;
