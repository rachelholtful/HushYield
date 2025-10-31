import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ethers } from 'ethers';
import { formatEther } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { CONTRACT_ADDRESS, HASH_YIELD_ABI, CETH_ABI } from '../config/contracts';
import { useEthersSigner } from '../hooks/useEthersSigner';
import '../styles/HashYieldApp.css';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type StakeSnapshot = {
  amount: bigint;
  claimable: bigint;
  lastAccrued: bigint;
  totalStaked: bigint;
  cEthBalance: bigint;
  rewardToken: `0x${string}` | null;
};

const INITIAL_STATE: StakeSnapshot = {
  amount: 0n,
  claimable: 0n,
  lastAccrued: 0n,
  totalStaked: 0n,
  cEthBalance: 0n,
  rewardToken: null,
};

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

function formatToken(value: bigint): string {
  if (value === 0n) {
    return '0.0000';
  }
  return numberFormatter.format(Number(formatEther(value)));
}

function formatTimestamp(value: bigint): string {
  if (value === 0n) {
    return 'Not available yet';
  }
  const asNumber = Number(value);
  return new Date(asNumber * 1000).toLocaleString();
}

export function HashYieldApp() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const signerPromise = useEthersSigner();

  const [snapshot, setSnapshot] = useState<StakeSnapshot>(INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [stakeInput, setStakeInput] = useState<string>('');
  const [withdrawInput, setWithdrawInput] = useState<string>('');
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const hasContract = true;
  const canInteract = Boolean(isConnected && address && hasContract);

  const refreshSnapshot = useCallback(async () => {
    if (!publicClient) {
      return;
    }

    if (!hasContract) {
      setSnapshot(INITIAL_STATE);
      setError('Deploy HashYield and update the front-end contract address.');
      return;
    }

    setLoading(true);
    try {
      const [totalStaked, rewardToken] = await Promise.all([
        publicClient.readContract({
          abi: HASH_YIELD_ABI,
          address: CONTRACT_ADDRESS,
          functionName: 'totalStaked',
        }),
        publicClient.readContract({
          abi: HASH_YIELD_ABI,
          address: CONTRACT_ADDRESS,
          functionName: 'getRewardToken',
        }),
      ]);

      let amount = 0n;
      let claimable = 0n;
      let lastAccrued = 0n;
      let cEthBalance = 0n;

      if (address) {
        const [stakeInfo, balance] = await Promise.all([
          publicClient.readContract({
            abi: HASH_YIELD_ABI,
            address: CONTRACT_ADDRESS,
            functionName: 'getStake',
            args: [address as `0x${string}`],
          }) as Promise<[bigint, bigint, bigint]>,
          publicClient.readContract({
            abi: CETH_ABI,
            address: rewardToken as `0x${string}`,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
          }),
        ]);

        amount = stakeInfo[0];
        claimable = stakeInfo[1];
        lastAccrued = stakeInfo[2];
        cEthBalance = balance as bigint;
      }

      setSnapshot({
        amount,
        claimable,
        lastAccrued,
        cEthBalance,
        totalStaked: totalStaked as bigint,
        rewardToken: rewardToken as `0x${string}`,
      });
      setError(null);
    } catch (err) {
      console.error('Failed to load contract data', err);
      setError('Unable to load staking data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [address, hasContract, publicClient]);

  useEffect(() => {
    if (!publicClient) {
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const init = async () => {
      await refreshSnapshot();
      if (!cancelled && hasContract) {
        unsubscribe = publicClient.watchBlockNumber({
          onBlockNumber: async () => {
            if (!cancelled) {
              await refreshSnapshot();
            }
          },
        });
      }
    };

    init();

    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [hasContract, publicClient, refreshSnapshot]);

  const stakeDisabled = !canInteract || isStaking || stakeInput.trim() === '';
  const withdrawDisabled =
    !canInteract || isWithdrawing || withdrawInput.trim() === '' || snapshot.amount === 0n;
  const claimDisabled = !canInteract || snapshot.claimable === 0n || isClaiming;

  const handleStake = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canInteract) {
        setError('Connect your wallet to stake.');
        return;
      }

      try {
        const value = ethers.parseEther(stakeInput);
        if (value <= 0n) {
          setError('Enter a positive amount to stake.');
          return;
        }
        const signer = await signerPromise;
        if (!signer) {
          setError('Wallet signer unavailable.');
          return;
        }

        setIsStaking(true);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, HASH_YIELD_ABI, signer);
        const tx = await contract.stake({ value });
        await tx.wait();
        setStakeInput('');
        setError(null);
        await refreshSnapshot();
      } catch (err: any) {
        if (err?.code === 'ACTION_REJECTED') {
          return;
        }
        console.error('Stake failed', err);
        setError(err?.message ?? 'Staking transaction failed.');
      } finally {
        setIsStaking(false);
      }
    },
    [canInteract, refreshSnapshot, signerPromise, stakeInput],
  );

  const handleWithdraw = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canInteract) {
        setError('Connect your wallet to withdraw.');
        return;
      }

      try {
        const value = ethers.parseEther(withdrawInput);
        if (value <= 0n) {
          setError('Enter a positive amount to withdraw.');
          return;
        }
        const signer = await signerPromise;
        if (!signer) {
          setError('Wallet signer unavailable.');
          return;
        }

        setIsWithdrawing(true);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, HASH_YIELD_ABI, signer);
        const tx = await contract.withdraw(value);
        await tx.wait();
        setWithdrawInput('');
        setError(null);
        await refreshSnapshot();
      } catch (err: any) {
        if (err?.code === 'ACTION_REJECTED') {
          return;
        }
        console.error('Withdraw failed', err);
        setError(err?.message ?? 'Withdrawal transaction failed.');
      } finally {
        setIsWithdrawing(false);
      }
    },
    [canInteract, refreshSnapshot, signerPromise, withdrawInput],
  );

  const handleClaim = useCallback(async () => {
    if (!canInteract) {
      setError('Connect your wallet to claim.');
      return;
    }

    try {
      const signer = await signerPromise;
      if (!signer) {
        setError('Wallet signer unavailable.');
        return;
      }

      setIsClaiming(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, HASH_YIELD_ABI, signer);
      const tx = await contract.claimInterest();
      await tx.wait();
      setError(null);
      await refreshSnapshot();
    } catch (err: any) {
      if (err?.code === 'ACTION_REJECTED') {
        return;
      }
      console.error('Claim failed', err);
      setError(err?.message ?? 'Claim transaction failed.');
    } finally {
      setIsClaiming(false);
    }
  }, [canInteract, refreshSnapshot, signerPromise]);

  const userSummary = useMemo(
    () => [
      { label: 'Your staked ETH', value: formatToken(snapshot.amount) },
      { label: 'Claimable cETH', value: formatToken(snapshot.claimable) },
      { label: 'Your cETH balance', value: formatToken(snapshot.cEthBalance) },
      { label: 'Last accrual', value: formatTimestamp(snapshot.lastAccrued) },
    ],
    [snapshot.amount, snapshot.cEthBalance, snapshot.claimable, snapshot.lastAccrued],
  );

  const networkSummary = useMemo(
    () => [
      { label: 'Total ETH staked', value: formatToken(snapshot.totalStaked) },
      {
        label: 'Reward token',
        value: snapshot.rewardToken ?? 'Loading...',
      },
    ],
    [snapshot.rewardToken, snapshot.totalStaked],
  );

  return (
    <div className="hashyield-app">
      <section className="hashyield-panel">
        <h2>Yield Summary</h2>
        <p className="panel-subtitle">
          Earn 1 cETH of interest for every 1 ETH staked per day. Claim interest with no lock periods.
        </p>

        {error && <div className="panel-error">{error}</div>}

        <div className="stats-grid">
          {userSummary.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </article>
          ))}
        </div>

        <div className="secondary-grid">
          {networkSummary.map((stat) => (
            <article className="stat-card secondary" key={stat.label}>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value alt">{stat.value}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="hashyield-panel">
        <h3>Stake ETH</h3>
        <form className="action-form" onSubmit={handleStake}>
          <label>
            Amount (ETH)
            <input
              type="number"
              min="0"
              step="any"
              value={stakeInput}
              onChange={(event) => setStakeInput(event.target.value)}
              placeholder="0.0"
              disabled={!canInteract || isStaking}
              required
            />
          </label>
          <button type="submit" disabled={stakeDisabled}>
            {isStaking ? 'Staking…' : 'Stake ETH'}
          </button>
        </form>
      </section>

      <section className="hashyield-panel">
        <h3>Withdraw ETH</h3>
        <form className="action-form" onSubmit={handleWithdraw}>
          <label>
            Amount (ETH)
            <input
              type="number"
              min="0"
              step="any"
              value={withdrawInput}
              onChange={(event) => setWithdrawInput(event.target.value)}
              placeholder="0.0"
              disabled={!canInteract || isWithdrawing || snapshot.amount === 0n}
              required
            />
          </label>
          <button type="submit" disabled={withdrawDisabled}>
            {isWithdrawing ? 'Withdrawing…' : 'Withdraw ETH'}
          </button>
        </form>
      </section>

      <section className="hashyield-panel">
        <div className="claim-header">
          <h3>Claim Interest</h3>
          <p>Claim your accrued cETH rewards instantly.</p>
        </div>
        <button className="claim-button" onClick={handleClaim} disabled={claimDisabled}>
          {isClaiming ? 'Claiming…' : `Claim ${formatToken(snapshot.claimable)} cETH`}
        </button>
      </section>

      {loading && <div className="loading-indicator">Updating balances…</div>}
    </div>
  );
}
