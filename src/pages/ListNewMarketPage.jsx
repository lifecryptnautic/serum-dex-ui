import React, { useState } from 'react';
import { Button, Form, Input, Tooltip, Typography } from 'antd';
import { notify } from '../utils/notifications';
import { MARKETS } from '@project-serum/serum';
import { useConnection } from '../utils/connection';
import FloatingElement from '../components/layout/FloatingElement';
import styled from 'styled-components';
import { useWallet } from '../utils/wallet';
import { listMarket } from '../utils/send';
import { useMintInput } from '../components/useMintInput';

const { Text, Title } = Typography;

const Wrapper = styled.div`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24px;
  margin-bottom: 24px;
`;

export default function ListNewMarketPage() {
  const language = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'es';
  const connection = useConnection();
  const { wallet, connected } = useWallet();
  const [baseMintInput, baseMintInfo] = useMintInput(
    'baseMint',
    <Text>
      {language === 'en'
        ? 'Base Token Mint Address '
        : 'Dirección de la moneda base '}
      <Text type="secondary">
        {language === 'en'
          ? '(e.g. BTC solana address: '
          : '(por ejemplo, la dirección de BTC solana es: '}
        {
          <Text type="secondary" code>
            9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E
          </Text>
        }
        )
      </Text>
    </Text>,
    language === 'en'
      ? 'The base token is the token being traded. For example, the base token of a BTC/USDT market is BTC.'
      : 'La moneda base es la moneda que se intercambia. Por ejemplo, la moneda base de un mercado BTC / USDT es BTC.',
  );
  const [quoteMintInput, quoteMintInfo] = useMintInput(
    'quoteMint',
    <Text>
      {language === 'en'
        ? 'Quote Token Mint Address '
        : 'Dirección de la moneda de cotización '}
      <Text type="secondary">
        {language === 'en'
          ? '(e.g. USDT solana address: '
          : '(por ejemplo, la dirección de USDT solana es: '}
        {
          <Text type="secondary" code>
            BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4
          </Text>
        }
        )
      </Text>
    </Text>,
    language === 'en'
      ? 'The quote token is the token used to price trades. For example, the quote token of a BTC/USDT market is USDT.'
      : 'La moneda de cotización es la moneda que se utiliza para cotizar las operaciones. Por ejemplo, la moneda de cotización de un mercado BTC / USDT es USDT.',
  );
  const [lotSize, setLotSize] = useState('1');
  const [tickSize, setTickSize] = useState('0.01');
  const dexProgramId = MARKETS.find(({ deprecated }) => !deprecated).programId;
  const [submitting, setSubmitting] = useState(false);

  const [listedMarket, setListedMarket] = useState(null);

  let baseLotSize;
  let quoteLotSize;
  if (baseMintInfo && parseFloat(lotSize) > 0) {
    baseLotSize = Math.round(10 ** baseMintInfo.decimals * parseFloat(lotSize));
    if (quoteMintInfo && parseFloat(tickSize) > 0) {
      quoteLotSize = Math.round(
        parseFloat(lotSize) *
          10 ** quoteMintInfo.decimals *
          parseFloat(tickSize),
      );
    }
  }

  const canSubmit =
    connected &&
    !!baseMintInfo &&
    !!quoteMintInfo &&
    !!baseLotSize &&
    !!quoteLotSize;

  async function onSubmit() {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    try {
      const marketAddress = await listMarket({
        connection,
        wallet,
        baseMint: baseMintInfo.address,
        quoteMint: quoteMintInfo.address,
        baseLotSize,
        quoteLotSize,
        dexProgramId,
      });
      setListedMarket(marketAddress);
    } catch (e) {
      console.warn(e);
      notify({
        message: 'Error listing new market',
        description: e.message,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Wrapper>
      <FloatingElement>
        <Title level={4}>
          {language === 'en' ? 'List New Market' : 'Nueva lista de mercado'}
        </Title>
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout={'vertical'}
          onFinish={onSubmit}
        >
          {baseMintInput}
          {quoteMintInput}
          <Form.Item
            label={
              <Tooltip
                title={
                  language === 'en'
                    ? 'Smallest allowed order size. For a BTC/USDT market, this would be in units of BTC.'
                    : 'Tamaño mínimo de orden permitido. Para un mercado BTC / USDT, se mediría en unidades de BTC.'
                }
              >
                {language === 'en'
                  ? 'Minimum Order Size '
                  : 'Tamaño mínimo de orden '}
                <Text type="secondary">
                  {language === 'en'
                    ? '(Lot size in e.g. BTC)'
                    : '(Tamaño mínimo del lote en BTC, por ejemplo)'}
                </Text>
              </Tooltip>
            }
            name="lotSize"
            initialValue="1"
            validateStatus={
              baseMintInfo && quoteMintInfo
                ? baseLotSize
                  ? 'success'
                  : 'error'
                : null
            }
            hasFeedback={baseMintInfo && quoteMintInfo}
          >
            <Input
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value.trim())}
              type="number"
              min="0"
              step="any"
            />
          </Form.Item>
          <Form.Item
            label={
              <Tooltip
                title={
                  language === 'en'
                    ? 'Smallest amount by which prices can move. For a BTC/USDT market, this would be in units of USDT.'
                    : 'Cantidad mínima por la que pueden moverse los precios. Para un mercado BTC / USDT, se mediría en unidades de USDT.'
                }
              >
                {language === 'en' ? 'Tick Size ' : 'Tamaño del Tick '}
                <Text type="secondary">
                  {language === 'en'
                    ? '(Price increment in e.g. USDT)'
                    : '(Incremento de precio en USDT, por ejemplo)'}
                </Text>
              </Tooltip>
            }
            name="tickSize"
            initialValue="0.01"
            validateStatus={
              baseMintInfo && quoteMintInfo
                ? quoteLotSize
                  ? 'success'
                  : 'error'
                : null
            }
            hasFeedback={baseMintInfo && quoteMintInfo}
          >
            <Input
              value={tickSize}
              onChange={(e) => setTickSize(e.target.value.trim())}
              type="number"
              min="0"
              step="any"
            />
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!canSubmit}
              loading={submitting}
            >
              {connected
                ? language === 'en'
                  ? 'Submit'
                  : 'Guardar'
                : language === 'en'
                ? 'Not connected to wallet'
                : 'No está conectado a la billetera'}
            </Button>
          </Form.Item>
        </Form>
      </FloatingElement>
      {listedMarket ? (
        <FloatingElement>
          <Text>New market address: {listedMarket.toBase58()}</Text>
        </FloatingElement>
      ) : null}
    </Wrapper>
  );
}
