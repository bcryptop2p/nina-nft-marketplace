const main = async () => {
    const Market = await hre.ethers.getContractFactory("Market")
    const market = await Market.deploy();
    await market.deployed();
    const marketContractAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketContractAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    console.log("Market deployed to : " + marketContractAddress)
    console.log("NFT deployed to : " + nftContractAddress)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

runMain()