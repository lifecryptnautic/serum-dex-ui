import { Button, Col, Divider, Popover, Row } from 'antd';
import React, { useState } from 'react';
import FloatingElement from './layout/FloatingElement';
import styled from 'styled-components';
import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
  useTokenAccounts,
} from '../utils/markets';
import DepositDialog from './DepositDialog';
import { useWallet } from '../utils/wallet';
import Link from './Link';
import { settleFunds } from '../utils/send';
import { useSendConnection } from '../utils/connection';
import { notify } from '../utils/notifications';
import { Balances } from '../utils/types';
import StandaloneTokenAccountsSelect from './StandaloneTokenAccountSelect';
import LinkAddress from './LinkAddress';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useInterval } from '../utils/useInterval';
import { useLocalStorageState } from '../utils/utils';
import { AUTO_SETTLE_DISABLED_OVERRIDE } from '../utils/preferences';
import { useReferrer } from '../utils/referrer';
import Aave from '../assets/logos/Aave.svg';
import Akro from '../assets/logos/Akro.svg';
import Aleph from '../assets/logos/Aleph.png';
import Btc from '../assets/logos/Btc.svg';
import Cel from '../assets/logos/Cel.svg';
import Cope from '../assets/logos/Cope.png';
import Cream from '../assets/logos/Cream.svg';
import Eth from '../assets/logos/Eth.svg';
import Fida from '../assets/logos/Fida.svg';
import Front from '../assets/logos/Front.png';
import Ftt from '../assets/logos/Ftt.svg';
import Hget from '../assets/logos/Hget.png';
import Hnt from '../assets/logos/Hnt.png';
import Hxro from '../assets/logos/Hxro.png';
import Keep from '../assets/logos/Keep.svg';
import Kin from '../assets/logos/Kin.svg';
import Linkc from '../assets/logos/Link.svg';
import Lua from '../assets/logos/Lua.webp';
import Maps from '../assets/logos/Maps.webp';
import Math from '../assets/logos/Math.webp';
import Mer from '../assets/logos/Mer.png';
import Msrm from '../assets/logos/Msrm.svg';
import Oxy from '../assets/logos/Oxy.png';
import Ray from '../assets/logos/Ray.svg';
import Rsr from '../assets/logos/Rsr.svg';
import Sbr from '../assets/logos/Sbr.webp';
import Slrs from '../assets/logos/Slrs.svg';
import Sny from '../assets/logos/Sny.png';
import Sol from '../assets/logos/Sol.svg';
import Srm from '../assets/logos/Srm.svg';
import Sushi from '../assets/logos/Sushi.svg';
import Sxp from '../assets/logos/Sxp.svg';
import Tomo from '../assets/logos/Tomo.svg';
import Ubxt from '../assets/logos/Ubxt.png';
import Uni from '../assets/logos/Uni.svg';
import Usdc from '../assets/logos/Usdc.png';
import Usdt from '../assets/logos/Usdt.svg';
import Yfi from '../assets/logos/Yfi.svg';


const RowBox = styled(Row)`
  padding-bottom: 20px;
`;

const Tip = styled.p`
  font-size: 12px;
  padding-top: 6px;
`;

const ActionButton = styled(Button)`
  color: #2abdd2;
  background-color: #212734;
  border-width: 0px;
`;

export default function StandaloneBalancesDisplay() {
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const balances = useBalances();
  const openOrdersAccount = useSelectedOpenOrdersAccount(true);
  const connection = useSendConnection();
  const { providerUrl, providerName, wallet, connected } = useWallet();
  const [baseOrQuote, setBaseOrQuote] = useState('');
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount();
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount();
  const [tokenAccounts] = useTokenAccounts();
  const baseCurrencyBalances =
    balances && balances.find((b) => b.coin === baseCurrency);
  const quoteCurrencyBalances =
    balances && balances.find((b) => b.coin === quoteCurrency);
  const [autoSettleEnabled] = useLocalStorageState('autoSettleEnabled', true);
  const [lastSettledAt, setLastSettledAt] = useState<number>(0);
  const { usdcRef, usdtRef } = useReferrer();
  async function onSettleFunds() {
    if (!wallet) {
      notify({
        message: 'Wallet not connected',
        description: 'wallet is undefined',
        type: 'error',
      });
      return;
    }

    if (!market) {
      notify({
        message: 'Error settling funds',
        description: 'market is undefined',
        type: 'error',
      });
      return;
    }
    if (!openOrdersAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }
    if (!baseCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }
    if (!quoteCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }

    try {
      await settleFunds({
        market,
        openOrders: openOrdersAccount,
        connection,
        wallet,
        baseCurrencyAccount,
        quoteCurrencyAccount,
        usdcRef,
        usdtRef,
      });
    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      });
    }
  }

  useInterval(() => {
    const autoSettle = async () => {
      if (
        AUTO_SETTLE_DISABLED_OVERRIDE ||
        !wallet ||
        !market ||
        !openOrdersAccount ||
        !baseCurrencyAccount ||
        !quoteCurrencyAccount ||
        !autoSettleEnabled
      ) {
        return;
      }
      if (
        !baseCurrencyBalances?.unsettled &&
        !quoteCurrencyBalances?.unsettled
      ) {
        return;
      }
      if (Date.now() - lastSettledAt < 15000) {
        return;
      }
      try {
        console.log('Settling funds...');
        setLastSettledAt(Date.now());
        await settleFunds({
          market,
          openOrders: openOrdersAccount,
          connection,
          wallet,
          baseCurrencyAccount,
          quoteCurrencyAccount,
          usdcRef,
          usdtRef,
        });
      } catch (e) {
        console.log('Error auto settling funds: ' + e.message);
        return;
      }
      console.log('Finished settling funds.');
    };
    connected && wallet?.autoApprove && autoSettleEnabled && autoSettle();
  }, 1000);

  const formattedBalances: [
    string | undefined,
    Balances | undefined,
    string,
    string | undefined,
  ][] = [
    [
      baseCurrency,
      baseCurrencyBalances,
      'base',
      market?.baseMintAddress.toBase58(),
    ],
    [
      quoteCurrency,
      quoteCurrencyBalances,
      'quote',
      market?.quoteMintAddress.toBase58(),
    ],
  ];

  const Logos = {
    'AAVE' : Aave,
    'AKRO' : Akro,
    'ALEPH' : Aleph,
    'BTC' : Btc,
    'CEL' : Cel,
    'COPE' : Cope,
    'CREAM' : Cream,
    'ETH' : Eth,
    'ETHV' : Eth,
    'FIDA' : Fida,
    'FRONT' : Front,
    'FTT' : Ftt,
    'HGET' : Hget,
    'HNT' : Hnt,
    'HXRO' : Hxro,
    'KEEP' : Keep,
    'KIN' : Kin,
    'LINK' : Linkc,
    'LUA' : Lua,
    'MAPS' : Maps,
    'MATH' : Math,
    'MER' : Mer,
    'MSRM' : Msrm,
    'OXY' : Oxy,
    'OXY/WUSDT' : Oxy,
    'RAY' : Ray,
    'RSR' : Rsr,
    'SBR' : Sbr,
    'SLRS' : Slrs,
    'SNY' : Sny,
    'SOL' : Sol,
    'SRM' : Srm,
    'SUSHI' : Sushi,
    'SXP' : Sxp,
    'TOMO' : Tomo,
    'UBXT' : Ubxt,
    'UNI' : Uni,
    'USDC' : Usdc,
    'USDT' : Usdt,
    'YFI' : Yfi,
  }

  return (
    <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
      {formattedBalances.map(
        ([currency, balances, baseOrQuote, mint], index) => (
          <React.Fragment key={index}>
            <Divider style={{ borderColor: 'white' }}>
              {currency}{' '} <img src={Logos[currency?.toString() || ""]} width="20px"/>
              {mint && (
                <Popover
                  content={<LinkAddress address={mint} />}
                  placement="bottomRight"
                  title="Token mint"
                  trigger="hover"
                >
                  <InfoCircleOutlined style={{ color: '#2abdd2' }} />
                </Popover>
              )}
            </Divider>
            {connected && (
              <RowBox align="middle" style={{ paddingBottom: 10 }}>
                <StandaloneTokenAccountsSelect
                  accounts={tokenAccounts?.filter(
                    (account) => account.effectiveMint.toBase58() === mint,
                  )}
                  mint={mint}
                  label
                />
              </RowBox>
            )}
            <RowBox
              align="middle"
              justify="space-between"
              style={{ paddingBottom: 12 }}
            >
              <Col>Wallet balance:</Col>
              <Col>{balances && balances.wallet}</Col>
            </RowBox>
            <RowBox
              align="middle"
              justify="space-between"
              style={{ paddingBottom: 12 }}
            >
              <Col>Unsettled balance:</Col>
              <Col>{balances && balances.unsettled}</Col>
            </RowBox>
            <RowBox align="middle" justify="space-around">
              <Col style={{ width: 150 }}>
                <ActionButton
                  block
                  size="large"
                  onClick={() => setBaseOrQuote(baseOrQuote)}
                >
                  Deposit
                </ActionButton>
              </Col>
              <Col style={{ width: 150 }}>
                <ActionButton block size="large" onClick={onSettleFunds}>
                  Settle
                </ActionButton>
              </Col>
            </RowBox>
            <Tip>
              All deposits go to your{' '}
              <Link external to={providerUrl}>
                {providerName}
              </Link>{' '}
              wallet
            </Tip>
          </React.Fragment>
        ),
      )}
      <DepositDialog
        baseOrQuote={baseOrQuote}
        onClose={() => setBaseOrQuote('')}
      />
    </FloatingElement>
  );
}
