import { useState, useEffect } from "react";


function client_index() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (logout) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, [logout]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h1>Client Dashboard</h1>
      <p>Welcome to the Client Dashboard!</p>
      <a href="/">Home</a>
      <button onClick={() => setLogout(true)}>Logout</button>
      {loading && <LoadingIndicator />}
    </div>
  );
}

export default client_index;