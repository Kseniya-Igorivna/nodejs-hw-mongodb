import { contactTypesList } from '../constants/contacts.js';

const parseType = (contactType) => {
  if (typeof contactType !== 'string') return;
  if (contactTypesList.includes(contactType)) return contactType;
};

function parseBoolean(value) {
  if (typeof value !== 'string') return;
  if (value === '1' || value.toLowerCase() === 'true') {
    return true;
  } else if (value === '0' || value.toLowerCase() === 'false') {
    return false;
  } else {
    return;
  }
}

export function parseContactFilterParams(queryParams) {
  const { isFavourite, contactType } = queryParams;
  return {
    isFavourite: parseBoolean(isFavourite),
    contactType: parseType(contactType),
  };
}

export function calculatePaginationData(totalItems, page, perPage) {
    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = page !== totalPages;
    const hasPreviousPage = page !== 1;
    return {
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  }
  function parseNumber(number, defaultValue) {
    if (typeof number !== 'string') return defaultValue;
    const parsedNumber = parseInt(number);
    if (Number.isNaN(parsedNumber)) return defaultValue;
    return parsedNumber;
  }
  
  export function parsePaginationParams({ page, perPage }) {
    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(perPage, 10);
    return {
      page: parsedPage,
      perPage: parsedPerPage,
    };
  }
  const sortOrderList = ['asc', 'desc'];

export function parseSortParams({ sortBy, sortOrder }, sortByList) {
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];
  const parsedSortBy = sortByList.includes(sortBy) ? sortBy : '_id';
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}