import React from 'react';
import secret from '../../../utils/secret';
import { Form, Input, Button, message, Tooltip, Icon, Badge } from 'antd';

const FormItem = Form.Item;

import style from './style.css';

class RegisterForm extends React.Component {
  
  handleRegisterSubmit(e){
      e.preventDefault();
      var { onLogin, form } = this.props;

      form.validateFields(['r_userName','r_password','r_confirmPassword'],(err,values)=>{
        if(!err){
          var { r_userName, r_password } = values;
          r_password = secret.encrypt(r_password);        
          fetch(`/api/usr/register?r_userName=${r_userName}&r_password=${r_password}`)
            .then(response=>response.json())
            .then(json=>{
              var data = json.data;  
              //console.log(json); 
              message.success('注册成功!');           
              if (onLogin) onLogin(data);

            })          
        }
      })
          
    }

  handleUsername(fieldName){     
      const { form } = this.props;

      let username = form.getFieldValue(fieldName);
     
      form.validateFields([fieldName],{force:true},(err,values)=>{
         if(!err){

            fetch.get('/api/usr/checkusername?username='+username)
            .then(response=>{

              let data = response.data;
              if (response && data.code == 1) {
                // 用户已存在，非法的用户名
                //console.log(data);
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
         } else {
            console.log(err);
         }
          
      })     
    }


   validateToConfirmPassword(rule,value,callback){
      const form = this.props.form;
      if (value && value.match(/^\s+$/)){
        callback('密码不能包含空格等格式字符!')
      }
      //console.log(callback);
      callback()
    }

    validateToFirstPassword(rule,value,callback){
      const form = this.props.form;
      if (value && value !== form.getFieldValue('r_password')) {
        callback('两次密码输入不一致！')
        
      } else {
        callback();
      }
    }

  handleCheckUsername(rule,value,callback){

      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
          regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
          regSpace = /\s+/;
      if ( regEn.test(value) || regCn.test(value) || regSpace.test(value)){
        callback('用户名不能包含空格字符及@#.等特殊字符！');
      } else {
        callback();
        
      }      
    }

  render(){
    var { form, formItemLayout, tailFormItemLayout } = this.props;
    var { getFieldDecorator } = form;

    return (
      <Form {...formItemLayout} className={style.login} onSubmit={this.handleRegisterSubmit.bind(this)}>
          <FormItem label="用户名" hasFeedback >
            {getFieldDecorator('r_userName',{
              
              rules:[{
                required:true,
                message:'用户名不能为空'
              },{
                validator:this.handleCheckUsername.bind(this)
              }]
            })(
              <Input onBlur={this.handleUsername.bind(this,'r_userName')} placeholder="请输入用户名" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}  /> 
            )}
            
          </FormItem>
          <FormItem label="密码">
            {getFieldDecorator('r_password',{
              rules:[{required:true,message:'请输入密码!'},{
                validator:this.validateToConfirmPassword.bind(this)
              }]
            })(
              <Input type="password" placeholder="请输入您的密码!" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}/> 
            )}
            
          </FormItem>
          <FormItem label="确认密码">
            {getFieldDecorator('r_confirmPassword',{
              rules:[{required:true,message:'请输入同样的密码！'},{
                validator:this.validateToFirstPassword.bind(this)
              }]
            })(
              <Input type="password" placeholder="请再次输入您的密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}/> 
            )}
            
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button  type="primary" htmlType="submit">注册</Button>
          </FormItem>
    
      </Form>
    )
  }
}



export default RegisterForm = Form.create()(RegisterForm);