import React from 'react';
import { useState, useEffect } from 'react';
import caver from '../../../klaytn/caver'
import { Spin, Icon, notification, Table, Divider, Button } from 'antd';
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';
import { Link } from 'react-router-dom';
import {savePainting, getPreExhibition} from '../../../util/APIUtils'
import MyModal from './SavePainting'

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


const MyTokenList1 = (props) => {
  const {address} = props;
  const [tokenState, setTokenState] = useState('');
  const [mytokens, handleMytokens] = useState([]);
  const [isLoading, setLoading] = useState(false);
const [modal, setModal] = useState(false);
   
   
   const [ modalOpen, setModalOpen ] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }
   

   
   
  useEffect(()=>{
    async function fetchToken(){
      await displayMyTokensAndSale(address)
    }
    fetchToken();
  },[props]
  )

  const displayMyTokensAndSale = async (address) => {
   var { address } = props;
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




    let VALUE=[];
    if( props.isSale){
      const SALEVALUE =mytokens.filter((mytokens)=>
        mytokens.price > 0)
        VALUE = SALEVALUE
    }else{
      VALUE = mytokens
    }


    const MATCHVALUE = VALUE.filter((VALUE) =>
      VALUE.title.toLowerCase().includes(props.searchValue) || VALUE.artist.toLowerCase().includes(props.searchValue))
      console.log(mytokens)
      console.log(MATCHVALUE);
   
   
    const columns = [
        {
             title: '제목',
             dataIndex: 'title',
             key: 'title',
        },
        {
             title: '이미지',
             dataIndex: 'imgURI',
             key: 'imgURI',
         render : (imgURI) => (
         <img src={imgURI}
                style={{ objectFit: 'cover', width: '85%', height: 180, marginLeft: 0 }}></img>
         )
        },
        {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
               <Button  style={{ fontSize: '7px'}}>
                	<Link to={{ pathname: `savePainting/${record.tokenID}`,
					state : {title : record.title, imgURI : record.imgURI, owner : record.owner}}}>전시 등록
					</Link>
                </Button>
                ),
              }
         ];

      



    return (

      <div className="card-list">
           <Table dataSource={mytokens} columns={columns}  pagination={{ pageSize: 8 }}/>
      </div>
    )



}

export default MyTokenList1;