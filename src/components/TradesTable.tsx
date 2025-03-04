import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useMarket, useBonfidaTrades } from '../utils/markets';
import { getDecimalCount } from '../utils/utils';
import FloatingElement from './layout/FloatingElement';
import { BonfidaTrade } from '../utils/types';

const Title = styled.div`
  color: rgba(255,251,252,1);
`;
const SizeTitle = styled(Row)`
  padding: 20px 0 14px;
  color: #FDE907;
`;

const language = (localStorage.getItem('language')? localStorage.getItem('language'): 'es');

export default function PublicTrades({ smallScreen }) {
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const [trades, loaded] = useBonfidaTrades();

  return (
    <FloatingElement
      style={
        smallScreen
          ? { flex: 1 }
          : {
              marginTop: '10px',
              minHeight: '270px',
              maxHeight: 'calc(100vh - 700px)',
            }
      }
    >
      <Title>{language === 'en' ? 'Recent Market trades': 'Operaciones recientes del mercado'}</Title>
      <SizeTitle>
        <Col span={8}>{language === 'en' ? 'Price': 'Precio'} ({quoteCurrency}) </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {language === 'en' ? 'Size': 'Tamaño'} ({baseCurrency})
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {language === 'en' ? 'Time': 'Hora'}
        </Col>
      </SizeTitle>
      {!!trades && loaded && (
        <div
          style={{
            marginRight: '-20px',
            paddingRight: '5px',
            overflowY: 'scroll',
            maxHeight: smallScreen
              ? 'calc(100% - 75px)'
              : 'calc(100vh - 800px)',
          }}
        >
          {trades.map((trade: BonfidaTrade, i: number) => (
            <Row key={i} style={{ marginBottom: 4 }}>
              <Col
                span={8}
                style={{
                  color: trade.side === 'buy' ? '#00BA13' : '#F5000C',
                }}
              >
                {market?.tickSize && !isNaN(trade.price)
                  ? Number(trade.price).toFixed(
                      getDecimalCount(market.tickSize),
                    )
                  : trade.price}
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                {market?.minOrderSize && !isNaN(trade.size)
                  ? Number(trade.size).toFixed(
                      getDecimalCount(market.minOrderSize),
                    )
                  : trade.size}
              </Col>
              <Col span={8} style={{ textAlign: 'right', color: '#E28309' }}>
                {trade.time && new Date(trade.time).toLocaleTimeString()}
              </Col>
            </Row>
          ))}
        </div>
      )}
    </FloatingElement>
  );
}
