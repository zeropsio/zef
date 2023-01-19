export function getDataForPage(data: any[], pageSize: number, pageIndex: number) {
  return data.slice(pageIndex * pageSize, (pageIndex === 0 ? pageSize : (pageIndex + 1) * pageSize));
}
