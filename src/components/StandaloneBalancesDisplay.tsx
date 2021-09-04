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
import Oneinch from '../assets/logos/1inch.svg';
import Aave from '../assets/logos/Aave.svg';
import Akro from '../assets/logos/Akro.svg';
import Aleph from '../assets/logos/Aleph.png';
import Atlas from '../assets/logos/Atlas.svg';
import Bop from '../assets/logos/Bop.svg';
import Btc from '../assets/logos/Btc.svg';
import Ccai from '../assets/logos/Ccai.svg';
import Cel from '../assets/logos/Cel.svg';
import Comp from '../assets/logos/Comp.svg';
import Cope from '../assets/logos/Cope.png';
import Cream from '../assets/logos/Cream.svg';
import Crp from '../assets/logos/Crp.svg';
import Dxl from '../assets/logos/Dxl.svg';
import Eth from '../assets/logos/Eth.svg';
import Fida from '../assets/logos/Fida.svg';
import Front from '../assets/logos/Front.png';
import Ftr from '../assets/logos/Ftr.svg';
import Ftt from '../assets/logos/Ftt.svg';
import Grt from '../assets/logos/Grt.svg';
import Hget from '../assets/logos/Hget.png';
import Hnt from '../assets/logos/Hnt.png';
import Holy from '../assets/logos/Holy.svg';
import Hxro from '../assets/logos/Hxro.png';
import Keep from '../assets/logos/Keep.svg';
import Kin from '../assets/logos/Kin.svg';
import Lien from '../assets/logos/Lien.svg';
import Like from '../assets/logos/Like.svg';
import Linkicon from '../assets/logos/Link.svg';
import Liq from '../assets/logos/Liq.svg';
import Lqid from '../assets/logos/Lqid.svg';
import Lua from '../assets/logos/Lua.webp';
import Maps from '../assets/logos/Maps.webp';
import Math from '../assets/logos/Math.webp';
import Media from '../assets/logos/Media.svg';
import Mer from '../assets/logos/Mer.png';
import Mngo from '../assets/logos/Mngo.svg';
import Mola from '../assets/logos/Mola.svg';
import Orca from '../assets/logos/Orca.svg';
import Oxs from '../assets/logos/Oxs.svg';
import Oxy from '../assets/logos/Oxy.png';
import Paxg from '../assets/logos/Paxg.svg';
import Perp from '../assets/logos/Perp.svg';
import Polis from '../assets/logos/Polis.svg';
import Port from '../assets/logos/Port.svg';
import Ray from '../assets/logos/Ray.svg';
import Renbch from '../assets/logos/Renbch.svg';
import Renbtc from '../assets/logos/Renbtc.svg';
import Rendgb from '../assets/logos/Rendgb.svg';
import Rendoge from '../assets/logos/Rendoge.svg';
import Renfil from '../assets/logos/Renfil.svg';
import Renluna from '../assets/logos/Renluna.svg';
import Renzec from '../assets/logos/Renzec.svg';
import Rope from '../assets/logos/Rope.svg';
import Rsr from '../assets/logos/Rsr.svg';
import Sail from '../assets/logos/Sail.svg';
import Samo from '../assets/logos/Samo.svg';
import Sbr from '../assets/logos/Sbr.webp';
import Seco from '../assets/logos/Seco.svg';
import Slim from '../assets/logos/Slim.svg';
import Slrs from '../assets/logos/Slrs.svg';
import Sny from '../assets/logos/Sny.png';
import Sol from '../assets/logos/Sol.svg';
import Soldoge from '../assets/logos/Soldoge.svg';
import Srm from '../assets/logos/Srm.svg';
import Step from '../assets/logos/Step.svg';
import Sushi from '../assets/logos/Sushi.svg';
import Sxp from '../assets/logos/Sxp.svg';
import Tomo from '../assets/logos/Tomo.svg';
import Tulip from '../assets/logos/Tulip.svg';
import Ubxt from '../assets/logos/Ubxt.png';
import Uni from '../assets/logos/Uni.svg';
import Usdc from '../assets/logos/Usdc.png';
import Usdt from '../assets/logos/Usdt.svg';
import Woo from '../assets/logos/Woo.svg';
import Yfi from '../assets/logos/Yfi.svg';


const RowBox = styled(Row)`
  padding-bottom: 20px;
`;

const Tip = styled.p`
  font-size: 12px;
  padding-top: 6px;
`;

const ActionButton = styled(Button)`
  color: #FFD100;
  background-color: #179AFF;
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
  const language = (localStorage.getItem('language')? localStorage.getItem('language'): 'es')
  async function onSettleFunds() {
    if (!wallet) {
      notify({
        message: language === 'en' ? 'Wallet not connected': 'Billetera sin conectar',
        description: language === 'en' ? 'wallet is undefined' : 'billetera indefinida',
        type: 'error',
      });
      return;
    }

    if (!market) {
      notify({
        message: language === 'en' ? 'Error settling funds': 'Error al liquidar fondos',
        description: language === 'en' ? 'market is undefined' : 'mercado indefinido',
        type: 'error',
      });
      return;
    }
    if (!openOrdersAccount) {
      notify({
        message: language === 'en' ? 'Error settling funds': 'Error al liquidar fondos',
        description: language === 'en' ? 'Open orders account is undefined': 'La cuenta de pedidos abiertos no está definida',
        type: 'error',
      });
      return;
    }
    if (!baseCurrencyAccount) {
      notify({
        message: language === 'en' ? 'Error settling funds': 'Error al liquidar fondos',
        description: language === 'en' ? 'Open orders account is undefined': 'La cuenta de pedidos abiertos no está definida',
        type: 'error',
      });
      return;
    }
    if (!quoteCurrencyAccount) {
      notify({
        message: language === 'en' ? 'Error settling funds': 'Error al liquidar fondos',
        description: language === 'en' ? 'Open orders account is undefined': 'La cuenta de pedidos abiertos no está definida',
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
        message: language === 'en' ? 'Error settling funds': 'Error al liquidar fondos',
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
    '1INCH' : Oneinch,
    'AAVE' : Aave,
    'AKRO' : Akro,
    'ALEPH' : Aleph,
    'ATLAS' : Atlas,
    'BOP' : Bop,
    'BTC' : Btc,
    'CCAI' : Ccai,
    'CEL' : Cel,
    'COMP' : Comp,
    'COPE' : Cope,
    'CREAM' : Cream,
    'CRP' : Crp,
    'DXL' : Dxl,
    'ETH' : Eth,
    'FIDA' : Fida,
    'FRONT' : Front,
    'FTR' : Ftr,
    'FTT' : Ftt,
    'GRT' : Grt,
    'HGET' : Hget,
    'HNT' : Hnt,
    'HOLY' : Holy,
    'HXRO' : Hxro,
    'KEEP' : Keep,
    'KIN' : Kin,
    'LIEN' : Lien,
    'LIKE' : Like,
    'LINK' : Linkicon,
    'LIQ' : Liq,
    'LQID' : Lqid,
    'LUA' : Lua,
    'MAPS' : Maps,
    'MAPSPOOL' : Maps,
    'MATH' : Math,
    'MEDIA' : Media,
    'MER' : Mer,
    'MERPOOL' : Mer,
    'MNGO' : Mngo,
    'MOLA' : Mola,
    'ORCA' : Orca,
    'OXS' : Oxs,
    'OXY' : Oxy,
    'OXYPOOL' : Oxy,
    'PAXG' : Paxg,
    'PERP' : Perp,
    'POLIS' : Polis,
    'PORT' : Port,
    'RAY' : Ray,
    'RAYPOOL' : Ray,
    'ROPE' : Rope,
    'RSR' : Rsr,
    'SAIL' : Sail,
    'SAMO' : Samo,
    'SBR' : Sbr,
    'SECO' : Seco,
    'SLIM' : Slim,
    'SLRS' : Slrs,
    'SNY' : Sny,
    'SNYPOOL' : Sny,
    'SOL' : Sol,
    'SOLDOGE' : Soldoge,
    'SRM' : Srm,
    'STEP' : Step,
    'SUSHI' : Sushi,
    'SXP' : Sxp,
    'TOMO' : Tomo,
    'TULIP' : Tulip,
    'UBXT' : Ubxt,
    'UNI' : Uni,
    'USDT' : Usdt,
    'USDC' : Usdc,
    'WOO' : Woo,
    'YFI' : Yfi,
    'renBCH' : Renbch,
    'renBTC' : Renbtc,
    'renDOGE' : Rendoge,
    'renLUNA' : Renluna,
    'renZEC' : Renzec,
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
                  <InfoCircleOutlined style={{ color: '#F504B4' }} />
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
              <Col>{(language === 'en')?"Wallet balance:" : "Saldo:"}</Col>
              <Col>{balances && balances.wallet}</Col>
            </RowBox>
            <RowBox
              align="middle"
              justify="space-between"
              style={{ paddingBottom: 12 }}
            >
              <Col>{(language === 'en')?"Unsettled balance:" : "Saldo sin liquidar:"}</Col>
              <Col>{balances && balances.unsettled}</Col>
            </RowBox>
            <RowBox align="middle" justify="space-around">
              <Col style={{ width: 150 }}>
                <ActionButton
                  block
                  size="large"
                  onClick={() => setBaseOrQuote(baseOrQuote)}
                >
                  {(language === 'en')?"Deposit" : "Depositar"}
                </ActionButton>
              </Col>
              <Col style={{ width: 150 }}>
                <ActionButton block size="large" onClick={onSettleFunds}>
                {(language === 'en')?"Settle" : "Liquidar"}
                </ActionButton>
              </Col>
            </RowBox>
            <Tip>
              {(language === 'en')?"All deposits go to your " : "Todos los depósitos irán a su "}
              <Link external to={providerUrl}>
                {providerName}
              </Link>{' '}
              {(language === 'en')?"wallet" : "billetera"}
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
