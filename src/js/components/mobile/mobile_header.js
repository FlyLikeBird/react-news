import React from 'react';
import { Link } from 'react-router';
import { Row,Col } from 'antd';

import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


class MobileHeader extends React.Component {
    
    constructor() {
      super();
      this.state = {
        current:'top',
        modalVisible:false,
        action:'login',
        hasLogined:false,
        userNickName:'',
        userid:0
        
      }
    }

    componentWillMount(){
      if ( localStorage != ''){
        this.setState({hasLogined:true});
        this.setState({userNickName:localStorage.userNickName,userid:localStorage.userid});
       
      }
    }
    
    login(value){
        this.setModalVisible(value);
    }

    handleClick(e){
      //console.log(e);
      //console.log(this);
      if (e.key == 'register'){
        this.setState({current:'register'});
        this.setModalVisible(true);
      } else {
        this.setState({
        current:e.key
      })

      }
      
    }

    setModalVisible(value){
      this.setState({modalVisible:value});

    }

    handleSubmit(e){
      e.preventDefault();
      var fetchOptions = {
        method:'GET'
      };
      var formData = this.props.form.getFieldsValue();
      console.log(formData);
      fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=register"
    + "&username="+formData.userName+"&password="+formData.password
    +"&r_username=" + formData.r_userName + "&r_password="
    + formData.r_password + "&r_confirmPassword="
    + formData.r_confirmPassword, fetchOptions)
      .then((response)=>response.json())
      .then((json)=>{
        console.log(json);
        this.setState({userNickName:json.NickUserName,userid:json.UserId});
        localStorage.userid = json.UserId;
        localStorage.userNickName = json.NickUserName;
      });
      message.success('请求成功！');
      if (this.state.action == 'login'){
        this.setState({hasLogined:true})
      }
      this.setModalVisible(false);
    }

    logout(){
        localStorage.userid = '';
        localStorage.userNickName = '';
        this.setState({hasLogined:false});
    }
    callback(key){
      if ( key == 1){
        this.setState({action:'login'})
      } else {
        this.setState({action:'register'})
      }
    }

    render() {

        let {getFieldDecorator} = this.props.form;

        const userShow = this.state.hasLogined 
                        ?
                        <div className="user">
                            <Link to={`/usercenter`}>
                                <Icon type="user"/>                     
                            </Link>
                            <Button type="ghost" htmlType="button" onClick={this.logout.bind(this)}>退出</Button>
                        </div>
                        :
                        <div className="login">
                            <Icon type="setting" onClick={this.login.bind(this,true)} />
                        </div>
        return (
          <div id="mobileheader">
            <header>
                <a href="/"><img src="./src/images/logo.png" alt="logo" /></a>
                <span>ReactNews</span>
                { userShow }

                <Modal title="用户中心" wrapClassName="vertical-center-modal" visible={this.state.modalVisible} onCancel={()=>this.setModalVisible(false)} onOk={()=>this.setModalVisible(false)} okText="关闭">
                        <Tabs type="card" onChange={ this.callback.bind(this) }>

                           <TabPane tab="登录" key="1">
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                              <FormItem label="账户">
                                {getFieldDecorator('username')(
                                  <Input placeholder="请输入您的账户"/> 
                                )}
                                
                              </FormItem>
                              <FormItem label="密码">
                                {getFieldDecorator('password')(
                                  <Input placeholder="请输入您的密码"/> 
                                )}
                                
                              </FormItem>
                             
                              <Button type="primary" htmlType="submit">登录</Button>
    
                            </Form>
                          </TabPane> 
                          <TabPane tab="注册" key="2">
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                              <FormItem label="账户">
                                {getFieldDecorator('r_userName')(
                                  <Input placeholder="请输入您的账户"/> 
                                )}
                                
                              </FormItem>
                              <FormItem label="密码">
                                {getFieldDecorator('r_password')(
                                  <Input placeholder="请输入您的密码"/> 
                                )}
                                
                              </FormItem>
                              <FormItem label="确认密码">
                                {getFieldDecorator('r_confirmPassword')(
                                  <Input placeholder="请再次输入您的密码"/> 
                                )}
                                
                              </FormItem>
                              <Button type="primary" htmlType="submit">注册</Button>
    
                            </Form>
                          </TabPane>
                        </Tabs>

                      </Modal>
            </header>
          </div>

        )
    }
}

export default MobileHeader = Form.create()( MobileHeader );
