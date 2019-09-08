import React from 'react';

import { Form, Input, Button, Message } from 'antd';

var fetch = require('../../fetch/fetch.js');

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(){
    super();
    
  }

  handleLoginSubmit(e){
     e.preventDefault();

    var formData = this.props.form.getFieldsValue();

    this.props.form.validateFields(['username','password'],(err,values)=>{
       if(!err){
         //console.log(formData);
         fetch.post('/usr/login',formData)
         //.then(response=>response.json())
         .then((response)=>{
           var data = response.data;
           var { username, userid } = response.data;
           
           if (response&& data.code == 0){
             if(this.props.onLogined){
             this.props.onLogined(data);
             }
           }

       });
       }
     })
   }

   handleUsername(fieldName){     
      const { form } = this.props;

      let username = form.getFieldValue(fieldName);
     
      form.validateFields([fieldName],(err,values)=>{
         
          fetch.get('/usr/checkusername?username='+username)
            .then(response=>{

              let data = response.data;
              if (response && data.code == 0) {
                // 用户还没注册
                
                form.setFields({
                  [fieldName]:{
                    value:username,
                    errors:[new Error(data.message)]
                  }
                });

                
              } else {
                form.setFields({
                  [fieldName]:{
                    value:username,
                    errors:null
                  }
                })
              
              }
            })
      })
      
  }

  handleCheckUsername(rule,value,callback){
      const { getFieldValue } = this.props.form;
       
      if (value && value.match(/\s+/)){
        callback('用户名不能包含空格等格式字符！');
      } else {
        callback();
        
      }

      
    }

  render(){

    const { getFieldDecorator } = this.props.form;

    return (
      <Form {...this.props.formItemLayout} onSubmit={this.handleLoginSubmit.bind(this)}>
        <FormItem label="用户名" hasFeedback >
          {getFieldDecorator('username',{
            rules:[{
              required:true,
              messsage:'用户名不能为空!'
            },{
              validator:this.handleCheckUsername.bind(this)
            }]
          })(
            <Input onBlur={this.handleUsername.bind(this,'username')} placeholder="请输入您的账户"/> 
          )}
          
        </FormItem>
        <FormItem label="密码">
          {getFieldDecorator('password',{
            rules:[{required:true,message:'密码不能为空'}]
          })(
            <Input type="password" placeholder="请输入您的密码"/> 
          )}
          
        </FormItem>
        <Button  type="primary" htmlType="submit">登录</Button>
    
      </Form>
    )
  }
}



export default LoginForm = Form.create()(LoginForm);