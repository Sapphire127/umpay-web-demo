import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';

interface UseProTableOptions<T> {
  columns: ProColumns<T>[];
  request: (params: { pageSize: number; current: number;[key: string]: unknown }) => Promise<{
    items: T[];
    hasNext: boolean;
  }>;
  rowKey?: string;
  toolbarActions?: React.ReactNode[];
  searchLabelWidth?: number;
  searchSpan?: number;
}

export function useProTable<T>(options: UseProTableOptions<T>) {
  const actionRef = useRef<ActionType>(null);

  const TableComponent = () => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ProTable<any>
      actionRef={actionRef}
      columns={options.columns}
      request={async (params) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { pageSize = 20, current = 1, ...filters } = params;
        const { items, hasNext } = await options.request({ pageSize, current, ...filters });
        const total = hasNext
          ? (current + 1) * pageSize
          : (current - 1) * pageSize + items.length;
        return { data: items, success: true, total };
      }}
      rowKey={options.rowKey || 'id'}
      options={{ density: false, setting: false }}
      search={{
        labelWidth: options.searchLabelWidth || 'auto',
        ...(options.searchSpan != null ? { span: options.searchSpan } : {}),
      }}
      toolbar={{
        actions: options.toolbarActions,
      }}
      pagination={{ defaultPageSize: 20, showSizeChanger: true }}
    />
  );

  return { actionRef, TableComponent };
}
