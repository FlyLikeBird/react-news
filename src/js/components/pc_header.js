import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Row,Col } from 'antd';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal } from 'antd';

//import Login from './pc_login';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


class PCHeader extends React.Component {
    
    constructor() {
      super();
      this.state = {
        current:'top',
        modalVisible:false,
        action:'login',
        hasLogined:false,
        userNickName:'',
        userid:0,
        activeKey:''
        
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
        this.setState({action:'login'});
        this.setState({activeKey:key});
      } else {
        this.setState({action:'register'});
        this.setState({activeKey:key});
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
        //console.log(json);
        this.setState({userNickName:json.NickUserName,userid:json.UserId});
        localStorage.userid = json.UserId;
        localStorage.userNickName = json.NickUserName;

      });
      message.success('请求成功！');
      if (this.state.action == 'login'){
        this.setState({hasLogined:true})
      }
      if ( this.state.activeKey == '1' ) {
        this.setModalVisible(false);
      }
      
    }

    render() {
        console.log(this.state.activeKey);
        let {getFieldDecorator} = this.props.form;
        //console.log(getFieldDecorator);
        const styleObj = {
          width:'80px',
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis'
        }

        const userShow = this.state.hasLogined 
                        ?
                        <Menu.Item key="logout" className="register">
                          <Button style={styleObj} type="primary" htmlType="button">{this.state.userNickName}</Button>
                          &nbsp;&nbsp;
                          <Link to={`/usercenter`} target="_blank">
                            <Button type="dashed" htmlType="button">个人中心</Button>
                          </Link>
                          &nbsp;&nbsp;
                          <Button type="ghost" htmlType="button" onClick={this.logout.bind(this)}>退出</Button>
                        </Menu.Item>
                        :
                        <Menu.Item key="register" className="register">
                          <Icon type="user"/>注册/登录
                        </Menu.Item>

        return (
            <header>
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}>
                        <a href="/" className="logo">
                          <img src="./src/images/logo.png" alt="logo" />
                          <span>ReactNews</span>
                        </a>    
                    </Col>
                    <Col span={16}>
                      <div className="menu">
                        <Menu className={ this.state.hasLogined ? 'login':'logout'} mode="horizontal" selectedKeys={[this.state.current]} onClick={this.handleClick.bind(this)}>
                          <Menu.Item key="top"><Icon type="eye" />头条</Menu.Item>
                          <Menu.Item key="shehui"><Icon type="notification" />社会</Menu.Item>
                          <Menu.Item key="guonei"><Icon type="home" />国内</Menu.Item>
                          <Menu.Item key="guoji"><Icon type="global" />国际</Menu.Item>
                          <Menu.Item key="yule"><Icon type="shop" />娱乐</Menu.Item>
                          <Menu.Item key="tiyu"><Icon type="rocket" />体育</Menu.Item>
                          <Menu.Item key="keji"><Icon type="mobile" />科技</Menu.Item>
                          <Menu.Item key="shishang"><Icon type="tags" />时尚</Menu.Item>
                          
                          {userShow}                      
                        </Menu>
                      </div>

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
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </header>

        )
    }

    
}

//console.log(this);
//export var hasLogined = this;
export default PCHeader = Form.create()(PCHeader);
