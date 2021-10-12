import React, { useState, useEffect } from 'react';
import { Table, Button,Form, Input, Upload, Icon, notification, Select, DatePicker} from 'antd';
import { Link } from 'react-router-dom';
import './AdminMenu.css';
import Login from '../market/components/loginform/Login';
import {fetchExhibitionById, fetchPosterById, editExhibitionExceptFile, editExhibition, deletePoster} from '../util/APIAdmin';
import moment from 'moment';
const { Dragger } = Upload;
const dateFormat = 'YYYY-MM-DD';


const  EditExhibit = (props) => {

	
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [sponsor, setSponsor] = useState('');
	const [fileLists, setFileLists] = useState([]);
	
	
	useEffect(()=>{
		loadExhibition();
	},[props])


	
	
	const loadExhibition = () => {
		
    	fetchExhibitionById(parseInt(props.match.params.id, 10))
        .then((res) => {
			setTitle(res.title);
			setDescription(res.description);
			setFromDate(res.fromDate.substring(0,10));
			setToDate(res.toDate.substring(0,10));
			setSponsor(res.sponsor);
		
        });
	}
	
	const startDate = (date, dateString) => {
		console.log(date, dateString)
		setFromDate(dateString);	
	}
	const endDate = (date, dateString) => {
		console.log(date, dateString)
		setToDate(dateString)
		
	}
	

	

	const onChange=({ fileList })=> {
		setFileLists(fileList)
	}

	const uploadEditExhibition = () => {
    	try {

        	if(fileLists.length < 1){ //썸네일 수정하지 않은 경우
            	editExhibitionExceptFile(parseInt(props.match.params.id, 10), title, description, fromDate, toDate, sponsor)
				.then(res=>console.log(res))
		
        	} else { //썸네일 수정한 경우
            	editExhibition(parseInt(props.match.params.id, 10), title, description, 
							   fromDate, toDate, sponsor, fileLists[0].originFileObj)
		
       		}
			props.history.push('/adminmenu')
        	notification.success({
            	message: '전시해',
            	description: "정상적으로 저장되었습니다.",
          	});
		} catch(error) {
			console.log(error);
            notification.error({
                message: '전시해',
                description: error.message || '다시 시도해주세요.'
            });
        }
    }
		


		
		
	if(props.role == "ROLE_ADMIN"){
		return (
           <div className="editToon-container">
                 <Form onSubmit={uploadEditExhibition}>
					 
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
					<Form.Item label="시작일">{fromDate}
					  <DatePicker onChange={startDate}/>
					</Form.Item>
					<Form.Item label="종료일">{toDate}
					  <DatePicker onChange={endDate} />
					</Form.Item>
					<Form.Item label="후원 단체">
                            <Input type="text" 
								name="sponsor" 
								size="large" 
								placeholder="Sponsor" 
								value={sponsor} 
								onChange={(e)=>setSponsor(e.target.value)}>
							</Input>
					</Form.Item>

                    <Form.Item label="포스터">
							포스터 수정 없으면 그냥 save
   
                            <Dragger onChange={onChange} beforeUpload={() => false} >
                                <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or Drag your image</p>
                                <p className="ant-upload-hint">
                                썸네일 권장 사이즈는 10 : 8 (비율) 입니다.
                                </p>
                            </Dragger>
                    </Form.Item>
                    <Form.Item>
                            <Button type="primary" className="editToonButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
					 
                </Form>
            </div>
        );
		
		}
		else{
			return(<Login />);
		}
}

export default EditExhibit;