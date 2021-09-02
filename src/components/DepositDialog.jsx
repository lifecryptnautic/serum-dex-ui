import React from 'react';
import { Modal } from 'antd';
import {
  useSelectedBaseCurrencyAccount,
  useMarket,
  useSelectedQuoteCurrencyAccount,
} from '../utils/markets';
import { useWallet } from '../utils/wallet';
import Link from './Link';

export default function DepositDialog({ onClose, baseOrQuote }) {
  const { market, baseCurrency, quoteCurrency } = useMarket();

  const { providerName, providerUrl } = useWallet();
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount();
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount();
  const language = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'es';
  let coinMint;
  let account;
  let depositCoin;
  if (baseOrQuote === 'base') {
    coinMint = market?.baseMintAddress;
    account = baseCurrencyAccount;
    depositCoin = baseCurrency;
  } else if (baseOrQuote === 'quote') {
    coinMint = market?.quoteMintAddress;
    account = quoteCurrencyAccount;
    depositCoin = quoteCurrency;
  } else {
    account = null;
  }
  if (!coinMint) {
    return null;
  }
  return (
    <Modal
      title={depositCoin}
      visible={!!coinMint}
      onOk={onClose}
      onCancel={onClose}
    >
      <div style={{ paddingTop: '20px' }}>
        <p style={{ color: 'white' }}>
          {language === 'en' ? 'Mint address:' : 'Dirección de moneda:'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>{coinMint.toBase58()}</p>
        <div>
          <p style={{ color: 'white' }}>
            {language === 'en'
              ? 'SPL Deposit address:'
              : 'Dirección de depósito SPL:'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            {account ? (
              account.pubkey.toBase58()
            ) : (
              <>
                {language === 'en' ? 'Visit ' : 'Visite '}
                <Link external to={providerUrl}>
                  {providerName}
                </Link>{' '}
                {language === 'en'
                  ? 'to create an account for this mint'
                  : 'para crear una cuenta para esta moneda'}
              </>
            )}
          </p>
        </div>
      </div>
    </Modal>
  );
}
