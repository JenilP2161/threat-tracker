import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Filter from "@/components/Filter";
import TableData from "@/components/TableData";

interface Threat {
  host: string;
  url: string;
  threat_type: string;
  date_added: string;
}
export default function Home() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date_added");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [limit] = useState<number>(10);
  const [isData, setIsData] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [rateLimited, setRateLimited] = useState<boolean>(false);

  useEffect(() => {
    if (rateLimited) {
      // Prevent fetching if rate-limited
      return;
    }
    setLoading(true);
    setError("");
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/threats?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&filterType=${filterType}`
        );

        if (res.status === 429) {
          setRateLimited(true);
          setError(
            "⚠️ You’re sending requests too quickly. Please wait a moment and try again."
          );
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error("Something went wrong while fetching threats.");
        }

        const data = await res.json();
        if (data.threats.length === 0) {
          setIsData(false);
        } else {
          setIsData(true);
        }

        setThreats(data.threats);
        setTotal(data.total);
      } catch (error) {
        setError("⚠️ Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, sortBy, order, filterType, rateLimited]);

  const handlePagination = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };


  return (
    <div className="bg-black text-white min-h-screen px-4 py-6 md:px-8">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-blue-400 tracking-tight">
        🛡️ Threat Tracker
      </h1>

      {/* Filter + Sorting Controls */}
      <Filter
        filterType={filterType}
        setFilterType={e => setFilterType(e)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
      />

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-4">{error}</div>
      )}

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Image src="/loader.gif" alt="Loading..." width={100} height={100} />
        </div>
      ) : (
        <>
          {/* Table */}
          <TableData threats={threats} isData={isData} />

          <Pagination
            page={page}
            total={total}
            limit={limit}
            handlePagination={handlePagination}
          />
        </>
      )}
    </div>
  );
}
