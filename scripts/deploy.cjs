const hre = require("hardhat");

async function main() {

	const [deployer] = await hre.ethers.getSigners();
	console.log(
	  "Deploying the contracts with the account:",
	  await deployer.getAddress()
	);

	const ServiceFactory = await hre.ethers.getContractFactory("ServiceFactory");
	const contract = await ServiceFactory.deploy();
	await contract.waitForDeployment();

	console.log("Contract address:", contract.target);

}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
