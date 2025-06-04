const { ethers} = require("hardhat");

async function main() {
    let [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork()
    console.log(`chainId : ${network.chainId}) `)
    console.log('Deploying contracts with the account :', deployer.address);

    const lockedAmount = ethers.utils.parseEther("0.001");
    const Token = await ethers.getContractFactory("SAIONDO");

    // depoly
    const token = await Token.deploy();
    console.log('Token address :', token.address);
    console.log('ethers.utils.formatEther(lockedAmount) :', ethers.utils.formatEther(lockedAmount));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
