import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { Spin, Icon, notification, Modal, InputNumber, DatePicker, Divider, Input, Form, Table } from 'antd';
import { useInterval } from 'react-use';
import moment from 'moment';
import 'moment/locale/ko';
import Loading from '../Loading'
import caver from '../../../klaytn/caver'
import {
    DEPLOYED_ABI, DEPLOYED_ADDRESS,
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';
import {getMyPainting, deletePainting} from '../../../util/APIUtils'

const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const { RangePicker } = DatePicker;

class EditMyPainting extends Component {
	constructor(props){
		super(props);
		this.state ={
			exhibitions2:[],
	    };
	}

	componentDidMount() {
        this.loadMyExhibition();
    }
	
	loadMyExhibition() {
        getMyPainting()
            .then((res) => {
                this.setState({exhibitions2: res}, function(){
                    console.log(this.state)
                })
            });}
	
	
	onDelete = (pno) =>{
			deletePainting(pno)
            .then(res => {
                this.setState({exhibitions:this.state.exhibitions.filter(exhibitions => exhibitions.pno !== pno)}, function(){
                    console.log(this.state)
                })
            })
		.catch(error=>            notification.error({
                message: 'JOY Toon',
                description: error.message || '다시 시도해주세요.'
            }))
    }
	

	
	render(){
		   const columns = [
            {
                 title: '제목',
                 dataIndex: 'title',
                 key: 'title',
				width: '20%'

            },
         {
                 title: '전시회 이름',
                 dataIndex: 'exhibition.title',
                 key: 'exhibition.title',
			 width: '30%'

            },
	          {
                 title: '설명',
                 dataIndex: 'description',
                 key: 'description',
				  width: '40%'

            },
	   		{
                title: 'Action',
                key: 'action',
                className: 'action',
				width: '10%',
                render: (text, record) => (

                    <Button onClick={()=>this.onDelete(record.pno)} style={{ fontSize: '7px', padding: '0px'}} >
                        삭제
                    </Button>

                ),
              }
      ]
		
		return(
			    <div>
               		<Table dataSource={this.state.exhibitions2} columns={columns}/>
        		</div>
		)
	}
}

export default EditMyPainting;