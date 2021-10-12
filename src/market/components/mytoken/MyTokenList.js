import React, { Component } from 'react';
import { Table, Divider, Button } from 'antd';
import { Link, Route, withRouter, Switch} from 'react-router-dom';
import './MyTokenList.css';

class MyTokenList extends Component {

    token = [
        {   
            title: '1',
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
        },
        {
            title: '2',
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
        },
        {
            title: '3',
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
          }
      ];

    exhibition = [
        {   
            title: '1',
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            description: '설명',
            exhibition: '1',
        },
    ];

    render() {
        const columns1 = [
            {
              title: '제목',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '이미지',
              dataIndex: 'image',
              key: 'image',
            },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                  <span>
                    <Button>
                      <Link to='/mytokenexhibit'>전시회 등록</Link>
                    </Button>
                  </span>
                ),
              }
          ];

          const columns2 = [
            {
              title: '제목',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '이미지',
              dataIndex: 'image',
              key: 'image',
            },
            {
                title: '등록된 전시회',
                dataIndex: 'exhibition',
                key: 'exhibition',
              },
            {
                title: '설명',
                dataIndex: 'description',
                key: 'description',
              },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                  <span>
                    <Button>
                        <Link to='/mytokenedit'>설명 수정</Link>
                    </Button>
                    <Divider type="vertical" />
                        <Button>등록 취소</Button>
                  </span>
                ),
              }
          ];
        return (
            <div>
                <div className="mytoken-container">
                    <div className="mytoken-container-header">
                        보유 토큰
                    </div>
                    <Table dataSource={this.token} columns={columns1} pagination={{ pageSize: 8 }}/>
                </div>
                <div className="mytoken-container">
                    <div className="mytoken-container-header">
                        전시회 등록된 토큰
                    </div>
                    <Table dataSource={this.exhibition} columns={columns2} pagination={{ pageSize: 8 }}/>
                </div>
            </div>
            
        );
    }
}

export default MyTokenList;