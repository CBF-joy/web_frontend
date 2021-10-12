import { CardActions, CardContent, CardHeader, Typography, Button, } from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';
import caver from '../../../klaytn/caver'
import Loading from '../Loading'
import { useMediaQuery } from 'react-responsive';
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants/index'
import './AllCardMain.css';
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


const AllCardMain = (props) => {
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


  const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;

  const now = new Date();
  const from = new Date(fromDate);
  const to = new Date(toDate);

  console.log(tokenID, title, from, to)

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
              <br></br><br></br>
            </Typography>
          </CardContent>
        </div>)
}

export default AllCardMain;