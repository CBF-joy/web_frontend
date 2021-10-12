import React, { Component } from 'react';
import { Table, Divider, Button, Form, Input, Comment, List, Rate, notification } from 'antd';
import './MyTokenEdit.css';

class MyTokenEdit extends Component {

    render(){
        return (
            <div className="mytokenedit-container">
                  <Form>
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

export default MyTokenEdit;