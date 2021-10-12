import { CardActions, CardContent, CardHeader, Button, Typography } from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Spin, Icon, notification, Modal } from 'antd';
import IngModal from './IngModal';
import { useInterval } from 'react-use';
import moment from 'moment';
import 'moment/locale/ko';


import caver from '../../../klaytn/caver'
import {
    DEPLOYED_ABI, DEPLOYED_ADDRESS,
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';
import '../NewCard.css'
import { deleteAuction } from '../../../util/APIUtils'

import StartModal from './StartModal'



const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const MyCard = (props) => {
    const { tokenID, artist, title, createdDate, imgURI, descURI, toDate, fromDate, owner, address, auction } = props;

    const [isLoading, setLoading] = useState(false);
    const [approve, setApprove] = useState(false);
    const [inputprice, setInputPrice] = useState(0);
    const [price, setPrice] = useState(props.price);
    const [seconds, setSeconds] = useState(Date.now());


    useInterval(() => {
        setSeconds(Date.now());
    }, 1000);
	
	const isPc = useMediaQuery({
	  query: "(min-width:1024px)"
	});
	const isTablet = useMediaQuery({
	  query: "(min-width:768px) and (max-width:1023px)"
	});
	const isMobile = useMediaQuery({
	  query: "(max-width:767px)"
	});


    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }

    const getApproved = async (tokenID) => {
        return await wttContract.methods.getApproved(tokenID).call();
    }
    const getTokenPrice = async (tokenID) => {
        return await tsContract.methods.tokenPrice(tokenID).call();
    }

    const cancelApprovalEach = async (props) => {
        try {

            await fetch("https://wallet-api.klaytnapi.com/v2/tx/fd-user/contract/execute", {

                method: "post",
                headers: {
                    "Authorization": "Basic S0FTS0JBRTY4RVg2Q1UxVFBHR0ZFRk5ROjZyUVhvdHFyRDREeVVucDJBLXlGeWRWNnBzVm1jUjhZOHU3N0xHZFM=",
                    "x-chain-id": "1001",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "from": address,
                    "to": DEPLOYED_ADDRESS,
                    "input": wttContract.methods.approve("0x0000000000000000000000000000000000000000", tokenID).encodeABI(),
                    "submit": true,
                    "feePayer": "0xe03f2d915FCEfaACF08076e389f322846cc50B60"
                }),
            })
            setApprove(false);
            setInputPrice(0);
            setLoading(false);
        } catch (error) {
            notification.error({
                message: '전시해',
                description: error.message || '다시 시도해주세요.'
            });
            setLoading(false);

        }
    };

    const removeTokenOnSaleEach = async () => {
        setLoading(true);
        setInputPrice(0);

        const { tokenID, address } = props;

        try {
            await fetch("https://wallet-api.klaytnapi.com/v2/tx/fd-user/contract/execute", {

                method: "post",
                headers: {
                    "Authorization": "Basic S0FTS0JBRTY4RVg2Q1UxVFBHR0ZFRk5ROjZyUVhvdHFyRDREeVVucDJBLXlGeWRWNnBzVm1jUjhZOHU3N0xHZFM=",
                    "x-chain-id": "1001",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "from": address,
                    "to": DEPLOYED_ADDRESS_TOKENSALES,
                    "input": tsContract.methods.removeTokenOnSaleEach(tokenID).encodeABI(),
                    "submit": true,
                    "feePayer": "0xe03f2d915FCEfaACF08076e389f322846cc50B60"
                }),
            })
                .then((res) => res.json())
                .then((json) => {
                    cancelApprovalEach();
                    deleteAuction(JSON.stringify(auction['ano']));
                    setLoading(false);
				
				    notification.success({
                        message: '전시해',
                        description: "대기 중인 경매가 취소되었습니다.",
                    });
				
                    notification.success({
                        message: '전시해',
                        description:  json.transactionHash,
                    });
                    // setTimeout(()=>window.location.reload(),2000);
				
                });

            var AfterPrice = await getTokenPrice(tokenID);
            setPrice(caver.utils.fromPeb(AfterPrice, 'KLAY'))

        } catch (e) {
            console.log(e)
        }


    }

    useEffect(() => {
        const { tokenID, price } = props;
        async function fetchInfo() {;
			
			try{
            if (price == null)
                setPrice(caver.utils.fromPeb(price, 'KLAY'))

            let approvedAddress = await getApproved(tokenID);
			console.log(approvedAddress)
            if (approvedAddress != '0x0000000000000000000000000000000000000000') setApprove(true)
            else setApprove(false)
			}catch(e){
				console.log(e)
			}

        }
        fetchInfo();

    }, [props])


    const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;


    const now = new Date();
    const to = new Date(toDate);
    const from = new Date(fromDate);
	
 
    //console.log(tokenID, title, approve);


    //경매O
    if (approve == true) {
        //대기중 -> 판매취소
        if (now < from) {
            return (
                <div className={isMobile ? "card-container_mobile" :"card-container"}>
                    <CardHeader>{tokenID}</CardHeader>
                    <img src={imgURI}
                        style={{ objectFit: 'cover', width: '85%', height: 180, marginLeft: 22.5 }} title={title}></img>
                    <CardContent>
                        <Typography variant="body1" component="span">
                            artist: {artist}
                            <br></br>
                            title: {title}
                            <br></br>
                            createdDate: {createdDate}
                            <br></br>
                        </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
							size="small"
                            disabled={isLoading}
                            onClick={removeTokenOnSaleEach}>
                            경매 취소
                        </Button>
                    </CardActions>

                </div>)
        }
        //진행중 
        else if (from <= now && now <= to) {
            return (
                <div className={isMobile ? "card-container_mobile" :"card-container"}>
                    <CardHeader>{tokenID}</CardHeader>
                    <img src={imgURI}
                        style={{ objectFit: 'cover', width: '85%', height: 180, marginLeft: 22.5 }} title={title}></img>
                    <CardContent>
                        <Typography variant="body1" component="span">
                            artist: {artist}
                            <br></br>
                            title: {title}
                            <br></br>
                            createdDate: {createdDate}
                            <br></br>
                        </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="primary"
							size="small"
                            disabled={isLoading}
                            onClick={openModal}>
                            진행중
                        </Button>
                        {modalOpen?< IngModal open={modalOpen} close={closeModal} {...props} header="Modal heading" />:null}
                    </CardActions>
                </div>)
        }
        //종료
        else if (to < now) {
            return (
                <div className={isMobile ? "card-container_mobile" :"card-container"}>
                    <CardHeader>{tokenID}</CardHeader>
                    <img src={imgURI}
                        style={{ objectFit: 'cover', width: '85%', height: 180, marginLeft: 22.5 }} title={title}></img>
                    <CardContent>
                        <Typography variant="body1" component="span">
                            artist: {artist}
                            <br></br>
                            title: {title}
                            <br></br>
                            createdDate: {createdDate}
                            <br></br>
                        </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="primary"
							size="small">
                            마감
                        </Button>
                    </CardActions>
                </div>)
        }
		else{
			return (
        <div className={isMobile ? "card-container_mobile" :"card-container"}>
          <CardHeader>{tokenID}</CardHeader>
          <img src={imgURI}
            style={{ objectFit: 'cover', width: '85%', height: 180, marginLeft: 22.5 }} title={title}></img>
          <CardContent>
            <Typography variant="body1" component="span">
              artist: {artist}
              <br></br>
              title: {title}
              <br></br>
              createdDate: {createdDate}
              <br></br>
            </Typography>
          </CardContent>
          <CardActions style={{ justifyContent: 'flex-end' }} >
		  	<Button
            variant="outlined"
            color="primary"
			size="small"
			onClick={cancelApprovalEach}>
                  마감
            </Button>
          </CardActions>
        </div>)
		}
    }
    ////경매X
    else if (approve == false) {
        return (
            <div className={isMobile ? "card-container_mobile" :"card-container"}>
                <CardHeader>{tokenID}</CardHeader>
                <img src={imgURI}
                    style={{ objectFit: 'cover', width: '85%', height: 180, marginLeft: 22.5 }} title={title}></img>
                <CardContent>
                    <Typography variant="body1" component="span">
                        artist: {artist}
                        <br></br>
                        title: {title}
                        <br></br>
                        createdDate: {createdDate}
                        <br></br>
                    </Typography>
                </CardContent>
                <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
						size="small"
                        disabled={isLoading}
                        onClick={openModal}>
                        경매 신청
                    </Button>
                    {modalOpen
					?< StartModal 
						 open={modalOpen} close={closeModal} {...props} header="Modal heading" />
					:null}
                </CardActions>
            </div>)
    }
    else {
        return (<div>Loading...</div>)
    }


}

export default MyCard;