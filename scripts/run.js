
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

    var tx = await nft.createToken("https://nft-marketplace-monik.herokuapp.com/nft/61fa18271a91a078dad0ade7");
    await tx.wait();

    var uri = await nft.tokenURI(1);
    console.log("uri :", uri);
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