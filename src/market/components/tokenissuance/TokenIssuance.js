import { Link, withRouter } from "react-router-dom";
import './TokenIssuance.css';
import React, { Component } from 'react';
import { Form, Button, Input, Upload, Icon, notification, Modal, Spin, InputNumber } from 'antd';
import { saveImagefile, saveDescriptionfile } from '../../../util/APIAuthor';
import { DEPLOYED_ABI, DEPLOYED_ADDRESS } from '../../../constants/index';
import caver from '../../../klaytn/caver'

const { Dragger } = Upload;
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


class TokenIssuance extends Component {


    constructor(props) {
        super(props)
        this.state = {
            title: '',
            artist: '',
            date: '',
            description: '',
            file: [],
        }

    }



    onChangeTitle = (e) => {
        this.setState({ title: e.target.value })
    }

    onChangeArtist = (e) => {
        this.setState({ artist: e.target.value })
    }

    onChangeDate = (e) => {
        this.setState({ date: e.target.value })
    }

    onChangeDescription = async (e) => {
        this.setState({ description: e.target.value })

    }

    //file 선택 시
    onChangeFile = ({ fileList }) => {
        fileList = fileList.slice(-1)
        this.setState({ file: fileList })
    }

    onSubmit = async () => {

        try {
            let imgURI = await saveImagefile(this.state.file[0].originFileObj);
			let descURI = await saveDescriptionfile(this.state.description);

			
            if (await this.checkTokenExists(this.state.title, this.state.artist)) {
                alert('이미 발행된 토큰입니다.');
                return (null)
            } else {
                await this.mintECO(this.state.artist, this.state.title, this.state.date, imgURI.file_uri, descURI.file_uri)
            }

        } catch (error) {
            notification.error({
                message: '전시해',
                description: error.message || '다시 시도해주세요.'
            });
            console.log(error)
        }
    };


    checkTokenExists = async (title, artist) => {
        try {
            return wttContract.methods.isTokenAlreadyCreated(title, artist).call();
        } catch (e) {
            console.error(e);
        }
    }

    mintECO = async (artist, title, date, imgURI, descURI) => {
        try {
            const sender = this.props.address;

            await fetch("https://wallet-api.klaytnapi.com/v2/tx/fd-user/contract/execute", {

                method: "post",
                headers: {
                    "Authorization": "Basic S0FTS0JBRTY4RVg2Q1UxVFBHR0ZFRk5ROjZyUVhvdHFyRDREeVVucDJBLXlGeWRWNnBzVm1jUjhZOHU3N0xHZFM=",
                    "x-chain-id": "1001",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "from" : sender,
                    "to": DEPLOYED_ADDRESS,
                    "input" : wttContract.methods.mintECO(artist, title, date, imgURI, descURI).encodeABI(),
                    "submit":true,
                    "feePayer": "0xe03f2d915FCEfaACF08076e389f322846cc50B60"
                    }),
            })
                .then((res) => res.json())
                .then((json) => {
                    notification.success({
                        message: '전시해',
                        description: json.transactionHash
,
                    })
                    notification.success({
                        message: '전시해',
                        description: "정상적으로 토큰이 발행되었습니다. 발행된 토큰은 '내 토큰'에서 확인할 수 있습니다.",
                    })
                    setTimeout(() => window.location.reload(), 1700)
                })

        } catch (error) {
            console.log(error)
        }

    }



    render() {

        return (
            <div>
                <div className="wrap">
                    <div className="main-container">
                        <div className="greenContainer"></div>
                        <div className="TokenContainer">
                            <div className="title">토큰 발행</div>
                        </div>
                    </div>
                </div>
                <div className="new-container">
                    <Form onSubmit={this.uploadNew}>
                        <Form.Item label="작가">
                            <Input type="text" name="artist" size="large" value={this.state.artist} onChange={this.onChangeArtist}></Input>
                        </Form.Item>
                        <Form.Item label="작품명">
                            <Input type="text" name="title" size="large" value={this.state.title} onChange={this.onChangeTitle}></Input>
                        </Form.Item>
                        <Form.Item label="제작연도">
                            <Input
                                type="number"
                                name="date"
                                min={0}
                                max={9999}
                                size="large"
                                value={this.state.date}
                                onChange={this.onChangeDate}></Input>
                        </Form.Item>
                        <Form.Item label="작품 설명">
                            <Input.TextArea type="text" name="description"
                                autoSize={{ minRows: 5, maxRows: 5 }}
                                maxLength={300}
                                value={this.state.description}
                                onChange={this.onChangeDescription} />
                        </Form.Item>
                        <Form.Item label="작품 파일">
                            <Dragger
                                fileList={this.state.file}
                                onChange={this.onChangeFile}
                                beforeUpload={() => false}
                                listType="picture"
                                accept="image/*, video/*"
                            >
                                <p className="ant-upload-drag-icon"><Icon type="inbox" /></p>
                                <p className="ant-upload-text">Click or Drag your artwork here</p>
                                <p className="ant-upload-hint">작품 원본 파일을 업로드해주세요.</p>
                            </Dragger>
                            {/* <img alt="artworks" style={{ width: "100%" }} src={this.state.previewImage} /> */}
                        </Form.Item>
                    </Form>
                    <Button type="primary" className="newAddButton" size="large"
                        disabled={(this.state.title && this.state.artist && this.state.date && this.state.description) == ''}
                        onClick={this.onSubmit}>Save</Button>

                </div>
            </div>
        );
    }
}

export default TokenIssuance;