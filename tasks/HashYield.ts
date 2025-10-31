import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("hashyield:address", "Print the deployed HashYield contract address").setAction(async function (
  _taskArguments: TaskArguments,
  hre,
) {
  const deployment = await hre.deployments.get("HashYield");
  const hashYield = await hre.ethers.getContractAt("HashYield", deployment.address);

  console.log(`HashYield address: ${deployment.address}`);
  console.log(`cETH address    : ${await hashYield.getRewardToken()}`);
});

task("hashyield:stake", "Stake ETH in the HashYield contract")
  .addParam("value", "Amount of ETH to stake (in ether units)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const deployment = await hre.deployments.get("HashYield");
    const hashYield = await hre.ethers.getContractAt("HashYield", deployment.address);
    const [signer] = await hre.ethers.getSigners();

    const value = hre.ethers.parseEther(taskArguments.value as string);

    console.log(`Staking ${hre.ethers.formatEther(value)} ETH...`);
    const tx = await hashYield.connect(signer).stake({ value });
    const receipt = await tx.wait();
    console.log(`tx: ${receipt?.hash}`);
  });

task("hashyield:withdraw", "Withdraw staked ETH from the HashYield contract")
  .addParam("value", "Amount of ETH to withdraw (in ether units)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const deployment = await hre.deployments.get("HashYield");
    const hashYield = await hre.ethers.getContractAt("HashYield", deployment.address);
    const [signer] = await hre.ethers.getSigners();

    const value = hre.ethers.parseEther(taskArguments.value as string);

    console.log(`Withdrawing ${hre.ethers.formatEther(value)} ETH...`);
    const tx = await hashYield.connect(signer).withdraw(value);
    const receipt = await tx.wait();
    console.log(`tx: ${receipt?.hash}`);
  });

task("hashyield:claim", "Claim accrued cETH interest")
  .addOptionalParam("account", "Address to check interest for; defaults to signer")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const deployment = await hre.deployments.get("HashYield");
    const hashYield = await hre.ethers.getContractAt("HashYield", deployment.address);
    const [signer] = await hre.ethers.getSigners();
    const caller = taskArguments.account ? (taskArguments.account as string) : signer.address;

    console.log(`Claiming interest for ${caller}...`);
    const tx = await hashYield.connect(signer).claimInterest();
    const receipt = await tx.wait();
    console.log(`tx: ${receipt?.hash}`);
  });

task("hashyield:claimable", "Preview accrued interest for an address")
  .addParam("account", "Address to inspect")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const deployment = await hre.deployments.get("HashYield");
    const hashYield = await hre.ethers.getContractAt("HashYield", deployment.address);

    const claimable = await hashYield.claimableInterest(taskArguments.account as string);
    console.log(`${taskArguments.account} can claim ${hre.ethers.formatEther(claimable)} cETH`);
  });
