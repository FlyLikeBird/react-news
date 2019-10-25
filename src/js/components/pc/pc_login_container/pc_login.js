import React from 'react';
import { Form, Input, Button, message } from 'antd';
const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(){
    super();
    
  }

  handleLoginSubmit(e){
     e.preventDefault();
     var { onLogined, form } = this.props;
     form.validateFields(['username','password'],(err,values)=>{
       if(!err){
         var { username, password } = values; 
         fetch(`/api/usr/login?username=${username}&password=${password}`)
            .then(response=>response.json())
            .then(json=>{    
                           
                if (json.code == 0){
                  if (onLogined) onLogined(json.data);
                } else {
                  message.error(json.message);
                }
            })
         
       }
     })
   }

   handleUsername(fieldName){     
      const { form } = this.props;
      var username = form.getFieldValue(fieldName);    
      form.validateFields([fieldName],(err,values)=>{         
            fetch('/api/usr/checkusername?username='+username)
              .then(response=>response.json())
              .then(json=>{
                  if ( json.code == 0) {
                    // 用户还没注册                  
                    form.setFields({
                      [fieldName]:{
                        value:username,
                        errors:[new Error(json.message)]
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
    var { form, formItemLayout, tailFormItemLayout } = this.props;
    var { getFieldDecorator } = form;
    
    return (
      <Form {...formItemLayout} onSubmit={this.handleLoginSubmit.bind(this)}>
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
        <FormItem {...tailFormItemLayout}>
          <Button  type="primary" htmlType="submit">登录</Button>
        </FormItem>
      </Form>
    )
  }
}



export default LoginForm = Form.create()(LoginForm);