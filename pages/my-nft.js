import { useState } from 'react';
import React, { useEffect } from 'react';
import Web3 from 'web3';
import { useDispatch, useSelector } from 'react-redux';
import Market from '../artifacts/contracts/Market.sol/Market.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import { ContractAddress } from "../constant/contract_address";
import axios from 'axios';
import { Grid, Container, Card, Box, Typography } from '@mui/material';
import Link from 'next/link';

const MyNFT = () => {

    const user = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    let nftContract = null;
    let marketContract = null;
    const NFTContractAddress = ContractAddress.NFTContract
    const MarketContractAddress = ContractAddress.MarketContract
    const [nfts, setNfts] = useState([]);

    const connectWithContract = async () => {
        if (user.isUserConnected) {

            var web3 = new Web3(window.web3.currentProvider);
            let nftCon = new web3.eth.Contract(NFT.abi, NFTContractAddress);
            let marketCon = new web3.eth.Contract(Market.abi, MarketContractAddress);

            nftContract = nftCon;
            marketContract = marketCon;

            console.log('nftCon', nftContract);
            console.log('marketCon', marketContract);
            readNFTs();
        }
    }

    const readNFTs = async () => {
        // const res = await marketContract.methods.fetchMyNFTs().call()
        const res = await marketContract.methods.fetchMyNFTs().call({ from: user.userAccountAddress })
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
        console.log('items : ', items);
        setNfts(items);
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
                            <Link href={`/details/${nft.itemId}?image=${nft.image}&name=${nft.name}&status=${nft.status}&price=${nft.price}`}>
                                <Card>
                                    <Box px={4} py={2}>
                                        <Typography>{nft.name}</Typography>
                                        <img src={`${nft.image}?w=164&h=164&fit=crop&auto=format`}
                                            srcSet={`${nft.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            height={200} width={200} />
                                        <Typography>{nft.description}</Typography>
                                    </Box>
                                </Card>
                            </Link>
                        </Grid>
                    </>))}
                </Grid>
            </Container>
        </>
    );
}

export default MyNFT;