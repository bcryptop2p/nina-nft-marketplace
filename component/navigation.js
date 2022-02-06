import { Button, AppBar, Toolbar, Typography, Box, CssBaseline, Container } from '@mui/material';
import React, { useEffect } from 'react';
import Link from 'next/link'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddUserAccount, RemoveUserAccount } from '../redux/actions/user_account_action';
import Web3 from 'web3';


const Navigation = () => {

    const user = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        checkForWallet();
        checkIfUserConnected();
    }, []);

    const checkIfWalletAvailble = () => {
        if (window.ethereum) {
            return true;
        }
        return false;
    }

    const checkForWallet = () => {
        if (!checkIfWalletAvailble()) {
            alert("Please consider installing any crypto wallet");
        }
    }

    const connectWithWallet = async () => {
        if (checkIfWalletAvailble()) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
            checkIfUserConnected();
        } else {
            alert("Please consider installing any crypto wallet");
        }
    }

    const checkIfUserConnected = async () => {
        let web3;
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        }

        var accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            dispatch(AddUserAccount(accounts[0]));
        }
    }

    const styles = {
        appBar: {
            background: 'white',
        },
        textLink: {
            color: 'black',
            cursor: 'pointer'
        },
        appBarTitle: {
            color: 'black',
            flexGrow: '1',
            fontSize: '24px'
        },
        connectBtn: {
            marginLeft: '10px',
        }
    };

    return (
        <>
            <AppBar id='header' position='fixed' sx={styles.appBar} >
                <Container>
                    <Toolbar>
                        <Typography variant='h6' sx={styles.appBarTitle} mr={2} >NFT Marketplace</Typography>
                        <Link href='/'><Typography variant='body1' mr={2} style={styles.textLink}>Home</Typography></Link>
                        <Link href='/create'><Typography variant='body1' mr={2} style={styles.textLink}>Create</Typography></Link>
                        <Link href='/open-sale'><Typography variant='body1' mr={2} style={styles.textLink}>Open For Sale</Typography></Link>
                        <Link href='/my-nft'><Typography variant='body1' style={styles.textLink}>My NFT</Typography></Link>
                        {!user.isUserConnected ? <Button variant='contained' onClick={connectWithWallet} sx={styles.connectBtn}>Connect wallet</Button> : <Button variant='outlined' sx={styles.connectBtn} onClick={() => console.log('already connected')}>Connected </Button>}
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar />
        </>
    );
}

export default Navigation;