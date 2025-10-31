import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'HashYield',
  projectId: '4d09589c2ee74fce9a1c75b8d650c85b',
  chains: [sepolia],
  ssr: false,
});
