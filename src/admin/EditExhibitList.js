import React, { useState, useEffect } from 'react';
import { Table, Button,Form, Input, Upload, Icon, notification, Select, DatePicker, Divider, Spin} from 'antd';
import { Link } from 'react-router-dom';
import './EditExhibitList.css';
import Login from '../market/components/loginform/Login';
import {fetchExhibition, deleteExhibition, setStatusIng, setStatusEnd} from '../util/APIAdmin';
import { useMediaQuery } from 'react-responsive';
const { Dragger } = Upload;


const EditExhibitList = (props) => {
	
	const [ exhibitions, setExhibitions ] = useState([]);
    const [isLoading, setLoading] = useState(true);
	
	const isPc = useMediaQuery({
	  query: "(min-width:1024px)"
	});
	const isTablet = useMediaQuery({
	  query: "(min-width:768px) and (max-width:1023px)"
	});
	const isMobile = useMediaQuery({
	  query: "(max-width:767px)"
	});
	
	
	useEffect(()=>{
		loadExhibition()
	},[props])

	
	const loadExhibition  = () => {
        fetchExhibition()
            .then((res) => {
				setExhibitions(res)
			})
			.then(setLoading(false))
    }
	
	const onDelete = (eno) => {
        deleteExhibition(eno)
            .then(res => {
				setExhibitions(exhibitions.filter(exhibitions => exhibitions.eno !== eno))
            })
		.catch(error=>console.log(error))
    }
	
	const changeStatus = (eno, status) =>{
		if(status=='pre'){
			setStatusIng(eno)
			.then(res=>window.location.reload())
		}
		else if(status=='ing'){
			setStatusEnd(eno)
			.then(res=>window.location.reload())
		}
	}
	
	
		const columns = [
            {
              title: '제목',
              dataIndex: 'title',
              key: 'title',

            },
            {
              title: '설명',
              dataIndex: 'description',
              key: 'description',
            },
            {
                title: '시작일',
                dataIndex: 'fromDate',
                key: 'fromDate',
				render: fromDate =>(
					<div>{fromDate.substring(0,10)}</div>
				)
            },
            {
                title: '종료일',
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
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                  <span>
                    <Button>
                        <Link to={'editExhibit/'+record.eno}> 수정</Link>
                    </Button>
                    <Divider type="vertical" />
                    <Button onClick={()=>onDelete(record.eno)}  >
                        삭제
                    </Button>
						<Divider type="vertical" />
                    <Button onClick={()=>changeStatus(record.eno,record.status)} >
                        {record.status}
                    </Button>
                  </span>
                ),
              }
          ];
	
	const columns_mobile = [
            {
              title: '제목',
              dataIndex: 'title',
              key: 'title',

            },
            {
                title: '시작일',
                dataIndex: 'fromDate',
                key: 'fromDate',
				render: fromDate =>(
					<div>{fromDate.substring(0,10)}</div>
				)
            },
            {
                title: '종료일',
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
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                  <span>
                    <Button style={{ fontSize: '7px'}}>
                        <Link to={'editExhibit/'+record.eno}> 수정</Link>
                    </Button>
                    
                    <Button onClick={()=>onDelete(record.eno)} style={{ fontSize: '7px'}} >
                        삭제
                    </Button>
						
                    <Button onClick={()=>changeStatus(record.eno,record.status)} style={{ fontSize: '7px'}}>
                        {record.status}
                    </Button>
                  </span>
                ),
              }
          ];
		
		const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;

		if(props.role == "ROLE_ADMIN"){
			return (
				<div>
				{ isMobile ? <div className="editList-container_mobile">
        			<Spin spinning={isLoading} indicator={antIcon}>
                	<Table dataSource={exhibitions} columns={columns_mobile} pagination={{ pageSize: 8 }}/>
					 </Spin>
            </div> : <div className="editList-container">
        			<Spin spinning={isLoading} indicator={antIcon}>
                <Table dataSource={exhibitions} columns={columns} pagination={{ pageSize: 8 }}/>
					 </Spin>
            </div>}
					</div>
           
        );
		}
		else{
			return(<Login />);

		}

}

export default EditExhibitList;