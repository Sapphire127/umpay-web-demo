import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useProTable } from '@/page/shared/useProTable';
import { Active } from '@/domain/shared/types';
import { getUsers, updateUserStatus } from '@/domain/user/userService';
import type { AdminUser } from '@/domain/user/user';

export default function UsersPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const columns: ProColumns<AdminUser>[] = [
    { title: 'ID', dataIndex: 'id', width: 80, search: false },
    {
      title: t('login.username'),
      dataIndex: 'username',
      search: false,
    },
    {
      title: t('user.name'),
      dataIndex: 'name',
      search: false,
    },
    {
      title: t('user.role'),
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        ADMIN: { text: 'Admin' },
        CP: { text: 'CP' },
      },
    },
    {
      title: t('user.status'),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        [Active.ENABLED]: { text: t('user.enabled'), status: 'Success' },
        [Active.DISABLED]: { text: t('user.disabled'), status: 'Error' },
      },
      render: (_, record) => (
        <Tag color={record.status === Active.ENABLED ? 'green' : 'red'}>
          {record.status === Active.ENABLED ? t('user.enabled') : t('user.disabled')}
        </Tag>
      ),
    },
    {
      title: t('user.lastLoginAt'),
      dataIndex: 'lastLoginAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: t('user.actions'),
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="status"
          type="link"
          size="small"
          onClick={async () => {
            const newStatus = record.status === Active.ENABLED ? Active.DISABLED : Active.ENABLED;
            await updateUserStatus(record.id, newStatus);
            message.success(t('user.statusUpdated'));
            actionRef.current?.reload();
          }}
        >
          {record.status === Active.ENABLED ? t('user.disable') : t('user.enable')}
        </Button>,
      ],
    },
  ];

  const { TableComponent, actionRef } = useProTable<AdminUser>({
    columns,
    request: async ({ pageSize, current, ...filters }) => {
      const res = await getUsers({
        pageNum: current,
        pageSize,
        role: filters.role as string,
        status: filters.status as string,
      });
      return { items: res.items, hasNext: res.hasNext };
    },
    searchSpan: 5,
    toolbarActions: [
      <Button key="create" type="primary" icon={<PlusOutlined />}>
        {t('user.create')}
      </Button>,
    ],
  });

  return <TableComponent />;
}
