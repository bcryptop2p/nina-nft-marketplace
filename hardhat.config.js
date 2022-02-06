require("@nomiclabs/hardhat-waffle");
require("dotenv").config();


module.exports = {
  solidity: "0.8.0",
  networks: {
    mumbai: {
      url: process.env.NETWORK_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    },
    rinkeby: {
      url: process.env.NETWORK_RINKEBY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  }
};