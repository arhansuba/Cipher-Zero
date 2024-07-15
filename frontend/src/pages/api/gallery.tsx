import type { NextPage } from "next";
import Head from "next/head";
import { GalleryView } from "../../views";
import React from "react";

const Home: NextPage = (props: any) => {
  return (
    <div>
      <Head>
        <title>File Transfer  </title>
        <meta name="description" content="file" />
      </Head>
      <GalleryView />
    </div>
  );
};

export default Home;