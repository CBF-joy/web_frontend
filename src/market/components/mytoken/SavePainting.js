import React, { Component } from 'react';
import { Table, Button, Form, Input, Upload, Icon, notification, Select, DatePicker} from 'antd';
import { Link } from 'react-router-dom';
import {savePainting, getPreExhibition, getCurrentUser} from '../../../util/APIUtils'
const { TextArea } = Input;
const { Option } = Select;

class SavePainting extends Component {
			
	constructor(props){
		super(props);
		this.state ={
            eno : '',
			exhibitions1:[],
            description : '',
			ExhibitionList : [],
			title : (this.props.location.state.title != 'undefined') ? this.props.location.state.title : localStorage.getItem('title'),
            imgURI :  (this.props.location.state.imgURI != 'undefined') ? this.props.location.state.imgURI : localStorage.getItem('imgURI'),
            owner :  (this.props.location.state.owner != 'undefined') ? this.props.location.state.owner : localStorage.getItem('owner'),
			currentUser: '',
	    };
		this.loadCurrentUser = this.loadCurrentUser.bind(this);
	}

	
	loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          role: response.authorities[0].authority,
          currentUser: response,
          isLoggedIn: true,
          isLoading: false,
          username: response.username,
          address: response.address,
        }, function () {
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }
	
	componentDidMount() {
		console.log(this.props)
		this.loadCurrentUser();
        this.loadPreExhibition();
    }
	
	loadPreExhibition() {
        getPreExhibition()
            .then((res) => {
                this.setState({exhibitions1: res}, function(){
                    console.log(this.state)
                })
            });}
	

	setDescription = (e) => {
    this.setState({
		description: e.target.value
    })
	localStorage.setItem('description',e)
  }
	
	setExId = (e) => {
    this.setState({
		eno: e
    })
	localStorage.setItem('eno',e)
  }
	
	

	uploadPainting = () => {
		try{
			savePainting(parseInt(this.state.eno), this.state.title, this.state.description, this.state.imgURI,this.state.username).then(res=>console.log(res))
			notification.success(false ? {
            message: '전시해',
            description: "이미 동일한 토큰이 해당 전시회에 등록되었습니다.",
          } : {
            message: '전시해',
            description: "정상적으로 저장되었습니다.",
          });
		}
		catch(error) {
		console.log(error)
            notification.error({
                message: '전시해',
                description: error.message || '다시 시도해주세요.'
            });
        }
	}
	

    render() {	


			return (
           		<div>
  					<Form onSubmit={this.uploadPainting}>
						
						<Form.Item label="전시 선택">
                  		<Select name="eno" size="large" onChange={this.setExId}>          
                        {this.state.exhibitions1.map(function(exhibitions1) {
						return (<Option key = {exhibitions1.eno} value = {exhibitions1.eno}> {exhibitions1.title} </Option>)
						})}
                    	</Select>
						</Form.Item>	
						
						<Form.Item label="설명">
                        	<Input type="text" name="description" size="large" placeholder="Description" value={this.state.description} onChange={this.setDescription}></Input>
						</Form.Item>
                        <Form.Item>
                            <Button type="primary" className="editToonButton" size="large" onClick={this.uploadPainting}>Save</Button>
                        </Form.Item>
				
					</Form>	
            </div>
        );

    }
}

export default SavePainting;