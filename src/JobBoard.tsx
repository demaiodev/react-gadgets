import { useState, useEffect } from "react";

interface JobDetails {
  id: number;
  by: string;
  time: number;
  title: string;
  url?: string;
}

const PAGINATION_AMOUNT: number = 6;
const API_BASE_URL: string = "https://hacker-news.firebaseio.com/v0";

async function getJobDetails(id: number): Promise<JobDetails> {
  try {
    const res = await fetch(`${API_BASE_URL}/item/${id}.json`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json as JobDetails;
  } catch (err) {
    console.error("Error fetching job details:", err);
    throw err;
  }
}

async function getJobStories(): Promise<number[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobstories.json`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json as number[];
  } catch (err) {
    console.error("Error fetching job stories:", err);
    throw err;
  }
}

const Post = ({ id }: { id: number }) => {
  const [jobData, setJobData] = useState<JobDetails | null>(null);

  useEffect(() => {
    getJobDetails(id)
      .then((data) => setJobData(data))
      .catch((error) => console.error(`Failed to load post ${id}:`, error));
  }, [id]);

  if (!jobData) {
    return (
      <section className="bg-gray-700 p-4 rounded-lg shadow-md my-2 animate-pulse min-h-[5rem]">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
      </section>
    );
  }

  const postedDate = new Date(jobData.time * 1000).toLocaleString();

  return (
    <section className="bg-gray-800 p-4 rounded-xl shadow-xl my-3 border border-gray-700 hover:border-indigo-500 transition-colors duration-200">
      <a
        href={jobData.url || `https://news.ycombinator.com/item?id=${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-bold text-white hover:text-indigo-100 transition-colors duration-150 block mb-2"
      >
        {jobData.title}
      </a>
      <div className="text-xs text-gray-400 mt-2">
        <span className="font-medium text-indigo-300">By {jobData.by}</span>
        <span className="mx-2 text-gray-500">&middot;</span>
        <span>Posted on {postedDate}</span>
      </div>
    </section>
  );
};

export default function JobBoard() {
  const [jobIds, setJobIds] = useState<number[]>([]);
  const [displayAmount, setDisplayAmount] = useState<number>(PAGINATION_AMOUNT);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  useEffect(() => {
    getJobStories()
      .then((ids) => {
        setJobIds(ids);
        setLoadingInitial(false);
      })
      .catch(() => {
        setLoadingInitial(false);
      });
  }, []);

  const handleLoadMore = () => {
    setDisplayAmount((prev) => prev + PAGINATION_AMOUNT);
  };

  const visibleJobs = jobIds.slice(0, displayAmount);
  const hasMoreJobs = displayAmount < jobIds.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col space-y-4">
        <h1 className="text-4xl font-extrabold text-indigo-100 mb-4 border-b-2 border-indigo-500 pb-2 drop-shadow-black drop-shadow-sm">
          Hacker News Job Board
        </h1>
        {loadingInitial && (
          <div className="text-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-indigo-100 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-indigo-300">Fetching job IDs...</p>
          </div>
        )}
        {!loadingInitial && (
          <>
            {visibleJobs.map((id) => (
              <Post key={id} id={id} />
            ))}
            <button
              onClick={handleLoadMore}
              disabled={!hasMoreJobs}
              className={`
                w-full mt-4 py-3 rounded-full font-semibold transition-all duration-200 
                shadow-lg tracking-wider
                ${
                  hasMoreJobs
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {hasMoreJobs ? "Load More Jobs" : "All Jobs Loaded"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
