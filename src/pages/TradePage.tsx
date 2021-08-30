import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Popover, Row, Select, Typography } from 'antd';
import styled from 'styled-components';
import Orderbook from '../components/Orderbook';
import UserInfoTable from '../components/UserInfoTable';
import StandaloneBalancesDisplay from '../components/StandaloneBalancesDisplay';
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
import Link from '../assets/logos/Link.svg';
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
import Usdt from '../assets/logos/Usdt.svg';
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
    'AAVE/USDT' : Aave,
    'AKRO/USDT' : Akro,
    'AKRO/USDC' : Akro,
    'ALEPH/USDT' : Aleph,
    'ALEPH/USDC' : Aleph,
    'BTC/USDT' : Btc,
    'BTC/USDC' : Btc,
    'CEL/USDT' : Cel,
    'COPE/USDC' : Cope,
    'CREAM/USDT' : Cream,
    'CREAM/USDC' : Cream,
    'ETH/USDT' : Eth,
    'ETH/USDC' : Eth,
    'ETHV/USDT' : Eth,
    'FIDA/USDT' : Fida,
    'FIDA/USDC' : Fida,
    'FRONT/USDT' : Front,
    'FRONT/USDC' : Front,
    'FTT/USDT' : Ftt,
    'FTT/USDC' : Ftt,
    'HGET/USDT' : Hget,
    'HGET/USDC' : Hget,
    'HNT/USDT' : Hnt,
    'HNT/USDC' : Hnt,
    'HXRO/USDT' : Hxro,
    'HXRO/USDC' : Hxro,
    'KEEP/USDT' : Keep,
    'KEEP/USDC' : Keep,
    'KIN/USDT' : Kin,
    'KIN/USDC' : Kin,
    'LINK/USDT' : Link,
    'LINK/USDC' : Link,
    'LUA/USDT' : Lua,
    'LUA/USDC' : Lua,
    'MAPS/USDT' : Maps,
    'MAPS/USDC' : Maps,
    'MATH/USDT' : Math,
    'MATH/USDC' : Math,
    'MER/USDT' : Mer,
    'MER/USDC' : Mer,
    'MSRM/USDT' : Msrm,
    'MSRM/USDC' : Msrm,
    'OXY/USDT' : Oxy,
    'OXY/WUSDT' : Oxy,
    'OXY/USDC' : Oxy,
    'RAY/USDT' : Ray,
    'RSR/USDT' : Rsr,
    'SBR/USDC' : Sbr,
    'SLRS/USDC' : Slrs,
    'SNY/USDC' : Sny,
    'SOL/USDT' : Sol,
    'SOL/USDC' : Sol,
    'SRM/USDT' : Srm,
    'SRM/USDC' : Srm,
    'SRM/SOL' : Srm,
    'SUSHI/USDT' : Sushi,
    'SUSHI/USDC' : Sushi,
    'SXP/USDT' : Sxp,
    'SXP/USDC' : Sxp,
    'TOMO/USDT' : Tomo,
    'TOMO/USDC' : Tomo,
    'UBXT/USDT' : Ubxt,
    'UBXT/USDC' : Ubxt,
    'UNI/USDT' : Uni,
    'UNI/USDC' : Uni,
    'USDT/USDC' : Usdt,
    'YFI/USDT' : Yfi,
    'YFI/USDC' : Yfi,
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
