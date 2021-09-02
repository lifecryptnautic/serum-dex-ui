import React, { useState } from 'react';
import DataTable from '../layout/DataTable';
import { Button, Row } from 'antd';
import { settleAllFunds } from '../../utils/send';
import { notify } from '../../utils/notifications';
import { useConnection } from '../../utils/connection';
import { useWallet } from '../../utils/wallet';
import {
  useAllMarkets,
  useSelectedTokenAccounts,
  useTokenAccounts,
} from '../../utils/markets';
import StandaloneTokenAccountsSelect from '../StandaloneTokenAccountSelect';
import { abbreviateAddress } from '../../utils/utils';
import { PublicKey } from '@solana/web3.js';

export default function WalletBalancesTable({
  walletBalances,
}: {
  walletBalances: {
    coin: string;
    mint: string;
    walletBalance: number;
    openOrdersFree: number;
    openOrdersTotal: number;
  }[];
}) {
  const connection = useConnection();
  const { wallet, connected } = useWallet();
  const [selectedTokenAccounts] = useSelectedTokenAccounts();
  const [tokenAccounts, tokenAccountsConnected] = useTokenAccounts();
  const [allMarkets, allMarketsConnected] = useAllMarkets();
  const [settlingFunds, setSettlingFunds] = useState(false);

  const language = (localStorage.getItem('language')? localStorage.getItem('language'): 'es');

  async function onSettleFunds() {
    setSettlingFunds(true);
    try {
      if (!wallet) {
        notify({
          message: 'Wallet not connected',
          description: 'Wallet not connected',
          type: 'error',
        });
        return;
      }

      if (!tokenAccounts || !tokenAccountsConnected) {
        notify({
          message: language === 'en' ? 'Error settling funds' : 'Error liquidando los fondos',
          description: language === 'en' ? 'TokenAccounts not connected' : 'No está conectada la cuenta',
          type: 'error',
        });
        return;
      }
      if (!allMarkets || !allMarketsConnected) {
        notify({
          message: language === 'en' ? 'Error settling funds' : 'Error liquidando los fondos',
          description: language === 'en' ? 'Markets not connected' : 'Mercados no conectados',
          type: 'error',
        });
        return;
      }
      await settleAllFunds({
        connection,
        tokenAccounts,
        selectedTokenAccounts,
        wallet,
        markets: allMarkets.map((marketInfo) => marketInfo.market),
      });
    } catch (e) {
      notify({
        message: language === 'en' ? 'Error settling funds' : 'Error liquidando los fondos',
        description: e.message,
        type: 'error',
      });
    } finally {
      setSettlingFunds(false);
    }
  }

  const columns = [
    {
      title: language === 'en' ? 'Coin' : 'Moneda',
      key: 'coin',
      width: '20%',
      render: (walletBalance) => (
        <Row align="middle">
          <a
            href={`https://solscan.io/address/${walletBalance.mint}`}
            target={'_blank'}
            rel="noopener noreferrer"
          >
            {walletBalance.coin ||
              abbreviateAddress(new PublicKey(walletBalance.mint))}
          </a>
        </Row>
      ),
    },
    {
      title: language === 'en' ? 'Wallet Balance' : 'Saldo de la billetera',
      dataIndex: 'walletBalance',
      key: 'walletBalance',
      width: '20%',
    },
    {
      title: language === 'en' ? 'Open orders total balances' : 'Saldo total de las órdenes abiertas',
      dataIndex: 'openOrdersTotal',
      key: 'openOrdersTotal',
      width: '20%',
    },
    {
      title: language === 'en' ? 'Unsettled balances' : 'Saldo sin liquidar',
      dataIndex: 'openOrdersFree',
      key: 'openOrdersFree',
      width: '20%',
    },
    {
      title: language === 'en' ? 'Selected token account' : 'Cuenta seleccionada',
      key: 'selectTokenAccount',
      width: '20%',
      render: (walletBalance) => (
        <Row align="middle" style={{ width: '430px' }}>
          <StandaloneTokenAccountsSelect
            accounts={tokenAccounts?.filter(
              (t) => t.effectiveMint.toBase58() === walletBalance.mint,
            )}
            mint={walletBalance.mint}
          />
        </Row>
      ),
    },
  ];
  return (
    <React.Fragment>
      <DataTable
        emptyLabel={language === 'en' ? 'No balances' : 'No hay saldos para mostrar'}
        dataSource={walletBalances}
        columns={columns}
        pagination={false}
      />
      {connected && (
        <Button onClick={onSettleFunds} loading={settlingFunds}>
          {language === 'en' ? 'Settle all funds' : 'Liquidar todos los fondos'}
        </Button>
      )}
    </React.Fragment>
  );
}
