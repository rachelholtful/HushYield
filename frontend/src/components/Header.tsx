import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__titles">
          <h1>HashYield</h1>
          <p>Stake ETH and collect cETH interest anytime.</p>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
