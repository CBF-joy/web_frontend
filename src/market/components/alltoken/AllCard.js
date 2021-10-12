import { CardActions, CardContent, CardHeader, Typography, Button, } from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import caver from '../../../klaytn/caver'
import Loading from '../Loading'
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants/index'
import '../NewCard.css';
import { Spin, Icon } from 'antd';
import { deleteAuction } from '../../../util/APIUtils'
import IngModal from './IngModal'
import WaitModal from './WaitModal'
import MyModal from './MyModal'
import { useInterval } from 'react-use';
import moment from 'moment';
import 'moment/locale/ko';

const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


const AllCard = (props) => {
  const { tokenID, artist, title, createdDate, imgURI, descURI, price, toDate, fromDate, owner, address, auction } = props;

  const [isLoading, setLoading] = useState(false);
  const [approve, setApprove] = useState(false);
  const [inputprice, setInputPrice] = useState(0);
  const [disable, setDisable] = useState(true);
  const [seconds, setSeconds] = useState(Date.now());
	
	const isPc = useMediaQuery({
	  query: "(min-width:1024px)"
	});
	const isTablet = useMediaQuery({
	  query: "(min-width:768px) and (max-width:1023px)"
	});
	const isMobile = useMediaQuery({
	  query: "(max-width:767px)"
	});

	    useInterval(() => {
        setSeconds(Date.now());
    }, 1000);
	
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  }
  const closeModal = () => {
    setModalOpen(false);
  }

  //buyToken kas-api로 바꿨는데 test필요함!
  const buyToken = async (tokenID, artist, title, createdDate, price) => {

	  
    var sender = props.address;

    if (toDate <= 0)
      return;

    try {
      setLoading(true);

      await fetch("http://wallet-api.klaytnapi.com/v2/tx/fd-user/contract/execute", {
        method: "post",
        headers: {
          "Authorization": "Basic S0FTS0JBRTY4RVg2Q1UxVFBHR0ZFRk5ROjZyUVhvdHFyRDREeVVucDJBLXlGeWRWNnBzVm1jUjhZOHU3N0xHZFM=",
          "x-chain-id": "1001",
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          "from": sender,
          "to": DEPLOYED_ADDRESS_TOKENSALES,
          "input": tsContract.methods.purchaseToken(tokenID).encodeABI(),
          "submit": true,
          "feePayer": "0xe03f2d915FCEfaACF08076e389f322846cc50B60"
        })
      })
        .then((res) => res.json())
        .then((json) => {
          alert(json.transactionHash);
        })
    } catch (error) {
      console.log(error)
    }
  }


  const getApproved = async (tokenID) => {
    return await wttContract.methods.getApproved(tokenID).call();
  }

  useEffect(() => {
    const { tokenID, price } = props;

    async function fetchInfo() {

      let approvedAddress = await getApproved(tokenID);
      if (approvedAddress != '0x0000000000000000000000000000000000000000') setApprove(true)
      else setApprove(false)

    }
    fetchInfo();

  }, [props])



  const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;

  const now = new Date();
  const from = new Date(fromDate);
  const to = new Date(toDate);

    //console.log(tokenID, title, approve,  from, to);

  var walletaddress = address.toUpperCase();

  if (approve == true) {
    //대기중 -> 판매취소
    if (now.getTime() < from.getTime()) {
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
            {(owner === walletaddress)
              ? <Button variant='outlined' size="small"
				onClick={openModal} color='primary'>대기중</Button>
              : <Button variant='outlined' color='secondary' size="small"
                onClick={openModal} disable={disable}>대기중</Button>}
			  {modalOpen?< WaitModal open={modalOpen} close={closeModal} seconds={seconds} {...props} header="Modal heading" />:null}
          </CardActions>
        </div>)
    }
    //진행중 
    else if (from.getTime() <= now.getTime() && now.getTime() <= to.getTime()) {
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
            {(owner === walletaddress)
              ? <Button variant='outlined' color='primary' size="small" onClick={openModal}>진행중</Button>
              : <Button variant='contained' color='secondary' size="small"
                onClick={openModal}
                disable={disable}>응찰 신청</Button>}
            {modalOpen && (owner === walletaddress)
			 ? < MyModal open={modalOpen} close={closeModal} seconds={seconds} {...props} header="Modal heading" />
		     : <IngModal open={modalOpen} close={closeModal} seconds={seconds} {...props} header="Modal heading" />}
          </CardActions>
        </div>)
    }
    //종료
    else if (to.getTime() < now.getTime()) {
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
              variant="outlined" color="primary" size="small">
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
          <CardActions style={{ justifyContent: 'flex-end' }}>
			<div className='blank'></div>
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
          {(owner === walletaddress)
            ? <Button variant='outlined' color='primary' size="small">내 토큰</Button>
            : <div className='blank'></div>}
        </CardActions>
      </div>)
  }
  else {
    return (<div>Loading...</div>)
  }


}

export default AllCard;