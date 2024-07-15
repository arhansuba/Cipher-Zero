import type { NextPage } from "next";
import Head from "next/head";
import HomeView from "../views/HomeView.tsx";
import React from "react";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>zk Lokomotive</title>
                <meta name="description" content="" />
            </Head>
            <HomeView />
        </>
    );
};

export default Home;
