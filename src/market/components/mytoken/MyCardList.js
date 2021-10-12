import React from 'react';
import { useState, useEffect } from 'react';
import MyCard from './MyCard';
import caver from '../../../klaytn/caver'
import { getAuctionByToken } from '../../../util/APIUtils'
import Loading from '../Loading'

import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


const MyCardList = (props) => {
  const { address } = props;
  const [tokenState, setTokenState] = useState('');
  const [mytokens, handleMytokens] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      await displayMyTokensAndSale(address)
    }
    fetchToken();
  }, [props]
  )

  const displayMyTokensAndSale = async (address) => {
    setLoading(true);
    
    var balance = parseInt(await getBalanceOf(address));
    var tokenList = new Array();

    if (balance === 0) {
      setTokenState('현재 발행된 토큰이 없습니다. ')
    } else {
      for (var i = 0; i < balance; i++) {

        var tokenID = await getTokenOfOwnerByIndex(address, i);
        var eco = await getECO(tokenID);
        var price = await getTokenPrice(tokenID);
        var toDate = await getToDate(tokenID);
        var fromDate = await getFromDate(tokenID);
        var owner = await getOwnerOf(tokenID);
        var auction = await getAuctionByToken(tokenID)

        var data = new Object();
        data.tokenID = tokenID;
        data.artist = eco[0];
        data.title = eco[1];
        data.createdDate = eco[2];
        data.imgURI = eco[3];
        data.descURI = eco[4];
        data.price = parseFloat(caver.utils.fromPeb(price, 'KLAY') + "KLAY");
        data.toDate = toDate;
        data.fromDate = fromDate;
        data.owner = owner.toUpperCase();
        data.address = address;
        data.auction = auction;
        tokenList.push(data);

      }
    }
    setLoading(false);
    handleMytokens(tokenList);
  }

  const getTokenByIndex = async (index) => {
    return await wttContract.methods.tokenByIndex(index).call();
  }
  const getTokenPrice = async (tokenID) => {
    return await tsContract.methods.tokenPrice(tokenID).call();
  }
  const getToDate = async (tokenID) => {
    return await tsContract.methods.toDate(tokenID).call();
  }
  const getFromDate = async (tokenID) => {
    return await tsContract.methods.fromDate(tokenID).call();
  }
  const getOwnerOf = async (tokenID) => {
    return await wttContract.methods.ownerOf(tokenID).call();
  }
  const getBalanceOf = async function (address) {
    return await wttContract.methods.balanceOf(address).call();
  }
  const getECO = async (tokenID) => {
    return await wttContract.methods.getECO(tokenID).call();
  }
  const getTokenOfOwnerByIndex = async (address, index) => {
    return await wttContract.methods.tokenOfOwnerByIndex(address, index).call();
  }

  if (isLoading) return <Loading />

  let VALUE = [];
  if (props.isSale) {
    const SALEVALUE = mytokens.filter((mytokens) =>
     mytokens.auction != null)
    VALUE = SALEVALUE
  } else {
    VALUE = mytokens
  }
	console.log(mytokens)

  const MATCHVALUE = VALUE.filter((VALUE) =>
    VALUE.title.toLowerCase().includes(props.searchValue) || VALUE.artist.toLowerCase().includes(props.searchValue))
  // console.log(mytokens)
  // console.log(MATCHVALUE);


  return (

    <div className="card-list">
      {MATCHVALUE.map((token, idx) => {
        return <MyCard
          key={idx}
          tokenID={token.tokenID}
          artist={token.artist}
          title={token.title}
          imgURI={token.imgURI}
          descURI={token.descURI}
          createdDate={token.createdDate}
          price={token.price}
          toDate={token.toDate}
          fromDate={token.fromDate}
          owner={token.owner}
          address={token.address}
          auction={token.auction}
        />
      })}
    </div>
  )



}

export default MyCardList;