import React, { Component } from 'react';
import { CardActions, CardContent, CardHeader, Typography, Button, } from '@material-ui/core';
import './Main.css';
import AllTopicList from './exhibition/AllTopicList';
import TokenOnSale from './token/TokenOnSale';
import Page from '../market/components/page/Page_AllToken';
import Login from '../market/components/loginform/Login';

const Main = (props) => {

        return (
			

            <div className="main">
                <div className="topic-content">
					<AllTopicList></AllTopicList>
                </div>
                <div className="topic-content">
					<TokenOnSale></TokenOnSale>
                </div>
            </div>

        )
}

export default Main;