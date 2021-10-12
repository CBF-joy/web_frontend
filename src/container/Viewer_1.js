import React from 'react';
import './Viewer_1.css';

const Viewer_1 = (props) => {
	
	const {title, img_uri, description} = props;
	console.log(props)
	
	return(
		<div className="viewer">
			<div className="viewer_content">
				<img src={img_uri} className="img" alt={title}/>
			</div>
			<div className="viewer_title">{title}</div>
			<div className="viewer_description">{description}</div>
		
		</div>
	)
}

export default Viewer_1;