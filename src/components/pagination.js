import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break; // переход на предыдущую страницу
        case "next":
          page = Math.min(pageCount, page + 1);
          break; // переход на следующую страницу
        case "first":
          page = 1;
          break; // переход на первую страницу
        case "last":
          page = pageCount;
          break; // переход на последнюю страницу
      }

    return Object.assign({}, query, {
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // переносим код, который делали под @todo: #2.4
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // переносим код, который делали под @todo: #2.5 (обратите внимание, что rowsPerPage заменена на limit)
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return {
    updatePagination,
    applyPagination,
  };
};
