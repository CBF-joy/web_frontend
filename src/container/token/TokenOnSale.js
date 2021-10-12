import React from 'react';
import { useState } from 'react';
import { Input , IconButton ,Paper , Checkbox, FormControlLabel }  from '@material-ui/core';
import  SearchIcon  from '@material-ui/icons/Search'
import './TokenOnSale.css';
import AllCardList_main from '../../market/components/alltoken/AllCardList_main.js'

const TokenOnSale = (props) => {
    const [searchValue, handleValueChange] = useState("");
    const [isSale, handleChange] = useState(true);
	

    return (

		<div className="token-container">
            <div className="token-header2">
                    판매중인 토큰
            </div>
			 <AllCardList_main  isSale={isSale} searchValue={searchValue}/>
      </div>
    )

}


export default TokenOnSale;