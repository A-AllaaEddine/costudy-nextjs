import { Fetcher } from '@/utils/fetcher';
import { useState, useEffect } from 'react';

type Props = {
  page: number;
  keyword: string;
  major: string;
  degree: string;
  year: string;
};

const useResources = ({ page, keyword, major, degree, year }: Props) => {
  useResources;
  const [results, setResults] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [hasMoreDocs, setHasMoreDocs] = useState(false);
  const [noData, setNoData] = useState(false);

  const getDocs = async (props: {
    page: number;
    keyword?: string;
    major?: string;
    degree?: string;
    year?: string;
  }) => {
    if (props.page === 1) {
      setResults([]);
    }
    try {
      const resp = await Fetcher('/api/resources/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props),
      });
      if (resp.ok) {
        const data: [] = (await resp.json()).data;
        setResults((prev) => [...prev, ...data]);
        setNoData(false);
        setHasMoreDocs(Boolean(data.length));
        setIsLoading(false);
      } else {
        const error = (await resp.json()).error;
        setIsLoading(false);
        setIsError(true);
        setError(error);
      }
    } catch (error: any) {
      setIsLoading(false);
      setIsError(true);
      setError(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError('');

    var props: {
      page: number;
      keyword?: string;
      major?: string;
      degree?: string;
      year?: string;
    } = { page };

    if (keyword) {
      props.keyword = keyword;
    }
    if (major) {
      props.major = major;
    }
    if (degree) {
      props.degree = degree;
    }
    if (year) {
      props.year = year;
    }

    if (page > 0) {
      getDocs(props);
    }
  }, [page, major, degree, year]);

  return {
    isLoading,
    isError,
    error,
    results,
    hasMoreDocs,
    noData,
  };
};

export default useResources;
