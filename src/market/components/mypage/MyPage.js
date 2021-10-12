import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useMediaQuery } from "react-responsive";
import ProfileBox from './ProfileBox';
import caver from '../../../klaytn/caver'
import { DEPLOYED_ABI, DEPLOYED_ADDRESS } from '../../../constants';
import './Profile.css'
import { notification, Table,Avatar } from 'antd';
import { fetchDonate, getDonateByExhibit } from '../../../util/APIUtils';
import { getAvatarColor } from '../../../util/Colors';
import {getUserProfile, chargeCash_user} from '../../../util/APIUtils';
import { deleteFavById} from '../../../util/APIAdmin';
import { getCurrentUser } from '../../../util/APIUtils';
import { FaCoins } from "react-icons/fa";
// import {getUserProfile, chargeCash, getCashRecord, CheckRentIng, chargeCash_user} from '../../util/APIUtils';
// import {fetchFav, deleteFavById} from '../../util/APIAdmin';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


const MyPage = (props) => {

	const [ loading, setLoading ] = useState(false);

	const [ username, setUserName ] = useState('');
	const [ currentUser, setCurrentUser ] = useState('');
	const [ klay, setKlay ] = useState('0');  
	const [ token, setToken ] = useState('0');
	const [ mydonation, setMyDonation ] = useState([]);
	const textInput = useRef(props.address);

	const isPc = useMediaQuery({
	  query: "(min-width:1024px)"
	});
	const isTablet = useMediaQuery({
	  query: "(min-width:768px) and (max-width:1023px)"
	});
	const isMobile = useMediaQuery({
	  query: "(max-width:767px)"
	});



const getKlay = async (address) =>{
    if (!address) return
    caver.klay.getBalance(address).then((klay) => {
		setKlay(caver.utils.fromWei(klay))
    })

}


const getBalanceOf = async (address) => {

    var balance = parseInt(await wttContract.methods.balanceOf(address).call());
	setToken(balance)
		

}

const getMyDonation = () => {
	fetchDonate()
		.then(res =>{
		console.log(res);
		setMyDonation(res);
	})
		.catch(error=>console.log(error))
}

const chargeKlay = async (inputKlay) => {
	
	let value = parseInt(caver.utils.toPeb(inputKlay,'KLAY'))
	  value = '0x'+value.toString(16)
	  console.log(value)
	
	try{
		const charger = caver.klay.accounts.wallet.add('0x733d64eff83ff8961b5dcb251cf054f1c4e33de172f8fa4c7996aab07ad7ed00');
		const user = props.address;
		
		await caver.klay.sendTransaction({
    type: 'VALUE_TRANSFER',
    from: charger.address,
    to: user,
    gas: '300000',
    value: caver.utils.toPeb(inputKlay, 'KLAY'),
}).then(function(receipt){
    console.log(receipt)
			window.location.reload();
			notification.success({
                message: '전시해',
                description: "충전되었습니다!",
        })
})

        } catch (error) {
            console.log(error)
        }
	
}

 const copy = () => {
    const el = textInput.current
    el.select()
    document.execCommand("copy")
  }
 
const loadCurrentUser = async () => {
    setLoading(true);
    await getCurrentUser()
      .then(response => {

        setCurrentUser(response);
        setUserName(response.username);
        setLoading(false);
		
				 getKlay(response.address);
		getBalanceOf(response.address);
		getMyDonation(response.address);

      }).catch(error => {
        setLoading(false);
      });
  }


useEffect(() => {

	async function fetchInfo(){
		await loadCurrentUser();	
	}
	fetchInfo();
}, [props])


	
	const columns = [//수정해야함!
            {
              title: '전시회',
              dataIndex: 'exhibit_title',
              key: 'exhibit_title',

            },
		 {
              title: '작품',
              dataIndex: 'painting_title',
              key: 'painting_title',

            },
				 {
              title: '후원금액',
              dataIndex: 'klay',
              key: 'klay',
					 render: klay =>(
					<div>{klay + 'KLAY'}</div>
				)

            },

           
            {
                title: '날짜',
                dataIndex: 'createdAt',
                key: 'createdAt',
            },

          ];
	
	//내 수익(금액의 일부)
	const columns1 = [//수정해야함!
            {
              title: '전시회',
              dataIndex: 'title',
              key: 'title',

            },
		 {
              title: '작품',
              dataIndex: 'title',
              key: 'title',

            },
				 {
              title: '금액',
              dataIndex: 'title',
              key: 'title',

            },

            {
                title: '날짜',
                dataIndex: 'toDate',
                key: 'toDate',
				render: toDate =>(
					<div>{toDate.substring(0,10)}</div>
				)
            },
            {
                title: '후원단체',
                dataIndex: 'sponsor',
                key: 'sponsor',
            },

          ];
	
	
    if (props.address != null) {
        return (
            <div className="main-container_profile">
                <div className="wrap_profile">
                    <div class="greenContainer_profile" />
                            <div class="ProfileContainer">
                                <div class="title">프로필 정보</div>
                                <div className="user-avatar">
                                    {isMobile ? <Avatar className="user-avatar-circle_mobile" style={{ backgroundColor: getAvatarColor(props.currentUser.name)}}>
                                            {props.currentUser.name[0].toUpperCase()}
                                        </Avatar> : <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(props.currentUser.name)}}>
                                            {props.currentUser.name[0].toUpperCase()}
                                        </Avatar>}    
                                </div>
                                <div class="right1"><br></br>Full Name</div>
                                <div class="right2">{props.currentUser.name}</div>
                                <div class="right1"><br></br>User Name</div>
                                <div class="right2">@{username}</div>


                            <div className="right1"><br></br>ADDRESS</div>
				
								<div className="right2"><input type="text" value={props.address} ref={textInput} readOnly></input>
      <button onClick={copy}>copy</button> </div>
                      
                            </div>
					<div class="greenContainer"></div>
                    <div class="shippingStatusContainer_profile">
                        <div class="title_profile">
                            보유 자산
                        </div>
                        <div class="status_profile">
                            <div class="item_profile">
                                <div>
                                    <div class="green number_profile">{Number(klay).toFixed(2) + ' KLAY'}</div>
                                    <div class="text_profile">Balance</div>
                                </div>
                            </div>
                            <div class="item_profile">
                                <div>
                                    <div class="green number_profile">{token + " 개"}</div>
                                    <div className="text_profile">보유 토큰 개수</div>
                                </div>
                            </div>
                        </div>
                    </div>
					<div class="greenContainer"></div>
					     <div class="shippingStatusContainer_profile">
                        <div class="title_profile">
                            토큰 충전
                        </div>
							 <div class="listContainer">
                    
								 <a href="#" class="item">
                                    <div class="icon">:</div>
                                    <div class="text"><FaCoins className="icon" size="20" color="red" />1 KLAY</div>
                                    <div class="right2"> <Button type="primary" className="cashButton" onClick={()=>chargeKlay(1)}>충전하기</Button></div>
                                </a>
								 <a href="#" class="item">
                                    <div class="icon">:</div>
                                    <div class="text"><FaCoins className="icon" size="20" color="red"/>3 KLAY</div>
                                    <div class="right2"> <Button type="primary" className="cashButton" onClick={()=>chargeKlay(3)}>충전하기</Button></div>
                                </a>
    
                           
                        </div>
                    </div>


 
				<div class="greenContainer"></div>
                    <div className="shippingStatusContainer_profile">
                            <div className="favTable_container_profile">
                                <div class="title_profile">
                                내 후원 내역
                                </div>
                                     


                                            <div className="tpt_profile"><Table dataSource={mydonation} columns={columns} pagination={{ pageSize: 10 }} /></div>
                                    </div>
                                </div> 



                </div>
            </div>
        )
    } else {
        return (<div>Loading...</div>)
    }
}



export default MyPage;
