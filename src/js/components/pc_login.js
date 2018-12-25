import React from 'react';

import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal } from 'antd';

export default class Login extends React.Component {
    
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
      //console.log(this);
      if ( localStorage.userid != ''){
        this.setState({hasLogined:true});
        this.setState({userNickName:localStorage.userNickName,userid:localStorage.userid});
               
      }
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

    callback(key){
      if ( key == 1){
        this.setState({action:'login'})
      } else {
        this.setState({action:'register'})
      }
    }

    logout(){

      localStorage.userid = '';
      localStorage.userNickName = '';
      this.setState({hasLogined:false})
    }

    handleSubmit(e){
      e.preventDefault();
      var fetchOptions = {
        method:'GET'
      };
      var formData = this.props.form.getFieldsValue();
      console.log(formData);
      fetch("http://newsapi.gugujiankong.com/Handler.ashx?action="+this.state.action
    + "&username="+formData.username+"&password="+formData.password
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

    render() {

        let {getFieldDecorator} = this.props.form;
        //console.log(getFieldDecorator);
        const userShow = this.state.hasLogined 
                        ?
                        <Menu.Item key="logout" className="register">
                          <Button type="primary" htmlType="button">{this.state.userNickName}</Button>
                          &nbsp;&nbsp;
                          <Link to={`/usercenter`} target="_blank">
                            <Button type="dashed" htmlType="button">个人中心</Button>
                          </Link>
                          &nbsp;&nbsp;
                          <Button type="ghost" htmlType="button" onClick={this.logout.bind(this)}>退出</Button>
                        </Menu.Item>
                        :
                        <Menu.Item key="register" className="register">
                          <Icon type="appstore"/>注册/登录
                        </Menu.Item>

        return (
            
        )
    }

    
}