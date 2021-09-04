import React from 'react';
import { Row, Col, Typography, Tag } from 'antd';
import { useFeeDiscountKeys } from '../../utils/markets';
import DataTable from '../layout/DataTable';
import { TokenInstructions, getFeeRates } from '@project-serum/serum';
import { percentFormat } from '../../utils/utils';

export default function FeesTable() {
  const [feeAccounts] = useFeeDiscountKeys();

  const language = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'es';

  const columns = [
    {
      title: 'Fee Tier',
      dataIndex: 'feeTier',
      key: 'feeTier',
      render: (feeTier, row) => (
        <div style={{ display: 'flex' }}>
          <Typography>{feeTier}</Typography>
          {row.index === 0 ? (
            <div style={{ marginLeft: 10 }}>
              <Tag color={'#00BA13'} style={{ fontWeight: 700 }}>
                {language === 'en' ? 'Selected' : 'Seleccionado'}
              </Tag>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: language === 'en' ? 'Taker' : 'Tomador',
      dataIndex: 'taker',
      key: 'taker',
      render: (feeTier, row) =>
        percentFormat.format(getFeeRates(row.feeTier).taker),
    },
    {
      title: language === 'en' ? 'Maker' : 'Creador',
      dataIndex: 'maker',
      key: 'maker',
      render: (feeTier, row) =>
        percentFormat.format(getFeeRates(row.feeTier).maker),
    },
    {
      title: language === 'en' ? `Public Key` : 'Clave pública',
      dataIndex: 'pubkey',
      key: 'pubkey',
      render: (pubkey) => pubkey.toBase58(),
    },
    {
      title: language === 'en' ? `Balance` : 'Saldo',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: language === 'en' ? `Mint` : 'Moneda',
      dataIndex: 'mint',
      key: 'mint',
      render: (_, row) =>
        row.mint.equals(TokenInstructions.SRM_MINT)
          ? 'SRM'
          : row.mint.equals(TokenInstructions.MSRM_MINT)
          ? 'MSRM'
          : 'UNKNOWN',
    },
  ];

  const dataSource = (feeAccounts || []).map((account, index) => ({
    ...account,
    index,
    key: account.pubkey.toBase58(),
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
            emptyLabel={
              language === 'en' ? 'No (M)SRM accounts' : 'No hay cuentas (M)SRM'
            }
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <Col>
          <Typography>
            {language === 'en'
              ? 'Holding SRM or MSRM makes you eligible for fee discounts:'
              : 'Tener SRM o MSRM lo hace elegible para descuentos en las tarifas:'}
          </Typography>
          <FeeScheduleTable />
        </Col>
      </Row>
    </>
  );
}

function FeeScheduleTable() {
  // Representation of serum-js/src/fees.ts
  const language = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'es';

  const dataSource = [
    { feeTier: 0, taker: 0.0022, maker: -0.0003, token: '', balance: '' },
    { feeTier: 1, taker: 0.002, maker: -0.0003, token: 'SRM', balance: 100 },
    { feeTier: 2, taker: 0.0018, maker: -0.0003, token: 'SRM', balance: 1000 },
    { feeTier: 3, taker: 0.0016, maker: -0.0003, token: 'SRM', balance: 10000 },
    {
      feeTier: 4,
      taker: 0.0014,
      maker: -0.0003,
      token: 'SRM',
      balance: 100000,
    },
    {
      feeTier: 5,
      taker: 0.0012,
      maker: -0.0003,
      token: 'SRM',
      balance: 1000000,
    },
    { feeTier: 6, taker: 0.001, maker: -0.0005, token: 'MSRM', balance: 1 },
  ];
  const columns = [
    {
      title: language === 'en' ? 'Fee Tier' : 'Nivel de tarifa',
      dataIndex: 'feeTier',
      key: 'feeTier',
    },
    {
      title: language === 'en' ? 'Taker' : 'Tomador',
      dataIndex: 'taker',
      key: 'taker',
      render: (feeTier, row) =>
        percentFormat.format(getFeeRates(row.feeTier).taker),
    },
    {
      title: language === 'en' ? 'Maker' : 'Creador',
      dataIndex: 'maker',
      key: 'maker',
      render: (feeTier, row) =>
        percentFormat.format(getFeeRates(row.feeTier).maker),
    },
    {
      title: language === 'en' ? 'Requirements' : 'Requerimientos',
      dataIndex: 'requirements',
      key: 'requirements',
      render: (_, row) => (
        <Typography>
          {!row.balance
            ? language === 'en'
              ? 'None'
              : 'Ninguno'
            : `≥ ${row.balance} ${row.token}`}
        </Typography>
      ),
    },
  ];
  return (
    <DataTable
      dataSource={dataSource.map((info) => ({ ...info, key: info.feeTier }))}
      columns={columns}
    />
  );
}
