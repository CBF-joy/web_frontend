import React, { Component } from 'react';
import { Table, Divider, Button, Form, Input, Comment, List, Rate, notification, Select } from 'antd';
import './MyTokenEdit.css';

const { Option } = Select;

class MyTokenExhibit extends Component{

    render(){
        return (
            <div className="mytokenedit-container">
                <Form>
                    <Form.Item label="전시회 주제 선택">
                        <Select name="topic" size="large">
                            <Option value="mon">주제 1</Option>
                            <Option value="tue">주제 2</Option>
                            <Option value="wed">주제 3</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="설명 수정">
                        <Input type="text" name="description" size="large" placeholder="description"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="editbutton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default MyTokenExhibit;