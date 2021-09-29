import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Popover, Row, Select, Typography } from 'antd';
import styled from 'styled-components';
import Orderbook from '../components/Orderbook';
import UserInfoTable from '../components/UserInfoTable';
import StandaloneBalancesDisplay from '../components/StandaloneBalancesDisplay';
import Oneinch from '../assets/logos/1inch.svg';
import Aave from '../assets/logos/Aave.svg';
import Abr from '../assets/logos/Abr.svg';
import Akro from '../assets/logos/Akro.svg';
import Aleph from '../assets/logos/Aleph.png';
import Atlas from '../assets/logos/Atlas.svg';
import Blt from '../assets/logos/Blt.jpg';
import Bop from '../assets/logos/Bop.svg';
import Btc from '../assets/logos/Btc.svg';
import Ccai from '../assets/logos/Ccai.svg';
import Cel from '../assets/logos/Cel.svg';
import Comp from '../assets/logos/Comp.svg';
import Cope from '../assets/logos/Cope.png';
import Cream from '../assets/logos/Cream.svg';
import Crp from '../assets/logos/Crp.svg';
import Cys from '../assets/logos/Cys.svg';
import Date from '../assets/logos/Date.svg';
import Dxl from '../assets/logos/Dxl.svg';
import Eth from '../assets/logos/Eth.svg';
import Fida from '../assets/logos/Fida.svg';
import Front from '../assets/logos/Front.png';
import Ftr from '../assets/logos/Ftr.svg';
import Ftt from '../assets/logos/Ftt.svg';
import Grape from '../assets/logos/Grape.png';
import Grt from '../assets/logos/Grt.svg';
import Hget from '../assets/logos/Hget.png';
import Hnt from '../assets/logos/Hnt.png';
import Holy from '../assets/logos/Holy.svg';
import Hxro from '../assets/logos/Hxro.png';
import Isola from '../assets/logos/Isola.png';
import Ivn from '../assets/logos/Ivn.png';
import Keep from '../assets/logos/Keep.svg';
import Kin from '../assets/logos/Kin.svg';
import Kuro from '../assets/logos/Kuro.png';
import Larix from '../assets/logos/Larix.jpg';
import Lien from '../assets/logos/Lien.svg';
import Like from '../assets/logos/Like.svg';
import Link from '../assets/logos/Link.svg';
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
import Prt from '../assets/logos/Prt.svg';
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
import Solpad from '../assets/logos/Solpad.png';
import Srm from '../assets/logos/Srm.svg';
import Step from '../assets/logos/Step.svg';
import Str from '../assets/logos/Str.png';
import Stsol from '../assets/logos/Stsol.png';
import Sushi from '../assets/logos/Sushi.svg';
import Sxp from '../assets/logos/Sxp.svg';
import Syp from '../assets/logos/Syp.jpg';
import Tomo from '../assets/logos/Tomo.svg';
import Tulip from '../assets/logos/Tulip.svg';
import Ubxt from '../assets/logos/Ubxt.png';
import Uni from '../assets/logos/Uni.svg';
import Usdt from '../assets/logos/Usdt.svg';
import Woo from '../assets/logos/Woo.svg';
import Yfi from '../assets/logos/Yfi.svg';

import {
  getMarketInfos,
  getTradePageUrl,
  MarketProvider,
  useMarket,
  useMarketsList,
  useUnmigratedDeprecatedMarkets,
} from '../utils/markets';
import TradeForm from '../components/TradeForm';
import TradesTable from '../components/TradesTable';
import LinkAddress from '../components/LinkAddress';
import DeprecatedMarketsInstructions from '../components/DeprecatedMarketsInstructions';
import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomMarketDialog from '../components/CustomMarketDialog';
import { notify } from '../utils/notifications';
import { useHistory, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';

import { TVChartContainer } from '../components/TradingView';
// Use following stub for quick setup without the TradingView private dependency
// function TVChartContainer() {
//   return <></>
// }

const { Option, OptGroup } = Select;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;

export default function TradePage() {
  const { marketAddress } = useParams();
  useEffect(() => {
    if (marketAddress) {
      localStorage.setItem('marketAddress', JSON.stringify(marketAddress));
    }
  }, [marketAddress]);
  const history = useHistory();
  function setMarketAddress(address) {
    history.push(getTradePageUrl(address));
  }

  return (
    <MarketProvider
      marketAddress={marketAddress}
      setMarketAddress={setMarketAddress}
    >
      <TradePageInner />
    </MarketProvider>
  );
}

function TradePageInner() {
  const {
    market,
    marketName,
    customMarkets,
    setCustomMarkets,
    setMarketAddress,
  } = useMarket();
  const markets = useMarketsList();
  const [handleDeprecated, setHandleDeprecated] = useState(false);
  const [addMarketVisible, setAddMarketVisible] = useState(false);
  const deprecatedMarkets = useUnmigratedDeprecatedMarkets();
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  
  useEffect(() => {
    document.title = marketName ? `${marketName} — Serum` : 'Serum';
  }, [marketName]);

  const changeOrderRef = useRef<
    ({ size, price }: { size?: number; price?: number }) => void
  >();

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = dimensions?.width;
  const componentProps = {
    onChangeOrderRef: (ref) => (changeOrderRef.current = ref),
    onPrice: useCallback(
      (price) => changeOrderRef.current && changeOrderRef.current({ price }),
      [],
    ),
    onSize: useCallback(
      (size) => changeOrderRef.current && changeOrderRef.current({ size }),
      [],
    ),
  };
  const component = (() => {
    if (handleDeprecated) {
      return (
        <DeprecatedMarketsPage
          switchToLiveMarkets={() => setHandleDeprecated(false)}
        />
      );
    } else if (width < 1000) {
      return <RenderSmaller {...componentProps} />;
    } else if (width < 1450) {
      return <RenderSmall {...componentProps} />;
    } else {
      return <RenderNormal {...componentProps} />;
    }
  })();

  const onAddCustomMarket = (customMarket) => {
    const marketInfo = getMarketInfos(customMarkets).some(
      (m) => m.address.toBase58() === customMarket.address,
    );
    if (marketInfo) {
      notify({
        message: `A market with the given ID already exists`,
        type: 'error',
      });
      return;
    }
    const newCustomMarkets = [...customMarkets, customMarket];
    setCustomMarkets(newCustomMarkets);
    setMarketAddress(customMarket.address);
  };

  const onDeleteCustomMarket = (address) => {
    const newCustomMarkets = customMarkets.filter((m) => m.address !== address);
    setCustomMarkets(newCustomMarkets);
  };

  return (
    <>
      <CustomMarketDialog
        visible={addMarketVisible}
        onClose={() => setAddMarketVisible(false)}
        onAddCustomMarket={onAddCustomMarket}
      />
      <Wrapper>
        <Row
          align="middle"
          style={{ paddingLeft: 5, paddingRight: 5 }}
          gutter={16}
        >
          <Col>
            <MarketSelector
              markets={markets}
              setHandleDeprecated={setHandleDeprecated}
              placeholder={'Select market'}
              customMarkets={customMarkets}
              onDeleteCustomMarket={onDeleteCustomMarket}
            />
          </Col>
          {market ? (
            <Col>
              <Popover
                content={<LinkAddress address={market.publicKey.toBase58()} />}
                placement="bottomRight"
                title="Market address"
                trigger="click"
              >
                <InfoCircleOutlined style={{ color: '#2abdd2' }} />
              </Popover>
            </Col>
          ) : null}
          <Col>
            <PlusCircleOutlined
              style={{ color: '#2abdd2' }}
              onClick={() => setAddMarketVisible(true)}
            />
          </Col>
          {deprecatedMarkets && deprecatedMarkets.length > 0 && (
            <React.Fragment>
              <Col>
                <Typography>
                  You have unsettled funds on old markets! Please go through
                  them to claim your funds.
                </Typography>
              </Col>
              <Col>
                <Button onClick={() => setHandleDeprecated(!handleDeprecated)}>
                  {handleDeprecated ? 'View new markets' : 'Handle old markets'}
                </Button>
              </Col>
            </React.Fragment>
          )}
        </Row>
        {component}
      </Wrapper>
    </>
  );
}

function MarketSelector({
  markets,
  placeholder,
  setHandleDeprecated,
  customMarkets,
  onDeleteCustomMarket,
}) {
  const { market, setMarketAddress } = useMarket();

  const Logos = {
    '1INCH/USDC' : Oneinch,
    'AAVE/USDC' : Aave,
    'ABR/USDC' : Abr,
    'AKRO/USDC' : Akro,
    'ALEPH/USDC' : Aleph,
    'ATLAS/USDC' : Atlas,
    'BLT/USDC' : Blt,
    'BOP/USDC' : Bop,
    'BTC/USDT' : Btc,
    'BTC/USDC' : Btc,
    'CCAI/USDC' : Ccai,
    'CEL/USDC' : Cel,
    'COMP/USDC' : Comp,
    'COPE/USDC' : Cope,
    'CREAM/USDC' : Cream,
    'CRP/USDC' : Crp,
    'CYS/USDC' : Cys,
    'DATE/USDC' : Date,
    'DXL/USDC' : Dxl,
    'ETH/USDT' : Eth,
    'ETH/USDC' : Eth,
    'FIDA/USDC' : Fida,
    'FRONT/USDC' : Front,
    'FTR/USDC' : Ftr,
    'FTT/USDC' : Ftt,
    'GRAPE/USDC' : Grape,
    'GRT/USDC' : Grt,
    'HGET/USDC' : Hget,
    'HNT/USDC' : Hnt,
    'HOLY/USDC' : Holy,
    'HXRO/USDC' : Hxro,
    'ISOLA/USDT' : Isola,
    'IVN/USDC' : Ivn,
    'KEEP/USDC' : Keep,
    'KIN/USDC' : Kin,
    'KURO/USDC' : Kuro,
    'LARIX/USDC' : Larix,
    'LIEN/USDC' : Lien,
    'LIKE/USDC' : Like,
    'LINK/USDC' : Link,
    'LIQ/USDC' : Liq,
    'LQID/USDC' : Lqid,
    'LUA/USDC' : Lua,
    'MAPS/USDC' : Maps,
    'MAPSPOOL/USDC' : Maps,
    'MATH/USDC' : Math,
    'MEDIA/USDC' : Media,
    'MER/USDC' : Mer,
    'MERPOOL/USDC' : Mer,
    'MNGO/USDC' : Mngo,
    'MOLA/USDC' : Mola,
    'ORCA/USDC' : Orca,
    'OXS/USDC' : Oxs,
    'OXY/USDC' : Oxy,
    'OXYPOOL/USDC' : Oxy,
    'PAXG/USDC' : Paxg,
    'PERP/USDC' : Perp,
    'POLIS/USDC' : Polis,
    'PORT/USDC' : Port,
    'PRT/USDC' : Prt,
    'RAY/USDC' : Ray,
    'RAYPOOL/USDC' : Ray,
    'ROPE/USDC' : Rope,
    'RSR/USDC' : Rsr,
    'SAIL/USDC' : Sail,
    'SAMO/USDC' : Samo,
    'SBR/USDC' : Sbr,
    'SECO/USDC' : Seco,
    'SLIM/USDC' : Slim,
    'SLRS/USDC' : Slrs,
    'SNY/USDC' : Sny,
    'SNYPOOL/USDC' : Sny,
    'SOL/USDC' : Sol,
    'SOLDOGE/USDC' : Soldoge,
    'SOLPAD/USDC' : Solpad,
    'SRM/USDC' : Srm,
    'STEP/USDC' : Step,
    'STR/USDC' : Str,
    'stSOL/USDC' : Stsol,
    'SUSHI/USDC' : Sushi,
    'SXP/USDC' : Sxp,
    'SYP/USDC' : Syp,
    'TOMO/USDC' : Tomo,
    'TULIP/USDC' : Tulip,
    'UBXT/USDC' : Ubxt,
    'UNI/USDC' : Uni,
    'USDT/USDC' : Usdt,
    'WOO/USDC' : Woo,
    'YFI/USDC' : Yfi,
    'renBCH/USDC' : Renbch,
    'renBTC/USDC' : Renbtc,
    'renDOGE/USDC' : Rendoge,
    'renLUNA/USDC' : Renluna,
    'renZEC/USDC' : Renzec,
  }


  const onSetMarketAddress = (marketAddress) => {
    setHandleDeprecated(false);
    setMarketAddress(marketAddress);
  };

  const extractBase = (a) => a.split('/')[0];
  const extractQuote = (a) => a.split('/')[1];

  const selectedMarket = getMarketInfos(customMarkets)
    .find(
      (proposedMarket) =>
        market?.address && proposedMarket.address.equals(market.address),
    )
    ?.address?.toBase58();

  return (
    <Select
      showSearch
      size={'large'}
      style={{ width: 200 }}
      placeholder={placeholder || 'Select a market'}
      optionFilterProp="name"
      onSelect={onSetMarketAddress}
      listHeight={400}
      value={selectedMarket}
      filterOption={(input, option) =>
        option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {customMarkets && customMarkets.length > 0 && (
        <OptGroup label="Custom">
          {customMarkets.map(({ address, name }, i) => (
            <Option
              value={address}
              key={nanoid()}
              name={name}
              style={{
                padding: '10px',
                // @ts-ignore
                backgroundColor: i % 2 === 0 ? 'rgb(39, 44, 61)' : null,
              }}
            >
              <Row>
                <Col flex="auto">{name}</Col>
                {selectedMarket !== address && (
                  <Col>
                    <DeleteOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        onDeleteCustomMarket && onDeleteCustomMarket(address);
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Option>
          ))}
        </OptGroup>
      )}
      <OptGroup label="Markets">
        {markets
          .sort((a, b) =>
            extractQuote(a.name) === 'USDT' && extractQuote(b.name) !== 'USDT'
              ? -1
              : extractQuote(a.name) !== 'USDT' &&
                extractQuote(b.name) === 'USDT'
              ? 1
              : 0,
          )
          .sort((a, b) =>
            extractBase(a.name) < extractBase(b.name)
              ? -1
              : extractBase(a.name) > extractBase(b.name)
              ? 1
              : 0,
          )
          .map(({ address, name, deprecated }, i) => (
            <Option
              value={address.toBase58()}
              key={nanoid()}
              name={name}
              style={{
                padding: '10px',
                // @ts-ignore
                backgroundColor: i % 2 === 0 ? 'rgb(39, 44, 61)' : null,
              }}
            >
              <img src={Logos[name]} width="20px"/> {name} {deprecated ? ' (Deprecated)' : null}
            </Option>
          ))}
      </OptGroup>
    </Select>
  );
}

const DeprecatedMarketsPage = ({ switchToLiveMarkets }) => {
  return (
    <>
      <Row>
        <Col flex="auto">
          <DeprecatedMarketsInstructions
            switchToLiveMarkets={switchToLiveMarkets}
          />
        </Col>
      </Row>
    </>
  );
};

const RenderNormal = ({ onChangeOrderRef, onPrice, onSize }) => {
  return (
    <Row
      style={{
        minHeight: '900px',
        flexWrap: 'nowrap',
      }}
    >
      <Col flex="auto" style={{ height: '50vh' }}>
        <Row style={{ height: '100%' }}>
          <TVChartContainer />
        </Row>
        <Row style={{ height: '70%' }}>
          <UserInfoTable />
        </Row>
      </Col>
      <Col flex={'360px'} style={{ height: '100%' }}>
        <Orderbook smallScreen={false} onPrice={onPrice} onSize={onSize} />
        <TradesTable smallScreen={false} />
      </Col>
      <Col
        flex="400px"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <TradeForm setChangeOrderRef={onChangeOrderRef} />
        <StandaloneBalancesDisplay />
      </Col>
    </Row>
  );
};

const RenderSmall = ({ onChangeOrderRef, onPrice, onSize }) => {
  return (
    <>
      <Row style={{ height: '30vh' }}>
        <TVChartContainer />
      </Row>
      <Row
        style={{
          height: '900px',
        }}
      >
        <Col flex="auto" style={{ height: '100%', display: 'flex' }}>
          <Orderbook
            smallScreen={true}
            depth={13}
            onPrice={onPrice}
            onSize={onSize}
          />
        </Col>
        <Col flex="auto" style={{ height: '100%', display: 'flex' }}>
          <TradesTable smallScreen={true} />
        </Col>
        <Col
          flex="400px"
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <TradeForm setChangeOrderRef={onChangeOrderRef} />
          <StandaloneBalancesDisplay />
        </Col>
      </Row>
      <Row>
        <Col flex="auto">
          <UserInfoTable />
        </Col>
      </Row>
    </>
  );
};

const RenderSmaller = ({ onChangeOrderRef, onPrice, onSize }) => {
  return (
    <>
      <Row style={{ height: '50vh' }}>
        <TVChartContainer />
      </Row>
      <Row>
        <Col xs={24} sm={12} style={{ height: '100%', display: 'flex' }}>
          <TradeForm style={{ flex: 1 }} setChangeOrderRef={onChangeOrderRef} />
        </Col>
        <Col xs={24} sm={12}>
          <StandaloneBalancesDisplay />
        </Col>
      </Row>
      <Row
        style={{
          height: '500px',
        }}
      >
        <Col xs={24} sm={12} style={{ height: '100%', display: 'flex' }}>
          <Orderbook smallScreen={true} onPrice={onPrice} onSize={onSize} />
        </Col>
        <Col xs={24} sm={12} style={{ height: '100%', display: 'flex' }}>
          <TradesTable smallScreen={true} />
        </Col>
      </Row>
      <Row>
        <Col flex="auto">
          <UserInfoTable />
        </Col>
      </Row>
    </>
  );
};
