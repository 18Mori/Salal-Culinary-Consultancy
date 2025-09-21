import React from "react";
import HomeNav from "../components/homeNav";
import LoadingIndicator from "../components/LoadingIndicator";

function Home() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <HomeNav />
            {loading && <LoadingIndicator />}
        </>
    );
}

export default Home;