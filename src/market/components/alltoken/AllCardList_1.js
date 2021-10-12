import React from 'react';
import { useState, useEffect } from 'react';
import AllCard from './AllCard';
import Loading from '../Loading'
import caver from '../../../klaytn/caver'
import { getAuctionByToken } from '../../../util/APIUtils'


import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


const AllCardList_1 = (props) => {
  const { address } = props;

  const [tokenState, setTokenState] = useState('');
  const [allTokens, handleAllTokens] = useState([]);
  const [isLoading, setLoading] = useState(false);
	

  useEffect(() => {

    async function fetchToken() {
      await displayAllTokens(address)

    }
    fetchToken();

  }, [props]
  )

  const displayAllTokens = async (address) => {
    try {
      setLoading(true);

      var totalSupply = parseInt(await getTotalSupply());
      var tokenList = new Array();

      if (totalSupply === 0) {
        setTokenState('현재 발행된 토큰이 없습니다.')
      } else {

        for (var i = 0; i < totalSupply; i++) {


          var tokenID = await getTokenByIndex(i);
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
      handleAllTokens(tokenList)
    } catch (e) {
      console.log(e);
    }

  }

  const getTotalSupply = async () => {
    return await wttContract.methods.totalSupply().call();
  }
  const getOwnerOf = async (tokenID) => {
    return await wttContract.methods.ownerOf(tokenID).call();
  }
  const getTokenByIndex = async (index) => {
    return await wttContract.methods.tokenByIndex(index).call();
  }
  const getTokenPrice = async (tokenID) => {
    return await tsContract.methods.tokenPrice(tokenID).call();
  }
  const getECO = async (tokenID) => {
    return await wttContract.methods.getECO(tokenID).call();
  }
  const getToDate = async (tokenID) => {
    return await tsContract.methods.toDate(tokenID).call();
  }
  const getFromDate = async (tokenID) => {
    return await tsContract.methods.fromDate(tokenID).call();
  }


  if (isLoading) return <Loading />

  console.log(props.isSale)
  let VALUE = [];
  if (props.isSale) {
    const SALEVALUE = allTokens.filter((allTokens) =>
      allTokens.auction != null)
    VALUE = SALEVALUE
  } else {
    VALUE = allTokens
  }


  const MATCHVALUE = VALUE.filter((VALUE) =>
    VALUE.title.toLowerCase().includes(props.searchValue) || VALUE.artist.toLowerCase().includes(props.searchValue))
  console.log(allTokens)
  console.log(MATCHVALUE);

  return (

    <div className="card-list">
      {tokenState}
      {MATCHVALUE.map((token, idx) => {

        return <AllCard
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

export default AllCardList_1;