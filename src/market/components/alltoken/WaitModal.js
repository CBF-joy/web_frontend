import { Button } from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';
import { Spin, Icon, notification, Modal, InputNumber, DatePicker, Divider, Input } from 'antd';
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
import { saveBid, editBid, getAvgBid, getCountBid, getMaxBid } from '../../../util/APIUtils';

const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const { RangePicker } = DatePicker;

const WaitModal = (props) => {
    const { open, close, header, tokenID, artist, title, createdDate, toDate, fromDate, price, imgURI, descURI, auction, owner, address, seconds } = props;

    const [isLoading, setLoading] = useState(false);
    const [inputprice, setInputPrice] = useState(0);
    // const [seconds, setSeconds] = useState(Date.now());

    const [avgPrice, setAvgPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [bidCount, setBidCount] = useState(null);

    // useInterval(() => {
    // setSeconds(Date.now());
    // }, 1000);

    const startBid = async () => {
        if (fromDate && toDate == 0)
            return;

        try {
            setLoading(true)

            saveBid(auction['ano'], inputprice)
        } catch (error) {
            notification.error({
                message: '전시해',
                description: error.message || '다시 시도해주세요.'
            });
            console.log(error)
            setLoading(false);
        }
    };




    

    return (
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (

                <Modal
                    centered
                    visible={open}
                    onCancel={close}
					cancelText="취소"
                    okButtonProps={{ style: { display: 'none' } }}
                    bodyStyle={{ width: '100%' }}>
                    
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
                                    <div> 경매 시작일 : {fromDate}</div>
                                    <div> 경매 종료일 : {toDate}</div>
									</p>
                                    <div> 시작가 : {price} klay</div>
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

export default WaitModal;