import { useEffect, useState } from "react";

function TestApi() {
  const [message, setMessage] = useState("Loading...");

  async function fetchData() {
    const result = await fetch("http://localhost:3000/api/hello");
    const data = await result.json();
    setMessage(data.message);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test Hello API</h1>
      <p>Message: {message}</p>
    </div>
  );
}

export default TestApi;