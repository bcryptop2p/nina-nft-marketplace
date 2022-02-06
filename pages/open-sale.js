import { useDispatch, useSelector } from 'react-redux';
import Market from '../artifacts/contracts/Market.sol/Market.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import { ContractAddress } from "../constant/contract_address";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { Grid, Container, Card, Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';


const OpenSale = () => {

    const [nftContract, setNftContract] = useState({})
    const [marketContract, setMarketContract] = useState({})

    const user = useSelector(state => state.userReducer);
    const NFTContractAddress = ContractAddress.NFTContract
    const MarketContractAddress = ContractAddress.MarketContract
    const [nfts, setNfts] = useState([]);

    const connectWithContract = async () => {
        if (user.isUserConnected) {
            var web3 = new Web3(window.web3.currentProvider);
            let nftCon = new web3.eth.Contract(NFT.abi, NFTContractAddress);
            let marketCon = new web3.eth.Contract(Market.abi, MarketContractAddress);

            setNftContract(nftCon)
            setMarketContract(marketCon)

            readNFTs();
        }
    }
    const readNFTs = async () => {
        const res = await marketContract.methods.getAllNFTs().call()
        console.log('res', res);
        const items = await Promise.all(res.map(async i => {
            const uri = await nftContract.methods.tokenURI(i.tokenId).call()
            const meta = await axios.get(uri);
            const item = {
                status: i.status,
                price: i.price,
                itemId: i.itemId,
                name: meta.data.name,
                image: meta.data.image,
                tokenId: i.tokenId,
                description: meta.data.description,
            };
            return item;
        }));
        const filteredItems = items.filter(i => i.status === '1')
        console.log('items : ', filteredItems);
        setNfts(filteredItems);
    }

    const buyItem = (itemId, price) => {
        var transactionData = {
            from: user.userAccountAddress,
            value: price
        };

        marketContract
            .methods
            .saleItem(itemId)
            .send(transactionData)
            .then(x => {
                console.log('x', x);
            });
    }

    useEffect(() => {
        connectWithContract();
    }, [])

    return (
        <>
            <Container>
                <Grid container spacing={2}>
                    {nfts && nfts.map(nft => (<>
                        <Grid item xs={6} md={3}>
                            <Card>
                                <Box px={4} py={2}>
                                    <Typography>{nft.name}</Typography>
                                    <img src={`${nft.image}?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`${nft.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        height={200} width={200} />
                                    <Typography>{nft.description}</Typography>
                                    <Box>
                                        <Typography>ETH : {Web3.utils.fromWei(nft.price, 'ether')}</Typography>
                                    </Box>
                                    <Box mt={1}>
                                        <Button variant='contained' color='success' onClick={() => buyItem(nft.itemId, nft.price)}>BUY</Button>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </>))}
                </Grid>
            </Container>
        </>
    );
}

export default OpenSale;