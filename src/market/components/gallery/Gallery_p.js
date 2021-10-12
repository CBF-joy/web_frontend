import { CardActions, CardContent, CardHeader, Typography, Button, CardMedia } from '@material-ui/core';
import React from 'react';
import caver from '../../../klaytn/caver'
import Loading from '../Loading'
import { DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../../constants/index'
import '../Card.css';
import { Spin, Icon } from 'antd';
import { Link } from 'react-router-dom';
import {Viewer} from '../../../container/Viewer'


const Gallery_p = (props) => {


    const { eno, title, description, poster } = props;
    const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;


      return (
        <div className="card-container5">
			<Link to={'viewer/'+ eno }>
			<CardMedia
				component="img"
				image={poster}
				/>
            <CardContent>
				<Typography gutterBottom variant="h5" component="div">
				{title}
				</Typography>
              <Typography variant="body1" component="p">

                {description}
                <br></br>
                
              </Typography>
            </CardContent>
			</Link>
          
          </div>

      )




  }

export default Gallery_p;