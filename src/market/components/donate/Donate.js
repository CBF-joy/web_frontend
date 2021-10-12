import React from 'react';
import { useState, useEffect} from 'react';
import caver from '../../../klaytn/caver';
import { InputLabel, MenuItem, FormControl, Select,DialogTitle,DialogContent, DialogActions, DialogContentText} from '@material-ui/core';
import { DEPLOYED_ABI, DEPLOYED_ADDRESS, sponsor_1
} from '../../../constants';
import {saveDonate} from '../../../util/APIUtils'
import { Form, Input, Comment, List, Rate, notification, Button} from 'antd';
import "./Donate.css"


const { Option } = Select;

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const Donate = (props) =>  {

  const [ inputprice, setPrice] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [ painting, setPainting] = useState(props.painting);
	const [selectedID, setSelectedPainting] = useState('');
	console.log(painting)



  const donate = async ( ) => {
   
	  var value =parseInt(caver.utils.toPeb(inputprice,'KLAY'))

	  value = '0x'+value.toString(16)
	  console.log(value)

	  //기부
	  try {
            const sender = props.address;
		  console.log(sender)

            await fetch("https://wallet-api.klaytnapi.com/v2/tx/value", {

                method: "post",
                headers: {
                    "Authorization": "Basic S0FTS0JBRTY4RVg2Q1UxVFBHR0ZFRk5ROjZyUVhvdHFyRDREeVVucDJBLXlGeWRWNnBzVm1jUjhZOHU3N0xHZFM=",
                    "x-chain-id": "1001",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "from" : sender,
					"value": value,
                    "to": sponsor_1,
				    "memo": String(selectedID),
					"nonce": 0,
					"gas":100000,
                    "submit":true,
                    }),
            })
                .then((res) => res.json())
                .then((json) => {
                    alert(json.transactionHash);
					
				//db post
					saveDonate(selectedID, sender, inputprice)
						.then(response => {
						console.log(response)
					})
						.catch(error =>{
						console.log(error)
					})
					
                    notification.success({
                        message: '전시해',
                        description: "기부 감사합니다!",
                    })
                })

        } catch (error) {
            console.log(error)
        }
	  



  }



  
    return (
      
      <div>
			
<DialogTitle>기부하기</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<div>
			     전시회 : {props.e_title}
			</div>
			<div>
			     후원단체 : {props.sponsor}
			</div>
				</DialogContentText>

						
				<FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">작품</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedID}
          label="Age"
          onChange={(e)=>setSelectedPainting(e.target.value)}
        >
			{painting.map((painting)=>{
				return <MenuItem value={painting.pno}>{painting.title}</MenuItem>
			})}
        </Select>
      </FormControl>
				<DialogContent className="input_">
     
      
					
								<input
                  type="number"
                  placeholder="KLAY"
                  min='0'
                  step="0.01"
                  style={{ width: "100px"}}
                  value={inputprice}
                  onChange={(e) => setPrice(e.target.value)} />
					{'  '}
								<Button type="primary" size="large" className="donateButton" onClick={(e)=>donate()}>기부하기</Button>
					</DialogContent>

		
</DialogContent>

                            
				

				
               

      </div>

    )

}



export default Donate;