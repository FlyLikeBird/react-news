import React from 'react';

import { Modal, Tabs, Input, Col, Button, message } from 'antd';
import  LoginForm  from './pc_login';
import  RegisterForm  from './pc_register';

const TabPane = Tabs.TabPane;

export default class LoginContainer extends React.Component {
    
    render() {
      var { modalVisible, onLoginVisible, onLogin } = this.props;
      const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          }
      };
      const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 20,
              offset: 4,
            },
          }
      };
      return (
         <Modal title="用户入口" visible={modalVisible} onCancel={()=>onLoginVisible(false)} footer={null} destroyOnClose={true}>
              <Tabs type="card">
                <TabPane tab="登录" key="login">                           
                  <LoginForm formItemLayout={formItemLayout} tailFormItemLayout={tailFormItemLayout} onLogin={onLogin} />
                </TabPane>
                <TabPane tab="注册" key="register">
                  <RegisterForm formItemLayout={formItemLayout} tailFormItemLayout={tailFormItemLayout} onLogin={onLogin} />
                </TabPane>
              </Tabs>
        </Modal>
      )      
    }
    
}










