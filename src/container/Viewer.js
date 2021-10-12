import React, { useRef, useState, useEffect } from 'react';
import {fetchEpiById, uploadComment, uploadEditComment, uploadRate, uploadEditRate} from '../util/APIAdmin';
import { Form, Button, Input, Comment, List, Rate, notification, Select} from 'antd';
import {  getIngExhibitionDetail, getComment, getAvgRate, fetchRate, saveRate, editRate, saveComment, editComment, deleteComment, saveDonate} from '../util/APIUtils';
import BanPage from "../common/BanPage";
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import caver from '../klaytn/caver'
import { DEPLOYED_ABI, DEPLOYED_ADDRESS, sponsor_1, sponsor_2
} from '../constants';
import Donate from '../market/components/donate/Donate'
import ImageGallery from 'react-image-gallery';
import ArrayInsert from './ArrayInsert';
import ArrayList from './ArrayList';
import Viewer_1 from './Viewer_1';
import "./Viewer.css";

const { TextArea } = Input;
const { Option } = Select;
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


const Viewer = (props) => {
   
   const [ exhibition, setExhibition ] = useState({});
   const [ comment, setComment ] = useState('');
   const [ username, setUsername ] = useState(props.username);
   const [ comments, setComments ] = useState([]);
   const [ editComments, setEditComments ] = useState('');
   const [ rate, setRate ] = useState(0);
   const [ fetchRates, setFetchRates ] = useState(null);
   const [ avgRate, setAvgRate] = useState(null);
   const [ showInput, setShowInput ] = useState(false);
   const [ open, setOpen ] = useState(false);
   const [ isLoading, setLoading ] = useState(false);
   const [ painting, setPainting ] = useState([]);
   const [ banpage, setBanPage ] = useState(false);
   const [ selectedPainting, setSelectedPainting ] = useState('');
   const [ inputprice, setPrice] = useState('');
   
   
   const [tempInfoArray, setTempInfoArray] = useState([{}]);
    

   
   const [inputVal, setInputVal] = useState({
	    id:1,
       	description: '1',
       	original: 'https://picsum.photos/id/1015/1000/600/',
      	thumbnail: 'https://picsum.photos/id/1015/1000/600/',
     });
   
	
   const { description, original, thumbnail } = inputVal;

     const onChange = e => {
       const { name, value } = e.target;
       setInputVal({
            ...inputVal,
            [name] : value
          })
     }
   
	 const nextId = useRef(4);
	 
     const onInsertArray = () => {
       const newTempInfo = {
		   	id: nextId.current,
          	description: description,
          	original: original,
         	thumbnail: thumbnail,
       }
    
       setTempInfoArray([...tempInfoArray, newTempInfo]);
       //setTempInfoArray(tempInfoArray.concat(newTempInfo)); // 윗 줄의 ...연산자 사용시와 동일 결과

       setInputVal({
         description: '',
          original: '',
         thumbnail: '',
       })
		nextId.current += 1;
    }

   
   
   
    useEffect(()=>{
       async function fetchInfo(){
         await _getExhibition();
           await loadComment();
           await loadAvg();
           await loadRate();
       };
       
       fetchInfo();
         
      },[props]
   )
  
   


   
   const _getExhibition =  () => {
      
      getIngExhibitionDetail(parseInt(props.match.params.exhibitionId, 10))
      .then(res => {
         console.log(res);
            setExhibition(res);
         setPainting(res.painting);
		  console.log(res.painting);
            }
   
          )
            .catch(error => {
         console.log(error)
         setBanPage(true);
         
            });
      
   }
   
   
   const loadAvg = () => {
        getAvgRate(parseInt(props.match.params.exhibitionId, 10))
            .then(res => {
         console.log(res)
         setAvgRate(res);
            })
            .catch(error => {
                console.log(error);
            });
    }
   
   const loadComment = () => {
        getComment(parseInt(props.match.params.exhibitionId, 10))
            .then((res) => {
         console.log(res);
         setComments(res);
        });
      console.log(comments)
    }
   
   const loadRate = async () => {
        await fetchRate(parseInt(props.match.params.exhibitionId, 10), username)
            .then(res => {
         console.log(res);
         setFetchRates(res.rate);
            })
            .catch(error => {
                console.log(error);
            });
    }
   
   
    
    const uploadRate = () => {
		 if( props.address){
			try{
            	saveRate(parseInt(props.match.params.exhibitionId, 10), username, rate)
                .then(function(){
                    window.location.reload();
                })
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
     	else{
        	notification.error({
           		message: '로그인이 필요합니다.'
        	})
     	}
    }
    
    const _editRate = () => {
		if(props.address){
	    	try{
            	editRate(parseInt(props.match.params.exhibitionId, 10), username, fetchRates)
                .then(function(){
                    window.location.reload();
                })
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
		}else{
			notification.error({
           		message: '로그인이 필요합니다.'
        	})
		}
    }

	const uploadComment = () => {
		if(props.address){
			saveComment(parseInt(props.match.params.exhibitionId, 10), username, comment)
      		.then((res)=>console.log(res))
		}else{
			notification.error({
           		message: '로그인이 필요합니다.'
        	})
		}

    }





	const _editComment = (id) => {
		editComment(id, editComments)
            .then(res=>{
            	setShowInput(false);
              	window.location.reload();
		})
	}

	const onDelete = (cno) =>{
        deleteComment(cno)
        .then(res => {
        	setComments(comments.filter(comment => comment.cno !== cno))
		})
    }

  	const handleClickOpen = () => {
     	if( props.address){
        	setOpen(true);
     	}
     	else{
        	notification.error({
           		message: '로그인이 필요합니다.'
        	})
    	}
    }
  
   

 

	if(banpage) {
            return <BanPage />;
        }

      var num = Number(avgRate);


    return (
		<>
            <div>
                <div>
                    { exhibition.eno ? (
                        <div>
                            <div className="top_viewer">
                                {exhibition.title}
                            </div>
							{/*
                            <div className="wrap_images">
                                포스터<img src={exhibition.poster.fileUri} alt={exhibition.title} />
                        
                            </div>
								*/}
                     <div className="wrap_images">
						{painting.map(({title, file_uri, description})=> (
							<Viewer_1 title={title} img_uri={file_uri} description={description}></Viewer_1>							
                        ))}

                            </div>
                        </div>
                    ) : (
                        <span>LOADING...</span>
                    ) }
                </div>
            
            <div className="comment_container">
				<div className="parent">
			<div className="child_1">
                        <span className="avgRate"> 평점 : {num.toFixed(1)} </span>
                        <Rate disabled allowHalf style={{fontSize:20}} value={avgRate} className="avgStar"/>
                    </div>
               
               <div className="child_2">
                  <Button type="primary" size="medium" onClick={(e)=>handleClickOpen()}>기부하기</Button>
                  <Dialog className="dialog" open={open} centered onClose ={()=>setOpen(false)} >
                     <Donate e_title={exhibition.title} painting={painting} sponsor={exhibition.sponsor} address={props.address}/>
                     
                        <Button className="button" variant="contained" color="default" disabled={isLoading} onClick={(e)=>setOpen(false)}> 닫기</Button>
                     
                  </Dialog>
               </div>
				</div>
                    
               
                    <div className="rating_container">
                        {fetchRates!==null ? <Rate onChange={(value)=>setFetchRates(value)} value={fetchRates}/> :
                        <Rate onChange={(value)=>setRate(value)} value={rate} />}
                        {fetchRates ? <Button type="primary" size="small" onClick={(e)=>_editRate(e.target.value)} >별점 수정</Button> :
                        <Button type="primary" size="small" onClick={()=>uploadRate()}>별점 등록</Button>}
                    </div>
                    <Form onSubmit={()=>uploadComment()}>
                        <Form.Item>
                            <TextArea rows={4} onChange={(e)=>setComment(e.target.value)} value={comment} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" className="commentButton" htmlType="submit" type="primary">
                            Add Comment
                        </Button>
                        </Form.Item>
                    </Form>
                    <div>
                    <List
                        pagination={{pageSize: 10}}
                        className="comment-list"
                        header={`${comments.length} replies`}
                        itemLayout="horizontal"
                        dataSource={comments}
                        renderItem={item => (
                        <li>
                            <Comment
                            author={item.username}
                            content={item.comment}
                            datetime={item.updatedAt}
                            />
                            {item.username==username ? 
                            <div>
                                <Button onClick={(e)=>setShowInput(true)}>수정</Button>
                                {/* 리스트 위치파악하기 */}
                                {showInput?
                                <div className="editForm-container">
                                    <Form>
                                        <Form.Item>
                                            <TextArea rows={4} onChange={(e)=>setEditComments(e.target.value)} defaultValue={item.comment} /> 
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" className="commentButton" onClick={()=>_editComment(item.cno)}>
                                            Edit Comment
                                        </Button>
                                        </Form.Item>
                                    </Form>
                                </div> : null}
                                <Button onClick={()=>onDelete(item.cno)}>삭제</Button>
                            </div> : null}
                        </li>
                        )}
                    />
                    </div>

                </div>
            </div>
		</>
        )
    
}

export default Viewer;