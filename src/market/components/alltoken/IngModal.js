import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Spin, Icon, notification, Modal, InputNumber, Divider, Input, Select } from 'antd';
import { useInterval } from 'react-use';
import moment from 'moment';
import 'moment/locale/ko';
import Loading from '../Loading'
import './MyModal.css'
import caver from '../../../klaytn/caver'
import {
    DEPLOYED_ABI, DEPLOYED_ADDRESS,
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';
import { saveBid, editBid, getMyBidByAuction, getAvgBid, getCountBid, getMaxBid } from '../../../util/APIUtils';

const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const IngModal = (props) => {
    const { open, close, header, tokenID, artist, title, createdDate, toDate, fromDate, price, imgURI, descURI, auction, owner, address, seconds } = props;

    const [isLoading, setLoading] = useState(false);
    const [inputprice, setInputPrice] = useState(null);
    // const [seconds, setSeconds] = useState(Date.now());

    const [avgPrice, setAvgPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [bidCount, setBidCount] = useState(null);
    const [defaultPrice, setDefaultPrice] = useState(null);
	const [isMax, setIsMax] = useState(false);

    // useInterval(() => {
    // setSeconds(Date.now());
    // }, 1000);
	
	
    const startBid = async () => {
		setInputPrice(Math.max(inputprice, maxPrice+0.1, price+0.1))
		console.log(inputprice)
		console.log(typeof(inputprice))
			if (fromDate && toDate == 0)
			return;

			try {
			setLoading(true)
			let myBid = await getMyBidByAuction(auction['ano']);
			console.log(myBid)
			if ( myBid == null ) {
				await saveBid(auction['ano'], inputprice)
					.then(
					notification.success({
						message: '전시해',
						description: '응찰이 성공적으로 등록되었습니다.'
					}),
					setLoading(false))}
			else if (myBid != null ) {
				await editBid(auction['ano'], inputprice)
					.then(
					notification.success({
						message: '전시해',
						description: '응찰이 성공적으로 등록되었습니다.'
					}),
					setLoading(false))
			}

			} catch (error) {
			
			if( !(inputprice > maxPrice && inputprice > price )) {
				notification.error({
			message: '전시해',
			description: '최고가 혹은 시작가 이상 입력해 주세요.'
			});
			} else {
				notification.error({
			message: '전시해',
			description: error.message || '다시 시도해주세요.'
			});
			}
			
			
			console.log(error)
			setLoading(false);
			}
    };



    useEffect(() => {
        async function fetchInfo() {
            try {
                let maxPrice = await getMaxBid(auction['ano']);
				let myBid = await getMyBidByAuction(auction['ano']);

                if(maxPrice == null) {
					setMaxPrice(0);
				}
				else {
					setMaxPrice(maxPrice['price']);
					if(myBid!=null){
						setIsMax(myBid['price'] == maxPrice['price']);
					}
				}
            } catch (e) {
                setMaxPrice(0);
            }
        }


        async function fetchInfo2() {
            try {
                let bidCount = await getCountBid(auction['ano']);

                setBidCount(bidCount);
            } catch (e) {
                setBidCount(0);
            }
        }

        async function fetchInfo3() {
            try {
                let avgPrice = await getAvgBid(auction['ano']);
                if(avgPrice == null) 
					setAvgPrice(0)
				else 
					setAvgPrice(avgPrice)
            } catch (e) {
                setAvgPrice(0);
            }
        }
		
		if(open){
			fetchInfo();
        	fetchInfo2();
        	fetchInfo3();	
		}
		
		setDefaultPrice(Math.max(maxPrice, price)+0.1)
		setInputPrice(Math.max(inputprice, maxPrice+0.1, price+0.1))
		console.log(inputprice, maxPrice, price)
		
    }, [props])



    const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;

	
    return (
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (

                <Modal
                    centered
                    visible={open}
					onCancel={close}
                    okButtonProps={{ style: { display: 'none' } }}
                    bodyStyle={{ width: '100%' }}
					 footer={[
						<Button key="submit" type="primary" loading={isLoading} onClick={startBid} disabled={isMax}>
						  {isMax?"완료":"응찰"}
						</Button>,
						<Button key="back" onClick={close}>
						  취소
						</Button>
					  ]}
					>
                    <Spin spinning={(maxPrice && avgPrice && bidCount && defaultPrice && inputprice )==null} indicator={antIcon}>
                        <div className='modal_container'>
                            <img classNmae='modal_img' src={imgURI} alt={title} />
                            <div className='second'>
                                <div className='modal_container_detail'>
                                    <text className="modalartist">{artist}</text>
                                    <div>
                                        <text className="modaltitle">{title}</text>
                                        <text className="modalCreatedDate"> {createdDate}</text>
                                    </div>
                                </div>
                                <Divider />

                                <div>
									<p>
                                    <div>경매 시작일 : {fromDate}</div>
                                    <div>경매 종료일 : {toDate}</div>
									</p>
                                    <div>시작가 : {price} klay</div>
                                    <div>평균가 : {avgPrice} klay  (참여 {bidCount}인)</div>
                                    <div>최고가 : {maxPrice} klay</div>
                                </div>

                                <Divider />
                                <div>
									{isMax
									?
									<div>	
										<span className="dialogTXT" >응찰가 :</span>
										<Input
											style={{ width: 100 }}
											value={maxPrice}
											readOnly
										/> klay
										 <div className="dialogMax">(현재 최고 응찰가)</div>
									</div>
									:
									<div>
										 <span className="dialogTXT" >응찰가 :</span>
										<InputNumber
											style={{ width: 100 }}
											min={defaultPrice}
											defaultValue={defaultPrice}
											step={0.1}
											precision={1}
											onChange={setInputPrice}
											disabled={isMax}
										/> klay
									</div>
									}
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </Spin>
                </Modal>
            ) : null}
        </div>
    )

}

export default IngModal;