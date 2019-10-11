import React from 'react';

import { Form, Modal, Tabs, Input, Button, message } from 'antd';
import  LoginForm  from './pc_login';
import  RegisterForm  from './pc_register';

const FormItem = Form.Item;
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
    
      const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
      };
    
      return (
         <Modal title="用户入口" wrapClassName="vertical-center-modal" visible={this.props.modalVisible} onCancel={this.handleModalCancel.bind(this)} footer={null} closable={true}>
                        <Tabs type="card">

                          <TabPane tab="登录" key="login">
                            
                            <LoginForm formItemLayout={formItemLayout} onLogined={this.props.onLogined} />

                          </TabPane>

                          <TabPane tab="注册" key="register">
                            <RegisterForm formItemLayout={formItemLayout} onLogined={this.props.onLogined} />
                          </TabPane>

                        </Tabs>

        </Modal>
      )
        
        
    }
    
}










