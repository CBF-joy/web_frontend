import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Upload, Icon, notification, Select, DatePicker, Divider, Spin } from 'antd';
import { Link } from 'react-router-dom';
import './EndBid.css';
import Login from '../market/components/loginform/Login';
import { getIngAuction, saveSuccessfulBid, deleteAuction, setAuctionStatusIng, setAuctionStatusEnd, getAuctionByToken } from '../util/APIUtils';
import { useInterval } from 'react-use';
import moment from 'moment';
import 'moment/locale/ko';
import caver from '../klaytn/caver'
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../constants';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


const EndBid = (props) => {
  const { address, role } = props;
  const [isLoading, setLoading] = useState(false);
  const [ingList, setIng] = useState("");
  const [mytokens, handleMytokens] = useState([]);


  const endBid = async (auction_id, tokenID) => {
    setLoading(true)
    try {

      let res = await getAuctionByToken(tokenID)
	  
	  //응찰 0회로 종료
      if (res['bids'].length == 0) {
        setAuctionStatusEnd(auction_id)
          .then(
            removeTokenOnSaleEach(tokenID, res['owner_address'])
          )
		  .then(
            notification.success({
              message: '전시해',
              description: '낙찰되었습니다. 경매가 종료됩니다.'
            }),

            setTimeout(()=>window.location.reload(),2000)
          )

      }
	  //낙찰시킨 후 종료
      else {
        let bid = await saveSuccessfulBid(auction_id)

        await fetch("https://wallet-api.klaytnapi.com/v2/tx/fd-user/contract/execute", {

          method: "post",
          headers: {
            "Authorization": "Basic S0FTS0JBRTY4RVg2Q1UxVFBHR0ZFRk5ROjZyUVhvdHFyRDREeVVucDJBLXlGeWRWNnBzVm1jUjhZOHU3N0xHZFM=",
            "x-chain-id": "1001",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "from": bid['successful_bid_useraddress'],
            "to": DEPLOYED_ADDRESS_TOKENSALES,
            "input": tsContract.methods.purchaseToken(tokenID).encodeABI(),
            "submit": true,
            "feePayer": "0xe03f2d915FCEfaACF08076e389f322846cc50B60",
            "value": '0x' + Number(caver.utils.toPeb(bid['successful_bid_price'], 'KLAY')).toString(16),
          }),
        })
          .then(res => res.json())
          .then(json =>{
			notification.success({
              message: '전시해',
              description: json.transactionHash,
            });
				
            notification.success({
              message: '전시해',
              description: '낙찰되었습니다. 경매가 종료됩니다.'
            });
			setLoading(false);
            setTimeout(()=>window.location.reload(),2000);
		}
          )
      }

    } catch (e) {

      console.log(e)
    }

  }

  const cancelApprovalEach = async (tokenID, address) => {
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
        // .then(res => res.json())
        // .then(json => {
        //   notification.success({
        //     message: '전시해',
        //     description: '경매가 종료됩니다.'
        //   });
        //   notification.success({
        //     message: '전시해',
        //     description: json.transactionHash
        //   });
        //   setLoading(false);
        //   setTimeout(() => window.location.reload(), 1200)
        // })
    } catch (error) {
      notification.error({
        message: '전시해',
        description: error.message || '다시 시도해주세요.'
      });

    }
  };

  const removeTokenOnSaleEach = async (tokenID, address) => {

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
          cancelApprovalEach(tokenID, address);
        });

    } catch (e) {
      console.log(e)
    }

  }

  const displayMyTokensAndSale = async (address) => {
    var now = Date.now();

    let ing = await getIngAuction();
    var tokenList = new Array();

    for (var item of ing) {
      var eco = await getECO(item['token_id']);
      var data = new Object();
      data.auction_id = item['ano'];
      data.token_id = item['token_id'];
      data.artist = eco[0];
      data.title = eco[1];
      data.image = eco[3];
      data.fromDate = item['fromDate'].substring(0, 19);
      data.toDate = item['toDate'].substring(0, 19);

      if (new Date(data.toDate) < now)
        tokenList.push(data);
    }

    handleMytokens(tokenList);
  }

  const getECO = async (tokenID) => {
    return await wttContract.methods.getECO(tokenID).call();
  }


  const columns = [
    {
      title: '작가',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '이미지',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img src={image}
          style={{ objectFit: 'cover', width: '50%', height: 100, marginLeft: 0 }}></img>
      )
    },
    {
      title: '시작일',
      dataIndex: 'fromDate',
      key: 'fromDate',
    },
    {
      title: '종료일',
      dataIndex: 'toDate',
      key: 'toDate',
    },
    {
      title: 'Action',
      key: 'action',
      className: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={() => endBid(record.auction_id, record.token_id)}>
            낙찰 및 종료
          </Button>
        </span>
      ),
    }
  ];


  useEffect(() => {

    async function fetchToken() {
      setLoading(true)
      await displayMyTokensAndSale(address);
      setLoading(false);
    }
    fetchToken();

  }, [props]
  )

  const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;


  if (role == "ROLE_ADMIN") {
    return (
      <div className="mytoken-container">
        <div className="wrap">
          <div className="main-container">
            <div className="greenContainer"></div>
            <div className="TokenContainer">
              <div className="title">종료된 경매</div>
              <div className="editList-container">
              </div>
            </div>
          </div>
        </div>
        <Spin spinning={isLoading} indicator={antIcon}>
          <Table dataSource={mytokens} columns={columns} pagination={{ pageSize: 8 }} />
        </Spin>
      </div>
    );
  }
  else {
    return (<Login />);

  }

}

export default EndBid;