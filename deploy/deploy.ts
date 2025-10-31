import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployment = await deploy("HashYield", {
    from: deployer,
    log: true,
  });

  const hashYield = await hre.ethers.getContractAt("HashYield", deployment.address);
  const rewardToken = await hashYield.getRewardToken();

  console.log(`HashYield contract: ${deployment.address}`);
  console.log(`cETH token: ${rewardToken}`);
};
export default func;
func.id = "deploy_hashYield"; // id required to prevent reexecution
func.tags = ["HashYield"];
