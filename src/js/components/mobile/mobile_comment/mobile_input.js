import React from 'react';
import { Menu, Spin, Tabs, Input, Button, Icon, Form, message, Modal } from 'antd';

import style from './mobile_comment_style.css';
const FormItem  = Form.Item;
class MobileInput extends React.Component {
    
    constructor(){
        super();
        this.state = {
            text:''
        }
    }


    handleSubmit(e){
        e.preventDefault();
        var { form } = this.props;
        var { getFieldValue } = form;
        var content = getFieldValue('comment');
        if(!content){
            message.info('评论不能为空!')
        } else {

        }
        alert('hello');
    }

    
    render(){
        var { text } = this.state;
        var { form } = this.props;
        var { getFieldDecorator } = form;
       
        return (
            <Form className={style['user-input']} onSubmit={this.handleSubmit.bind(this)}>        
                <FormItem>
                  {getFieldDecorator('comment')(
                    <Input placeholder={text}/> 
                  )}                  
                </FormItem>
            </Form> 
                   
        )
    }
}

export default MobileInput = Form.create()(MobileInput);






