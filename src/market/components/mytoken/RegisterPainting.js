import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Spin, Icon, notification, Modal, InputNumber, DatePicker, Divider, Input, Select, Form} from 'antd';
import moment from 'moment';
import caver from '../../../klaytn/caver'
import {
    DEPLOYED_ABI, DEPLOYED_ADDRESS,
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';
import {savePainting, getPreExhibition} from '../../../util/APIUtils'

const { Option } = Select;
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


class RegisterPainting extends Component {
	constructor(props){
		super(props);
		this.state ={
            eno : 0,
			exhibitions1:[],
            description : '',
	    };
	}

	componentDidMount() {
        this.loadPreExhibition();
    }
	
	loadPreExhibition() {
        getPreExhibition()
            .then((res) => {
                this.setState({exhibitions1: res}, function(){
                    console.log(this.state)
                })
            });
    }
	
	

    setDescription = (e) => {
        this.setState({ description : e.target.value })
    }
	
    setExId = (e) => {
        this.setState({ eno : e })
    }
	

	
	savePainting(this.state.eno, this.state.title, this.state.description, this.state.imgURI, this.state.owner){
		if(this.state.description!='' && this.state.eno!=''){	
			try{
				savePainting(this.state.eno, this.state.title, this.state.description, this.state.imgURI, this.state.owner)
				notification.success({
                message: '전시해',
				description: "정상적으로 저장되었습니다.",
            });
			}
			catch(error) {
            notification.error({
                message: '전시해',
                description: error.message || '다시 시도해주세요.'
            });
        	}
		}
	} 
	

    render() {
		const { open, close, header, tokenID, artist, title, createdDate, imgURI, descURI, owner, address } = this.props;
		
		const columns = [
            {
              	title: '제목',
              	dataIndex: 'title',
              	key: 'title',

            },
			{
              	title: '전시회 번호',
              	dataIndex: 'eno',
              	key: 'eno',

            },
			{
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                  <span>
                    <Button onClick={()=>this.setExId(this.eno)}>전시회 선택</Button>
                  </span>
                ),
              }
		]
		
		return(
			
			
			<div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <Modal
                    centered
                    visible={open}
                    onCancel={close}
                    okButtonProps={{ style: { display: 'none' } }}
                    bodyStyle={{ width: '100%' }}>

					<Form onSubmit={this.savePainting(this.state.eno, this.state.title, this.state.description, this.state.imgURI, this.state.owner)}>

						<Table dataSource={this.state.exhibitions1} columns={columns}/>
												
						<Form.Item label="설명">
                        	<Input type="text" name="description" size="large" placeholder="Description" value={this.state.description} onChange={this.setDescription}></Input>
                        </Form.Item>
                    	<Button type="primary" className="newAddButton" size="large"
                        disabled={(this.state.description && this.state.ex_id) == ''}
                        onClick={this.onSubmit}>Save</Button>
					
		
					</Form>	
                </Modal>
            ) : null}
        	</div>
		
		
		)
    }
}

export default RegisterPainting;