import React from "react";
import HomeNav from "../components/homeNav";
import LoadingIndicator from "../components/LoadingIndicator";
import HeroSection from "../components/heroSection";

function Home() {
    return (
        <>
            <HomeNav />
            <HeroSection />
        </>
    );
}

export default Home;