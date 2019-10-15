import React from 'react';

import { Link, withRouter } from 'react-router-dom';
import { Row,Col } from 'antd';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Popover, Badge } from 'antd';


//import SearchInput from './pc_search/pc_search_input';

import imgURL from '../../../../images/logo.png';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Search = Input.Search;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


class PCHeader extends React.Component {
    
    constructor(props) {
      super();
      this.state = {
        current:'top',      
        hasLogined:false,
        username:'',
        userid:'',
        avatar:'',
        activeKey:'',
        modalVisible:false,
        LoginContainer:null
      }
    }

    

    handleLoginClick(e){
      this.setState({current:e.key})
    }

    setModalVisible(boolean){
      if ( boolean == true){         
          import('../pc_login_container').then(loginContainer=>{
              this.setState({LoginContainer:loginContainer.default,modalVisible:true});
          })
          
      } else {
          this.setState({LoginContainer:null,modalVisible:false})
      }
    }

    logout(){
        var { socket, history } = this.props;
        if(socket.close){
          socket.emit('user-loginout',localStorage.getItem('username'));
          socket.close();
        }    
        localStorage.removeItem('username');
        localStorage.removeItem('userid');
        localStorage.removeItem('avatar');
        if (history){
          history.push('/');
          this.setState({hasLogined:false});       
        }
    }
 
    handleLogined(userInfo){
      var { username, userid, avatar } = userInfo;
      localStorage.setItem('username',username);
      localStorage.setItem('userid',userid);
      localStorage.setItem('avatar',avatar);
      if (this.props.onsocket){
        this.props.onsocket();
      }
      this.setState({hasLogined:true,modalVisible:false,username,userid,avatar});
      
    }

    componentWillMount(){
      var userid = localStorage.getItem('userid');
      var username = localStorage.getItem('username');
      var avatar = localStorage.getItem('avatar');     
      if ( userid ){
        this.setState({hasLogined:true, userid, username, avatar})
      }  

    }

    handleSearchClick(){
      var input = this.refs.search.input.input;
      var span = input.parentNode;
      // console.log(span);
      span.classList.add('click');
    }
    
    render() {
        var { hasLogined, current, username, userid, avatar, modalVisible, LoginContainer } = this.state;
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
                            <Menu className={ hasLogined ? "login":"logout"} mode="horizontal" selectedKeys={[current]} onClick={this.handleLoginClick.bind(this)}>
                              <Menu.Item key="top"><Link to="/"><Icon type="home" /><span className="text">首页</span></Link></Menu.Item>
                              <Menu.Item key="shehui"><Link to="/shehui"><Icon type="notification" /><span className="text">社会</span></Link></Menu.Item>
                              <Menu.Item key="guonei"><Link to="/guonei"><Icon type="eye" /><span className="text">国内</span></Link></Menu.Item>
                              <Menu.Item key="guoji"><Link to="/guoji"><Icon type="global" /><span className="text">国际</span></Link></Menu.Item>
                              <Menu.Item key="yule"><Link to="/yule"><Icon type="shop" /><span className="text">娱乐</span></Link></Menu.Item>
                              <Menu.Item key="tiyu"><Link to="/tiyu"><Icon type="rocket" /><span className="text">体育</span></Link></Menu.Item>
                              <Menu.Item key="keji"><Link to="/keji"><Icon type="video-camera" /><span className="text">科技</span></Link></Menu.Item>
                            </Menu> 
                            <div className="search">
                              {/*<SearchInput {...this.props}/> */}
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
                                          <span className="img-container"><img src={avatar}/></span>
                                        
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
                     { LoginContainer && <LoginContainer onModalVisible={this.setModalVisible.bind(this)} onLogined={this.handleLogined.bind(this)} modalVisible={modalVisible}/> }
                    
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </header>

        )
    }    
}

export default withRouter(PCHeader) ;




