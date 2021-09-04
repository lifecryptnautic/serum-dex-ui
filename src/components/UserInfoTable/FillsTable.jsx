import React from 'react';
import { Row, Col, Tag } from 'antd';
import { useFills, useMarket } from '../../utils/markets';
import DataTable from '../layout/DataTable';

export default function FillsTable() {
  const fills = useFills();

  const { quoteCurrency } = useMarket();

  const language = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'es';

  const columns = [
    {
      title: language === 'en' ? 'Market' : 'Mercado',
      dataIndex: 'marketName',
      key: 'marketName',
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
    },
    {
      title: language === 'en' ? `Size` : 'Tamaño',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: language === 'en' ? `Price` : 'Precio',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: language === 'en' ? `Liquidity` : 'Liquidez',
      dataIndex: 'liquidity',
      key: 'liquidity',
    },
    {
      title:
        language === 'en'
          ? quoteCurrency
            ? `Fees (${quoteCurrency})`
            : 'Fees'
          : quoteCurrency
          ? `Tarifa (${quoteCurrency})`
          : 'Tarifa',
      dataIndex: 'feeCost',
      key: 'feeCost',
    },
  ];

  const dataSource = (fills || []).map((fill) => ({
    ...fill,
    key: `${fill.orderId}${fill.side}`,
    liquidity: fill.eventFlags.maker ? 'Maker' : 'Taker',
  }));

  return (
    <>
      <Row>
        <Col span={24}>
          <DataTable
            dataSource={dataSource}
            columns={columns}
            pagination={true}
            pageSize={5}
            emptyLabel={language === 'en' ? 'No fills' : 'No hay registros'}
          />
        </Col>
      </Row>
    </>
  );
}
