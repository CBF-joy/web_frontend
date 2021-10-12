import React, { useState } from 'react';
import { Button,Form, Input, Upload, Icon, notification, Select, DatePicker} from 'antd';
import { Link } from 'react-router-dom';
import './AdminMenu.css';
import Login from '../market/components/loginform/Login';
import {uploadFile} from '../util/APIAdmin';
const { Dragger } = Upload;


const NewAdd = (props) => {

	
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [sponsor, setSponsor] = useState('');
	const [fileLists, setFileLists] = useState(null);

	
	
	const startDate = (date, dateString) => {
		console.log(date, dateString)
		setFromDate(dateString)
		
	}
	const endDate = (date, dateString) => {
		console.log(date, dateString)
		setToDate(dateString)
		
	}

	const onChange=({ fileList })=> {
		setFileLists(fileList)
        console.log(fileList[0].originFileObj)
 	}

 	const uploadNewExhibit = () => {
    	try {
        	uploadFile(title, description, sponsor, fromDate, toDate, fileLists[0].originFileObj)
			.then(res => console.log(res))
        	props.history.push('/adminmenu')
        	notification.success({
            	message: '전시해',
            	description: "정상적으로 저장되었습니다.",
          	});

		} catch(error) {
            notification.error({
                message: '전시해',
                description: error.message || '다시 시도해주세요.'
            });
        }
    }

	
	if(props.role == "ROLE_ADMIN"){
		return (
            <div className="newAdd-container">
                <Form onSubmit={uploadNewExhibit}>
                    <Form.Item label="전시회 제목">
                            <Input type="text" 
								name="title" 
								size="large" 
								placeholder="Title" 
								value={title} 
								onChange={(e)=>setTitle(e.target.value)}>
							</Input>
                    </Form.Item>
                    <Form.Item label="설명">
                            <Input type="text" 
								name="description" 
								size="large" 
								placeholder="Description" 
								value={description} 
								onChange={(e)=>setDescription(e.target.value)}>
							</Input>
                    </Form.Item>
	
                    <Form.Item label="시작일">
							<DatePicker onChange={startDate}/>       
                    </Form.Item>
					<Form.Item label="종료일">
							<DatePicker onChange={endDate}/>   
                    </Form.Item>
					
					<Form.Item label="후원단체">
                            <Input type="text" 
								name="sponsor" 
								size="large" 
								placeholder="Sponsor" 
								value={sponsor} 
								onChange={(e)=>setSponsor(e.target.value)}>
							</Input>
                    </Form.Item>
                        
                    <Form.Item label="포스터">
                            <Dragger onChange={onChange} beforeUpload={() => false} >
                                <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                                </p>
                            </Dragger>
                    </Form.Item>
                    <Form.Item>
                            <Button type="primary" className="newAddButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
		}
		else{
			return(<Login />);
		}

    }

export default NewAdd;