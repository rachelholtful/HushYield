import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const DAY_IN_SECONDS = 24 * 60 * 60;
const TOLERANCE = ethers.parseEther("0.0001");

function expectApproximately(actual: bigint, expected: bigint) {
  const difference = actual > expected ? actual - expected : expected - actual;
  expect(Number(difference)).to.be.lte(Number(TOLERANCE));
}

describe("HashYield", function () {
  async function deployFixture() {
    const [deployer, alice, bob] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("HashYield", deployer);
    const hashYield = await factory.deploy();
    const rewardTokenAddress = await hashYield.getRewardToken();
    const rewardToken = await ethers.getContractAt("HashYieldToken", rewardTokenAddress);

    return { hashYield, rewardToken, deployer, alice, bob };
  }

  it("records stake deposits and totals", async function () {
    const { hashYield, alice } = await deployFixture();
    const depositAmount = ethers.parseEther("2");

    await hashYield.connect(alice).stake({ value: depositAmount });

    const [amount, claimable, lastAccrued] = await hashYield.getStake(alice.address);

    expect(amount).to.equal(depositAmount);
    expect(claimable).to.equal(0n);
    expect(lastAccrued).to.not.equal(0n);
    expect(await hashYield.totalStaked()).to.equal(depositAmount);
  });

  it("accrues exactly one cETH per day per ETH", async function () {
    const { hashYield, rewardToken, alice } = await deployFixture();
    const depositAmount = ethers.parseEther("1");

    await hashYield.connect(alice).stake({ value: depositAmount });

    await time.increase(DAY_IN_SECONDS);

    const claimable = await hashYield.claimableInterest(alice.address);
    expectApproximately(claimable, ethers.parseEther("1"));

    await hashYield.connect(alice).claimInterest();

    const balance = await rewardToken.balanceOf(alice.address);
    expectApproximately(balance, ethers.parseEther("1"));
    expect(await hashYield.claimableInterest(alice.address)).to.equal(0n);
  });

  it("handles multiple stakes, claims, and withdrawals", async function () {
    const { hashYield, rewardToken, alice, bob } = await deployFixture();

    await hashYield.connect(alice).stake({ value: ethers.parseEther("3") });
    await hashYield.connect(bob).stake({ value: ethers.parseEther("1.5") });

    await time.increase(DAY_IN_SECONDS / 2);

    const aliceClaimableBefore = await hashYield.claimableInterest(alice.address);
    const bobClaimableBefore = await hashYield.claimableInterest(bob.address);

    expectApproximately(aliceClaimableBefore, ethers.parseEther("1.5"));
    expectApproximately(bobClaimableBefore, ethers.parseEther("0.75"));

    await hashYield.connect(alice).claimInterest();
    await hashYield.connect(bob).withdraw(ethers.parseEther("0.5"));

    expectApproximately(await rewardToken.balanceOf(alice.address), ethers.parseEther("1.5"));
    expect(await hashYield.totalStaked()).to.equal(ethers.parseEther("4"));

    await time.increase(DAY_IN_SECONDS);

    const aliceClaimableAfter = await hashYield.claimableInterest(alice.address);
    const bobClaimableAfter = await hashYield.claimableInterest(bob.address);

    expectApproximately(aliceClaimableAfter, ethers.parseEther("3"));
    expectApproximately(bobClaimableAfter, ethers.parseEther("1.75"));

    await hashYield.connect(bob).claimInterest();
    expectApproximately(await rewardToken.balanceOf(bob.address), ethers.parseEther("1.75"));
  });
});
