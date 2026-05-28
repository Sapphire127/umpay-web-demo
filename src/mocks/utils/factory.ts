import { http, HttpResponse, delay } from 'msw';

export function createCrudHandlers<T extends { id: number }>(
  basePath: string,
  initialData: T[]
) {
  const store = [...initialData];
  let nextId = store.length > 0 ? Math.max(...store.map((r) => r.id)) + 1 : 1;

  const list = http.get(basePath, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1', 10) - 1;
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
    const filtered = filterByParams(store, url.searchParams);
    const start = pageNum * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        hasNext: start + pageSize < filtered.length,
        page: pageNum + 1,
        size: pageSize,
        items,
      },
    });
  });

  const getById = http.get(`${basePath}/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string);
    const item = store.find((r) => (r as Record<string, unknown>).id === id);
    if (!item) {
      return HttpResponse.json({ code: 404, message: 'Not found', data: null });
    }
    return HttpResponse.json({ code: 200, message: 'success', data: item });
  });

  const create = http.post(basePath, async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Partial<T>;
    const record = { ...body, id: nextId++ } as T;
    store.push(record);
    return HttpResponse.json({ code: 200, message: 'success', data: record });
  });

  const update = http.put(`${basePath}/:id`, async ({ params, request }) => {
    await delay(200);
    const id = parseInt(params.id as string);
    const body = (await request.json()) as Partial<T>;
    const idx = store.findIndex((r) => (r as Record<string, unknown>).id === id);
    if (idx === -1) {
      return HttpResponse.json({ code: 404, message: 'Not found', data: null });
    }
    store[idx] = { ...store[idx], ...body };
    return HttpResponse.json({ code: 200, message: 'success', data: store[idx] });
  });

  const updateStatus = http.put(`${basePath}/:id/status`, async ({ params, request }) => {
    await delay(200);
    const id = parseInt(params.id as string);
    const body = (await request.json()) as { status: string };
    const idx = store.findIndex((r) => (r as Record<string, unknown>).id === id);
    if (idx === -1) {
      return HttpResponse.json({ code: 404, message: 'Not found', data: null });
    }
    (store[idx] as Record<string, unknown>).status = body.status;
    return HttpResponse.json({ code: 200, message: 'success', data: null });
  });

  return [list, getById, create, update, updateStatus];
}

function filterByParams(store: unknown[], params: URLSearchParams): unknown[] {
  return store.filter((item) => {
    const record = item as Record<string, unknown>;
    for (const [key] of params) {
      if (key === 'pageNum' || key === 'pageSize') continue;
      const paramVal = params.get(key);
      if (paramVal && record[key] !== undefined && String(record[key]) !== paramVal) {
        return false;
      }
    }
    return true;
  });
}
