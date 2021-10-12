import React from 'react';
import { useState } from 'react';
import './Page.css'
import AllCardList_1 from '../alltoken/AllCardList_1';
import { Input , IconButton ,Paper , Checkbox, FormControlLabel }  from '@material-ui/core';
import  SearchIcon  from '@material-ui/icons/Search'

const Page_AllToken = (props) => {
    const { address } = props;

    const [searchValue, handleValueChange] = useState("");

    const [isSale, handleChange] = useState(false);
	
	

    return (

      <div class="wrap">
        <div class="main-container">
          <div class="greenContainer"></div>
          <div class="TokenContainer">
            <div class="title">전체 토큰</div>
 				<Paper component="form" className="searchBox">
              <IconButton type="submit"  aria-label="search">
                <SearchIcon />
              </IconButton>
              <Input 
                placeholder= "작품이름 or 작가" 
                inputProps={{'aria-label':'description'}} 
                onChange = {(e) => handleValueChange(e.target.value)} 
                onKeyPress={(ev) => { console.log("Pressed KeyCode "+ev.key);
                                    if(ev.key === 'Enter'){
                                      ev.preventDefault();
                                      }
                            }} 
              />
              <FormControlLabel
                control={
                  <Checkbox
                  checked={isSale}
                  onChange={(e) => handleChange(e.target.checked)}
                  name="isSale"
                  color="primary"
                  />
                }
                label="판매중 토큰 보기"
              />
            </Paper>

            <AllCardList_1  isSale={isSale} searchValue={searchValue} address={address}/>
          </div>
        </div>
      </div>
    )

}


export default Page_AllToken;