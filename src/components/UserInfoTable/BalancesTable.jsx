import { Button } from 'antd';
import React from 'react';
import {
  useTokenAccounts,
  getSelectedTokenAccountForMint,
} from '../../utils/markets';
import DataTable from '../layout/DataTable';
import { useSendConnection } from '../../utils/connection';
import { useWallet } from '../../utils/wallet';
import { settleFunds } from '../../utils/send';
import { notify } from '../../utils/notifications';
import { useReferrer } from '../../utils/referrer';

export default function BalancesTable({
  balances,
  showMarket,
  hideWalletBalance,
  onSettleSuccess,
}) {
  const [accounts] = useTokenAccounts();
  const connection = useSendConnection();
  const { wallet } = useWallet();
  const { usdcRef, usdtRef } = useReferrer();

  const language = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'es';

  async function onSettleFunds(market, openOrders) {
    try {
      await settleFunds({
        market,
        openOrders,
        connection,
        wallet,
        baseCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.baseMintAddress,
        ),
        quoteCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.quoteMintAddress,
        ),
        usdcRef,
        usdtRef,
      });
    } catch (e) {
      notify({
        message:
          language === 'en'
            ? 'Error settling funds'
            : 'Error liquidando los fondos',
        description: e.message,
        type: 'error',
      });
      return;
    }
    onSettleSuccess && onSettleSuccess();
  }

  const columns = [
    showMarket
      ? {
          title: language === 'en' ? 'Market' : 'Mercado',
          dataIndex: 'marketName',
          key: 'marketName',
        }
      : null,
    {
      title: language === 'en' ? 'Coin' : 'Moneda',
      dataIndex: 'coin',
      key: 'coin',
    },
    hideWalletBalance
      ? null
      : {
          title: language === 'en' ? 'Wallet Balance' : 'Saldo de la billetera',
          dataIndex: 'wallet',
          key: 'wallet',
        },
    {
      title: language === 'en' ? 'Orders' : 'Órdenes',
      dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: language === 'en' ? 'Unsettled' : 'Sin liquidar',
      dataIndex: 'unsettled',
      key: 'unsettled',
    },
    {
      key: 'action',
      render: ({ market, openOrders, marketName }) => (
        <div style={{ textAlign: 'right' }}>
          <Button
            ghost
            style={{ marginRight: 12 }}
            onClick={() => onSettleFunds(market, openOrders)}
          >
            {language === 'en' ? 'Settle' : 'Liquidar'} {marketName}
          </Button>
        </div>
      ),
    },
  ].filter((x) => x);
  return (
    <DataTable
      emptyLabel="No balances"
      dataSource={balances}
      columns={columns}
      pagination={false}
    />
  );
}
