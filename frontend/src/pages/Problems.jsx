import { useProblemStore } from "../store/useProblemStore";
import { useEffect } from "react";
import ProblemsTable from "../components/ProblemTable";
import { Loader } from "lucide-react";

export default function Problems() {
  const { problems, getAllProblems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, []);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <section className="min-h-screen flex flex-col items-center bg-dark dark:bg-dark md:m-0 py-10 md:py-20">
      
        {problems.length > 0 ? (
          <ProblemsTable problems={problems} />
        ) : (
          <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
            No problems found
          </p>
        )}
    
    </section>
  );
}
