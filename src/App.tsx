import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { DataGrid } from "./components/DataGrid";

const fetchCSV = async () => {
  const res = await fetch(
    "https://pkgstore.datahub.io/core/nyse-other-listings/other-listed_csv/data/9f38660d84fe6ba786a4444b815b3b80/other-listed_csv.csv"
  );
  const result = await res.text();
  return result;
};

function useAsync<TData>({ fetchFn }: { fetchFn: () => Promise<TData> }) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [data, setData] = useState<TData>();
  useEffect(() => {
    setStatus("loading");
    fetchFn()
      .then((result) => {
        setData(result);
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [fetchFn]);

  return {
    status,
    data,
  };
}

function parseCSVText(text: string | undefined) {
  if (!text) {
    return {
      headers: [],
      rows: [],
    };
  }
  const [headers, ...rows] = text.split("\n").map((row) => {
    return row.split(",");
  });

  return {
    headers,
    rows,
  };
}

function App() {
  const { data, status } = useAsync({ fetchFn: fetchCSV });
  const records = useMemo(() => {
    return parseCSVText(data);
  }, [data]);

  switch (status) {
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return <DataGrid columns={records.headers} data={records.rows} />;
    case "error":
      return <div>Error in fetching data</div>;
    case "idle":
    default:
      return null;
  }
}

export default App;
