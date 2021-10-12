import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Spin, Icon, notification, Modal, InputNumber, DatePicker, Divider, Input } from 'antd';
import moment from 'moment';
import './MyModal.css'
import caver from '../../../klaytn/caver'
import {
    DEPLOYED_ABI, DEPLOYED_ADDRESS,
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';
import { saveAuction } from '../../../util/APIUtils';

const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const { RangePicker } = DatePicker;

const MyModal = (props) => {
    const { open, close, header, tokenID, artist, title, createdDate, imgURI, descURI, auctionDate, owner, address } = props;

    const [isLoading, setLoading] = useState(false);
    const [inputprice, setInputPrice] = useState(0);
    const [fromDate, setFromDate] = useState(0);
    const [toDate, setToDate] = useState(0);

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    };

    const handleDateChange = (range) => {
        try {
            setFromDate(range[0].hours('00').minutes('00').seconds('00').format('YYYY-MM-DD HH:mm:ss'));
            setToDate(range[1].hours('00').minutes('00').seconds('00').format('YYYY-MM-DD HH:mm:ss'));
        } catch (e) {
            console.log(e);
        }
    }
	
    const approveEach = async (approvedAddress) => {
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
                    "input": wttContract.methods.approve(approvedAddress, tokenID).encodeABI(),
                    "submit": true,
                    "feePayer": "0xe03f2d915FCEfaACF08076e389f322846cc50B60"
                }),
            })
    }

    const startAuction = async () => {
		// var fromDate = '2000-09-20'
		// var toDate = '3000-09-30'
        if (fromDate && toDate == 0)
            return;
        // console.log(tokenID, caver.utils.toPeb(inputprice, 'KLAY'), fromDate, toDate)
        try {
            setLoading(true)
			
            await approveEach(DEPLOYED_ADDRESS_TOKENSALES)
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
                        "input": tsContract.methods.setForSaleEach(tokenID, caver.utils.toPeb(inputprice, 'KLAY'), fromDate, toDate).encodeABI(),
                        "submit": true,
                        "feePayer": "0xe03f2d915FCEfaACF08076e389f322846cc50B60"
                    }),
                })
                    .then((res) => res.json())
                    .then((json) => {
                        saveAuction(tokenID, address, inputprice, fromDate, toDate);

						notification.success({
							message: '전시해',
							description: "경매가 신청되었습니다.",
						  });
				
						notification.success({
							message: '전시해',
							description: json.transactionHash,
						  });
				
						setTimeout(() => window.location.reload(), 3000);
                    })

        } catch (error) {
			await approveEach("0x0000000000000000000000000000000000000000")
            
			notification.error({
                message: '전시해',
                description: '다시 시도해주세요.'
            });
            console.log(error.message)
            
			setLoading(false);
        }
    };

    //console.log(inputprice, fromDate, toDate)

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
						<Button key="submit" type="primary" 
							loading={isLoading}
							onClick={startAuction}
                            disabled={fromDate && toDate == 0}>
						  경매 신청
						</Button>,
						<Button key="back" onClick={close}>
						  취소
						</Button>
					  ]}
					>

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

                            <div className='modal_container_detail2'>
                                <p>
                                    <span className="dialogTXT" >시작가 :</span>
                                    <InputNumber
										precision={0}
                                        style={{ width: 100 }}
                                        min={0}
                                        defaultValue={0}
                                        step={1}
                                        onChange={(e) => setInputPrice(e)}
                                    /> klay
                                </p>
                                <div>
                                    <span className="dialogTXT">경매 기간 :</span>
                                    <RangePicker
                                        style={{ width: 250 }}
                                        onChange={handleDateChange}
                                        disabledDate={disabledDate} />
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </Modal>
            ) : null}
        </div>
    )

}

export default MyModal;