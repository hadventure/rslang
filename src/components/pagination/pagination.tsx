import { MouseEvent } from 'react';
import cls from './pagination.module.scss';

type PaginationProps = {
  onChangePage: (page: number) => void;
  size: number,
  page: number,
  pageCount: number,
};

export default function Pagination({
  onChangePage,
  size,
  page,
  pageCount,
}: PaginationProps) {
  const setPage = (e: MouseEvent) => {
    const newPage = e.currentTarget.getAttribute('page-key');
    if (newPage) {
      onChangePage(Number(newPage));
    }
  };

  // eslint-disable-next-line consistent-return
  const checkCommonCases = (current: number, half: number, pageCountVal: number) => {
    if (pageCountVal < size) {
      return pageCountVal;
    }

    if (current <= half) {
      return size;
    }

    for (let i = 0; i < half; i += 1) {
      if (current === pageCountVal - i) {
        return pageCountVal;
      }
    }
  };

  const getLength = (current: number, pageCountVal: number) => {
    let half;
    if (size % 2 === 0) {
      half = Math.round(size / 2);
      const possLength = checkCommonCases(current, half, pageCountVal);

      if (possLength) {
        return possLength;
      }
      return current + half - 1;
    }

    half = Math.round(size / 2 - 1);
    const possLength = checkCommonCases(current, half, pageCountVal);

    if (possLength) {
      return possLength;
    }
    return current + half;
  };

  const getStart = (current: number) => {
    let half;
    if (size % 2 === 0) {
      half = Math.round(size / 2);
    } else {
      half = Math.round(size / 2 - 1);
    }

    if (current <= half) {
      return 1;
    }
    return current - half;
  };

  const renderPages = (pageVal: number, pageCountVal: number) => {
    const current = pageVal;
    const length = getLength(current, pageCountVal);
    const start = getStart(current);

    const masPages = [];

    for (let i = start; i <= length; i += 1) {
      masPages.push(
        <button
          type="button"
          key={i}
          page-key={i}
          onClick={setPage}
          className={pageVal === i ? `${cls.pageItem} ${cls.active}` : `${cls.pageItem}`}
        >
          <div page-key={i}>{ i }</div>
        </button>,
      );
    }
    return masPages;
  };

  return (
    <div className={cls.paginationContainer}>
      <div>
        <button type="button" page-key={page - 1} onClick={setPage}>prev</button>
      </div>
      { renderPages(page, pageCount) }
      <div>
        <button type="button" page-key={page + 1} onClick={setPage}>next</button>
      </div>
    </div>
  );
}
