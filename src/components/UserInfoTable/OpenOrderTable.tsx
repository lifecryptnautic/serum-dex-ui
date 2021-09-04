import React, { useState } from 'react';
import DataTable from '../layout/DataTable';

import styled from 'styled-components';
import { Button, Col, Row, Tag } from 'antd';
import { cancelOrder } from '../../utils/send';
import { useWallet } from '../../utils/wallet';
import { useSendConnection } from '../../utils/connection';
import { notify } from '../../utils/notifications';
import { DeleteOutlined } from '@ant-design/icons';
import { OrderWithMarketAndMarketName } from '../../utils/types';

const CancelButton = styled(Button)`
  color: #F5000C;
  border: 1px solid #E28309;
`;

export default function OpenOrderTable({
  openOrders,
  onCancelSuccess,
  pageSize,
  loading,
  marketFilter,
}: {
  openOrders: OrderWithMarketAndMarketName[] | null | undefined;
  onCancelSuccess?: () => void;
  pageSize?: number;
  loading?: boolean;
  marketFilter?: boolean;
}) {
  let { wallet } = useWallet();
  let connection = useSendConnection();

  const [cancelId, setCancelId] = useState(null);
  const language = (localStorage.getItem('language')? localStorage.getItem('language'): 'es');

  async function cancel(order) {
    setCancelId(order?.orderId);
    try {
      if (!wallet) {
        return null;
      }

      await cancelOrder({
        order,
        market: order.market,
        connection,
        wallet,
      });
    } catch (e) {
      notify({
        message: language === 'en' ? 'Error cancelling order' : 'Error cancelando la orden',
        description: e.message,
        type: 'error',
      });
      return;
    } finally {
      setCancelId(null);
    }
    onCancelSuccess && onCancelSuccess();
  }

  const marketFilters = [
    ...new Set((openOrders || []).map((orderInfos) => orderInfos.marketName)),
  ].map((marketName) => {
    return { text: marketName, value: marketName };
  });

  const columns = [
    {
      title: language === 'en' ? 'Market': 'Mercado',
      dataIndex: 'marketName',
      key: 'marketName',
      filters: marketFilter ? marketFilters : undefined,
      onFilter: (value, record) => record.marketName.indexOf(value) === 0,
    },
    {
      title: language === 'en' ? 'Side' : 'Tipo',
      dataIndex: 'side',
      key: 'side',
      render: (side) => (
        <Tag
          color={side === 'buy' ? '#00BA13' : '#F5000C'}
          style={{ fontWeight: 700 }}
        >
          {side.charAt(0).toUpperCase() + side.slice(1)}
        </Tag>
      ),
      sorter: (a, b) => {
        if (a.side === b.side) {
          return 0;
        } else if (a.side === 'buy') {
          return 1;
        } else {
          return -1;
        }
      },
      showSorterTooltip: false,
    },
    {
      title: language === 'en' ? 'Size': 'Tamaño',
      dataIndex: 'size',
      key: 'size',
      sorter: (a, b) => b.size - a.size,
      showSorterTooltip: false,
    },
    {
      title: language === 'en' ? 'Price': 'Precio',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => b.price - a.price,
      showSorterTooltip: false,
    },
    {
      key: 'orderId',
      render: (order) => (
        <div style={{ textAlign: 'right' }}>
          <CancelButton
            icon={<DeleteOutlined />}
            onClick={() => cancel(order)}
            loading={cancelId + '' === order?.orderId + ''}
          >
            {language === 'en' ? 'Cancel': 'Cancelar'}
          </CancelButton>
        </div>
      ),
    },
  ];
  const dataSource = (openOrders || []).map((order) => ({
    ...order,
    key: order.orderId,
  }));

  return (
    <Row>
      <Col span={24}>
        <DataTable
          emptyLabel={language === 'en' ? 'No open orders': 'No hay órdenes abiertas'}
          dataSource={dataSource}
          columns={columns}
          pagination={true}
          pageSize={pageSize ? pageSize : 5}
          loading={loading !== undefined && loading}
        />
      </Col>
    </Row>
  );
}
