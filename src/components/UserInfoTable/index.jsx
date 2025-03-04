import BalancesTable from './BalancesTable';
import OpenOrderTable from './OpenOrderTable';
import React from 'react';
import { Tabs, Typography } from 'antd';
import FillsTable from './FillsTable';
import FloatingElement from '../layout/FloatingElement';
import FeesTable from './FeesTable';
import { useOpenOrders, useBalances, useMarket } from '../../utils/markets';

const { Paragraph } = Typography;
const { TabPane } = Tabs;
const language = localStorage.getItem('language')
  ? localStorage.getItem('language')
  : 'es';

export default function Index() {
  const { market } = useMarket();
  return (
    <FloatingElement style={{ flex: 1, paddingTop: 20 }}>
      <Typography>
        <Paragraph style={{ color: 'rgba(255,255,255, 1)' }}>
          {language === 'en'
            ? 'Make sure to go to Balances and click Settle to send out your funds.'
            : 'Asegúrese de ir a Saldos y hacer clic en Liquidar para enviar sus fondos.'}
        </Paragraph>
        <Paragraph style={{ color: 'rgba(204, 167, 0, 1)' }}>
          {language === 'en'
            ? 'To fund your wallet, '
            : 'Para financiar su billetera, vaya a '}
          <a href="https://ftx.com/#a=CedrosDex"> FTX Exchange</a>.
          {language === 'en'
            ? ' where you can get SOL and other SPL tokens.'
            : ' Puedes obtener SOL y otros tokens de Solana.'}
        </Paragraph>
      </Typography>
      <Tabs defaultActiveKey="orders">
        <TabPane
          tab={language === 'en' ? 'Open Orders' : 'Órdenes abiertas'}
          key="orders"
        >
          <OpenOrdersTab />
        </TabPane>
        <TabPane
          tab={
            language === 'en'
              ? 'Recent Trade History'
              : 'Historial de operaciones recientes'
          }
          key="fills"
        >
          <FillsTable />
        </TabPane>
        <TabPane tab={language === 'en' ? 'Balances' : 'Saldos'} key="balances">
          <BalancesTab />
        </TabPane>
        {market && market.supportsSrmFeeDiscounts ? (
          <TabPane
            tab={language === 'en' ? 'Fee discounts' : 'Descuentos en tarifas'}
            key="fees"
          >
            <FeesTable />
          </TabPane>
        ) : null}
      </Tabs>
    </FloatingElement>
  );
}

const OpenOrdersTab = () => {
  const openOrders = useOpenOrders();

  return <OpenOrderTable openOrders={openOrders} />;
};

const BalancesTab = () => {
  const balances = useBalances();

  return <BalancesTable balances={balances} />;
};
