import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageGallery from 'react-image-gallery';
import './Gallery.css';
import { render } from 'react-dom';
import { Form, Button, Input, Comment, List, Rate, notification} from 'antd';
import moment from 'moment';

const { TextArea } = Input;



const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} />}
    />
  );
  

  const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          Edit Comment
        </Button>
      </Form.Item>
    </>
  );
  
  class Gallery extends React.Component {

    state = {
      comments: [],
      submitting: false,
      value: '',
    };
  
    handleSubmit = () => {
      if (!this.state.value) {
        return;
      }
  
      this.setState({
        submitting: true,
      });
  
      setTimeout(() => {
        this.setState({
          submitting: false,
          value: '',
          comments: [
            ...this.state.comments,
            {
              author: '111',
              content: <p>{this.state.value}</p>,
              datetime: moment().fromNow(),
            },
          ],
        });
      }, 1000);
    };
  
    handleChange = e => {
      this.setState({
        value: e.target.value,
      });
    };
  
    render() {
        const {images} = this.props;
        const { comments, submitting, value } = this.state;
  
      return (
        <div className="exhibition">
            <div className="exhibition-topic">
                주제 : {images[0].topic}
            </div>
            <div className="exhibition-image">
                <ImageGallery items={images} showIndex={true} showBullets={true}/>
            </div>
            <div className="exhibition-comment">
                <>
                {comments.length > 0 && <CommentList comments={comments} />}
                <Comment
                    content={
                        <Editor
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />
                </>
            </div>
        </div>
      );
    }
  }
  
export default Gallery;