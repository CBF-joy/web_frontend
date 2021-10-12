import React, { Component } from 'react';
import { CardActions, CardContent, CardHeader, Typography, Button, } from '@material-ui/core';
import ImageGallery from 'react-image-gallery';
import './ExhibitionTopic.css';

// const images = [
//   {
//     original: 'https://picsum.photos/id/1018/1000/600/',
//     thumbnail: 'https://picsum.photos/id/1018/250/150/',
//   },
//   {
//     original: 'https://picsum.photos/id/1015/1000/600/',
//     thumbnail: 'https://picsum.photos/id/1015/250/150/',
//   },
//   {
//     original: 'https://picsum.photos/id/1019/1000/600/',
//     thumbnail: 'https://picsum.photos/id/1019/250/150/',
//   },
// ];

class ExhibitionTopic extends Component{
    render(){
        const {images} = this.props;
        return (
            <div className="topic-container">
                <div className="topic-header">
                    주제 : {images[0].topic}
                </div>
                <div>
                <ImageGallery items={images} />
                </div>
                <div className="topic-fundraisingamount">
                    ㅇㅇKlay가 모였습니다!
                </div>
            </div>
        )
    }
}

export default ExhibitionTopic;