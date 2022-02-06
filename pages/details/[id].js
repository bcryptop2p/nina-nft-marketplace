import { useRouter } from "next/router";
import { Button, Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Description } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { useSelector } from 'react-redux';
import Market from './../../artifacts/contracts/Market.sol/Market.json';
import NFT from './../../artifacts/contracts/NFT.sol/NFT.json';

import { ContractAddress } from "./../../constant/contract_address";
import Web3 from 'web3';


const NFTDetail = () => {

    const user = useSelector(state => state.userReducer);
    const router = useRouter();
    const { id, image, name, status, price } = router.query;
    const [isShowSellNFT, setIsShowSellNFT] = useState(false);
    const [nftPrice, setNftPrice] = useState(0);
    const [nftContract, setNftContract] = useState({})
    const [marketContract, setMarketContract] = useState({})

    const NFTContractAddress = ContractAddress.NFTContract
    const MarketContractAddress = ContractAddress.MarketContract

    const connectWithContract = async () => {
        if (user.isUserConnected) {
            var web3 = new Web3(window.web3.currentProvider);
            let nftCon = new web3.eth.Contract(NFT.abi, NFTContractAddress);
            let marketCon = new web3.eth.Contract(Market.abi, MarketContractAddress);

            setNftContract(nftCon)
            setMarketContract(marketCon)

            console.log('nftCon', nftContract);
            console.log('marketCon', marketContract);
        }
    }

    const sellNFT = () => {
        console.log("sellNFT.........");
        console.log("market contract : ", marketContract)
        // console.log("Web3.utils.toWei(nftPrice, 'ether') : ", Web3.utils.toWei(nftPrice, 'ether'))
        marketContract
            .methods
            .listItemForSale(Web3.utils.toWei(nftPrice, 'ether'), id)
            .send({ from: user.userAccountAddress })
            .then(x => {
                if (x) {
                    console.log('x : ', x);
                }
            });
    }

    useEffect(() => {
        connectWithContract();
    }, [])

    return (
        <>
            <Container>
                <Typography variant="body1">
                    {name}
                </Typography>
                <img src={image} height={200} width={200} />
                <Box>
                    {status === '0' ?
                        (
                            <>
                                <Button
                                    variant='contained'
                                    onClick={() => setIsShowSellNFT(!isShowSellNFT)}>
                                    {isShowSellNFT ? "Cancel Sell" : "List For Sale"}
                                </Button>
                            </>
                        ) :
                        "not for sale"}
                </Box>
                <Box mt={2}>
                    {isShowSellNFT ?
                        <TextField
                            label={"price in eth"}
                            value={nftPrice}
                            onChange={e => setNftPrice(e.target.value)} /> : ""}
                </Box>
                <Box mt={2}>
                    {isShowSellNFT ? <Button color="success" variant="contained" onClick={sellNFT} >Sell NFT</Button> : ""}
                </Box>
            </Container>
        </>
    );
};

export default NFTDetail;