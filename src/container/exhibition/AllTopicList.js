import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageGallery from 'react-image-gallery';
import { render } from 'react-dom';
import { Form, Button, Input, Comment, List, Rate, notification} from 'antd';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import { getIngExhibition, getDonateByExhibit } from '../../util/APIUtils';
import Gallery_1 from '../../market/components/gallery/Gallery_1.js'
import './AllTopicList.css'
				

class AllTopicList extends Component {
	constructor(props){
		super(props);
		this.state = {
			exhibition:[]
		}
	}
	
	loadExhibition = async () =>{
		var exhibitionList = new Array();
		await getIngExhibition().
		then(res=>{
			
			
			for(var i=0 ; i < res.length ; i++ ){
				
	var data = new Object();
	
		data.eno= res[i].eno;
				
		data.title = res[i].title;
				
		data.description = res[i].description;
				
		data.poster = res[i].poster.fileUri;
		
		data.klay = res[i].klay;
			
		exhibitionList.push(data)
				console.log(res[i])
			}
		})
		this.setState({
				exhibition:exhibitionList
			})

			
		

	}
	

	
	componentDidMount = async () => {
	
		await this.loadExhibition()
    



}
	
	
    render() {
		if(this.state.exhibition != null ){
			console.log(this.state.exhibition)
			return(
        <div className="token-container">
			<div className="token-header2">
				진행중인 전시
			</div>	
			{this.state.exhibition.map((exhibition, idx) => {
                 return(
					 <Gallery_1
 						key={idx}
						eno={exhibition.eno}
						title={exhibition.title}
						description={exhibition.description}
						 poster={exhibition.poster}
						 klay= {exhibition.klay}
							 
                  />)

                })}
        </div>
        )
			
		}else{
			return(
				<div className="token-container">진행중인 전시가 없습니다.</div>
			)
		}
        
    }
  }

export default AllTopicList;