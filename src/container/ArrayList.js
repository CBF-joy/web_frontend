import React from 'react';

function TempInfo({tempInfo}){
	return(
	<div>
		<b>{tempInfo.description}</b>{tempInfo.thumbnail}		
	</div>
	)
}

function RenderTempInfoArray({tempInfoArray}){
	return(
		<>
		{
		tempInfoArray.map(
			tempInfo => (<TempInfo tempInfo={tempInfo} key={tempInfo.id}></TempInfo>)
		)
		}
		</>
	)
}
									   
export default RenderTempInfoArray;