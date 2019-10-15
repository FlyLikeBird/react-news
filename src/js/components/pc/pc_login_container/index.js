import React from 'react';

import { Modal, Tabs, Input, Col, Button, message } from 'antd';
import  LoginForm  from './pc_login';
import  RegisterForm  from './pc_register';

const TabPane = Tabs.TabPane;

export default class LoginContainer extends React.Component {
    
    constructor(props) {
      super();
      this.state = {
        
      }
    }

    handleModalCancel(){
      this.props.onModalVisible(false);
    }
    

    
   
    handleModalCancel(){
      if(this.props.onModalVisible){
        this.props.onModalVisible(false);
      }
    }

    render() {
      var { modalVisible, onLogined } = this.props;
      const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          }
      };
      const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          }
      };
      return (
         <Modal title="用户入口" visible={modalVisible} onCancel={this.handleModalCancel.bind(this)} footer={null} closable={true} destroyOnClose={true}>
              <Tabs type="card">
                <TabPane tab="登录" key="login">                           
                  <LoginForm formItemLayout={formItemLayout} tailFormItemLayout={tailFormItemLayout} onLogined={onLogined} />
                </TabPane>
                <TabPane tab="注册" key="register">
                  <RegisterForm formItemLayout={formItemLayout} tailFormItemLayout={tailFormItemLayout} onLogined={onLogined} />
                </TabPane>
              </Tabs>
        </Modal>
      )      
    }
    
}










