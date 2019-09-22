import React from 'react';

import { Link } from 'react-router-dom';
import { Row,Col } from 'antd';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Popover, Badge } from 'antd';
import LoginContainer from './pc_login_container';


import SearchInput from './pc_search/pc_search_input';

import imgURL from '../../images/logo.png';

var fetch = require('../../fetch/fetch.js');

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Search = Input.Search;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


 class PCHeader extends React.Component {
    
    constructor(props) {
      super();
      //console.log(props);
      this.state = {
        current:'top',
        modalVisible:props.modalVisible,
        
        hasLogined:false,
        username:'',
        userid:'',
        activeKey:''
        
      }
    }

    

    handleLoginClick(e){
      this.setState({current:e.key})
    }

    setModalVisible(boolean){
      this.setState({modalVisible:boolean});

    }

    logout(){
      var { socket } = this.props;
      //console.log(this);
      
      if(socket.close){
        socket.emit('user-loginout',localStorage.getItem('username'));
        socket.close();
      }
      
      
      localStorage.removeItem('username');
      localStorage.removeItem('userid');

      if (this.props.history){
        this.props.history.push('/');
        this.setState({hasLogined:false});
        
      }
    }

   
    handleLogined(userInfo){
      
      localStorage.setItem('username',userInfo.username);
      localStorage.setItem('userid',userInfo.userid);
      if (this.props.onsocket){
        this.props.onsocket();
      }

      this.setState({hasLogined:true,modalVisible:false,username:userInfo.username,userid:userInfo.userid});
      
    }
    
    

    componentWillMount(){ 
      
      if (localStorage.getItem('username')){
        //console.log('hello');
        this.setState({hasLogined:true,username:localStorage.getItem('username')})
      }  

      if(localStorage.getItem('userid')){
        this.setState({userid:localStorage.getItem('userid')})
      }
      
    }

    handleSearchClick(){
      var input = this.refs.search.input.input;
      var span = input.parentNode;
      // console.log(span);
      span.classList.add('click');
    }
    
    render() {
        var { hasLogined, current, username, userid } = this.state;
        var  { msg } = this.props;
        //console.log(msg);
        const styleObj = {
          width:'70px',
          display:'inline-block',
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          textAlign:'right'
        } ;
        
        return (
            <header>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>
                      <div className="header">
                          <div>  
                              <a href="/" className="logo">
                                  <img src={ imgURL } alt="logo" />
                                  <span>ReactNews</span>
                              </a> 
                          </div>
                          
                          <div className="menu">
                            <Menu className={ hasLogined ? 'login':'logout'} mode="horizontal" selectedKeys={[current]} onClick={this.handleLoginClick.bind(this)}>
                              <Menu.Item key="top"><Link to="/"><Icon type="home" /><span className="text">首页</span></Link></Menu.Item>
                              <Menu.Item key="shehui"><Link to="/shehui"><Icon type="notification" /><span className="text">社会</span></Link></Menu.Item>
                              <Menu.Item key="guonei"><Link to="/guonei"><Icon type="eye" /><span className="text">国内</span></Link></Menu.Item>
                              <Menu.Item key="guoji"><Link to="/guoji"><Icon type="global" /><span className="text">国际</span></Link></Menu.Item>
                              <Menu.Item key="yule"><Link to="/yule"><Icon type="shop" /><span className="text">娱乐</span></Link></Menu.Item>
                              <Menu.Item key="tiyu"><Link to="/tiyu"><Icon type="rocket" /><span className="text">体育</span></Link></Menu.Item>
                              <Menu.Item key="keji"><Link to="/keji"><Icon type="video-camera" /><span className="text">科技</span></Link></Menu.Item>
                            </Menu> 
                            <div className="search">
                              <SearchInput {...this.props}/>
                              <Popover content={
                                    <div style={{width:'200px',height:'200px',backgroundColor:'#000'}}>
    
                                    </div>
                                }>
                                  <Button type="primary" size="small" shape="circle" icon="mobile" />
                              </Popover>
                            </div>
                            <div className="usercenter">
                                {
                                    hasLogined
                                    ?
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <span style={styleObj}>{username}</span>
                                        
                                          <Link to={`/usercenter/${userid}`}>
                                            <Badge count={msg.total}><Button type="primary" size="small">个人中心</Button></Badge>
                                          </Link>
                                        
                                        <Button size="small" onClick={this.logout.bind(this)}>退出</Button>
                                    </div>
                                    :
                                    <div onClick={this.setModalVisible.bind(this,true)}>
                                        <Icon type="user"/>注册/登录
                                    </div>
                                }
                            </div>                 
                          </div>
                          

                      
                     </div>

                      <LoginContainer onModalVisible={this.setModalVisible.bind(this)} onLogined={this.handleLogined.bind(this)} modalVisible={this.state.modalVisible} />
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </header>

        )
    }

    
}

export default PCHeader ;








