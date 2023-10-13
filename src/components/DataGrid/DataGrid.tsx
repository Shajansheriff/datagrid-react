import { useMemo, useState } from "react";

interface DataGridProps {
  columns: string[];
  data: string[][];
  limit?: number;
}

export function DataGrid({ columns, data, limit = 10 }: DataGridProps) {
  const [page, setPage] = useState(0);

  const goToPrev = () => {
    setPage((prev) => prev - 1);
  };

  const goToNext = () => {
    setPage((prev) => prev + 1);
  };

  const totalPage = Math.ceil(data.length / limit);
  const canDoPrev = page > 0;
  const canDoNext = page < totalPage;

  const paginatedData = useMemo(() => {
    const start = page * limit;
    const end = start + limit;
    return data.slice(start, end);
  }, [limit, page, data]);

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((column) => {
              return <th key={column}>{column}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((record) => {
            return (
              <tr>
                {columns.map((_, index) => {
                  const value = record[index];
                  return <td>{value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button disabled={!canDoPrev} onClick={goToPrev}>
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPage}
        </span>
        <button disabled={!canDoNext} onClick={goToNext}>
          Next
        </button>
      </div>
    </>
  );
}
