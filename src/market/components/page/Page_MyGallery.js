import React from 'react';
import { useState } from 'react';

import './Page.css'

import MyTokenList1 from '../mytoken/MyTokenList1'
import MyTokenList2 from '../mytoken/MyTokenList2'

import { Input , IconButton ,Paper , Checkbox, FormControlLabel }  from '@material-ui/core';
import  SearchIcon  from '@material-ui/icons/Search'




const Page_MyGallery = (props) =>  {
  const { address } = props;

  const [searchValue, handleValueChange] = useState("");

  const [checkedS, handleChange] = useState(false);
  


    return (

    <div class="wrap">
        <div class="main-container">
          	<div class="greenContainer"></div>
          	<div class="TokenContainer">
            	<div class="title">내 토큰</div>
            	<MyTokenList1 address={address}/>
        	</div>
			<div class="TokenContainer">
            	<div class="title">전시회 등록된 토큰</div>
            	<MyTokenList2 address={address}/>
        	</div>
        </div>
     </div>
    )
  }


export default Page_MyGallery;