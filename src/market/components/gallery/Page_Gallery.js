import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ImageGallery from 'react-image-gallery';
import { render } from 'react-dom';
import { Form, Button, Input, Comment, List, Rate, notification} from 'antd';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import { getIngExhibition, getExhibitionBySumRanking } from '../../../util/APIUtils';
import Gallery_p from './Gallery_p'		
import '../page/Page.css'
				
				

const Page_Gallery = (props) => {

	
	const [exhibitions, setExhibitions] = useState([]);
	
	const loadExhibition = async () =>{
		var exhibitionList = new Array();
		await getIngExhibition().
		then(res=>{
			for(var i=0 ; i < res.length ; i++ ){
				
	var data = new Object();
	
		data.eno= res[i].eno;
				
		data.title = res[i].title;
				
		data.description = res[i].description;
				
		data.poster = res[i].poster.fileUri
				
		exhibitionList.push(data)
				console.log(res[i])
			}
			
			
			console.log(exhibitions)
		})
		setExhibitions(exhibitionList)


	}
	
	const loadRanking = () => {
		getExhibitionBySumRanking().
		then((res)=>console.log(res))
	}
	
	
	useEffect(()=>{
		async function fetchInfo(){
			await loadExhibition();
			await loadRanking();
		}
		fetchInfo();
		
		
	},[props])
	
	

	
	

	if(exhibitions != null ){
		console.log(exhibitions)
		return(
    		<div className="main-container">
				<div class="greenContainer"></div>
				<div class="TokenContainer">
            	<div class="title">진행중인 전시</div>
				<div className="exhibitionlist">
					{exhibitions.map((exhibition, idx) => {
                 		return(
					 		<Gallery_p
 							key={idx}
							eno={exhibition.eno}
							title={exhibition.title}
							description={exhibition.description}
						 	poster={exhibition.poster}
							 />)
					})}
				</div>
				</div>
        	</div>
        )			
		}else{
			return(
				<div>
				진행 중인 전시가 없습니다.</div>
			)
		}
        
    }
  

export default Page_Gallery;