import { Fetcher } from "@/utils/fetcher";
import { useState, useEffect } from "react";

type Props = {
  page: number;
  sessionId: string;
};

const useMessagesDocs = ({ page, sessionId }: Props) => {
  const [results, setResults] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [hasMoreDocs, setHasMoreDocs] = useState(false);
  const [noData, setNoData] = useState(false);

  const getDocs = async (props: Props) => {
    if (props.page === 1) {
      setResults([]);
    }
    try {
      const resp = await Fetcher("http://192.168.1.9:3002/getSessionMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      if (resp.ok) {
        const data: [] = (await resp.json()).data;
        // console.log(data);
        setResults((prev) => [...prev, ...data]);
        setNoData(false);
        setHasMoreDocs(Boolean(data.length));
        setIsLoading(false);
      } else {
        const error = (await resp.json()).error;
        setIsLoading(false);
        setIsError(true);
        setError(error.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      setIsError(true);
      setError(error.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError("");

    if (sessionId) {
      var props = { page: page, sessionId: sessionId };

      getDocs(props);
    }
  }, [page, sessionId]);

  return {
    isLoading,
    isError,
    error,
    results,
    hasMoreDocs,
    noData,
  };
};

export default useMessagesDocs;
