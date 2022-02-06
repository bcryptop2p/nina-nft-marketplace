import { Button, Container, Typography, Box } from "@mui/material";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useState } from "react";
import NFTFileUploader from "../component/nft_file_uploader";
import Market from '../artifacts/contracts/Market.sol/Market.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import { ContractAddress } from "../constant/contract_address";
import { useSelector } from "react-redux";
import Web3 from "web3";
import axios from "axios";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = () => {

    const user = useSelector(state => state.userReducer);

    const NFTContractAddress = ContractAddress.NFTContract
    const MarketContractAddress = ContractAddress.MarketContract

    const [imgHeight, setImgHeight] = useState('200px');
    const [imgWidth, setImgWidth] = useState('300px');
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoaidng] = useState(false);
    const [nftContract, setNftContract] = useState(null);
    const [marketContract, setMarketContract] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [isBtnEnabled, setIsBtnEnabled] = useState(true);

    const styles = {
        uploadImage: {
            height: imgHeight,
            width: imgWidth
        },
        redText: {
            color: 'red',
        },
        greyText: {
            color: 'grey'
        }
    };

    const onFileChange = async (fileChoosen) => {
        if (fileChoosen) {
            fileSize(fileChoosen);
            console.log(fileChoosen);
            try {
                setLoaidng(true);
                const added = await client.add(fileChoosen, {
                    progress: (prog) => console.log(`File Progrss : ${prog}`)
                })
                const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                console.log(`set file url : ${url}`);
                setFileUrl(url);
                setLoaidng(false);
                setIsBtnEnabled(false);
            } catch (err) {
                console.log("Err from onFileChange", err);
            }
        }
    }

    const fileSize = (file) => {
        var reader = new FileReader();

        //Read the contents of Image File.
        reader.readAsDataURL(file);
        reader.onload = function (e) {

            //Initiate the JavaScript Image object.
            var image = new Image();

            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;

            //Validate the File Height and Width.
            image.onload = function () {
                var height = this.height / 10;
                var width = this.width / 10;

                console.log(`height : ${height}`);
                console.log(`width : ${width}`);

                if (height < 150) {
                    height = height + 100;
                }

                if (width < 200) {
                    width = width + 100;
                }

                setImgHeight(`${height}px`);
                setImgWidth(`${width}px`);
                return true;
            };
        };
    }

    const connectWithContract = () => {
        if (user.isUserConnected) {
            var web3 = new Web3(window.web3.currentProvider);
            let nftCon = new web3.eth.Contract(NFT.abi, NFTContractAddress);
            let marketCon = new web3.eth.Contract(Market.abi, MarketContractAddress);
            setNftContract(nftCon);
            setMarketContract(marketCon);
            console.log('nftCon', nftCon);
            console.log('marketCon', marketCon);
        }
    }

    const mintNFT = () => {
        const url = 'https://nft-marketplace-monik.herokuapp.com/nft'
        const data = {
            name: 'testing',
            image: fileUrl,
            description: 'lets get started'
        };

        setIsBtnEnabled(true);
        setIsMinting(true);

        axios.post(url, data)
            .then(res => {
                console.log(res.data._id)
                console.log("from : ", user.userAccountAddress)
                if (res.data._id) {
                    const nftUrl = url + "/" + res.data._id
                    console.log('nfturl :', nftUrl)
                    nftContract.methods
                        .createToken(nftUrl)
                        .send({ from: user.userAccountAddress })
                }
            }).catch(err => console.log(err))

        nftContract.events.TokenCreated()
            .on('data', (event) => {
                let data = event.returnValues;
                listItemOnMarket(data['itemId'])
            })
            .on('error', console.error)
    }

    const listItemOnMarket = async (itemId) => {
        marketContract
            .methods
            .listMarketItem(NFTContractAddress, itemId)
            .send({ from: user.userAccountAddress })

        marketContract
            .events
            .MarketItemCreated()
            .on('data', (event) => {
                console.log('market item created', event.returnValues)
            })
            .on('error', console.error)
    }

    useState(() => {
        connectWithContract();
    }, []);

    return (
        <Container>
            <Container sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "50px",
                marginBottom: "10px",
            }}>
                <Typography variant="h4" mb={2}>Create New NFT</Typography>
                <Box mb={2}>
                    <Typography variant="caption" color='red'>*</Typography><Typography variant="caption">Required Field</Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" >JPG , PNG and GIF are only allowed</Typography>
                </Box>
                {fileUrl && <img src={fileUrl} style={styles.uploadImage} />}
                {!fileUrl && <NFTFileUploader onFileChange={onFileChange} loading={loading} />}
                <Box sx={{ marginTop: "20px" }} />
                <Box mb={2}>
                    <Typography variant="caption" color='red'>*</Typography><Typography variant="caption">It is free to mint new NFT but you need to pay for Gas fees</Typography>
                </Box>
                <Button variant="contained" disabled={isBtnEnabled} onClick={mintNFT}>
                    {
                        isMinting ?
                            (<span>MINTING...</span>) :
                            (<span>MINT</span>)
                    }
                </Button>
                <Box sx={{ marginTop: "20px" }} />
            </Container>
        </Container >
    );
}

export default Create;