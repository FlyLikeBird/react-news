import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Icon, Dropdown, Tabs, message, Form, Input, Button, CheckBox, Modal, Popover, Badge } from 'antd';

import SearchInput from '../pc_search/pc_search_input';
import imgURL from '../../../../images/logo.png';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Search = Input.Search;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


class PCHeader extends React.Component {
    constructor(){
        super();
        this.state = {
            current:'top'
        }
    }

    handleLoginClick(e){
      this.setState({current:e.key})
    }
 

    render() {
        var { current } = this.state;
        var  { msg, user, onLoginVisible, onLoginOut } = this.props;
        var hasLogined = user && user.userid ? true : false;    
        var menu =  hasLogined ?                   
                      <Menu>
                        <Menu.Item>
                          <Link to={`/usercenter/${user.userid}`}><Icon type="home" />个人中心</Link>
                        </Menu.Item>
                        <Menu.Item>
                          <span onClick={()=>onLoginOut()}><Icon type="logout" />退出登录</span>
                        </Menu.Item>
                      </Menu>
                      :
                      null
                      
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
                              <Menu.Item key="shehui"><Link to="/tag/shehui"><Icon type="notification" /><span className="text">社会</span></Link></Menu.Item>
                              <Menu.Item key="guonei"><Link to="/tag/guonei"><Icon type="eye" /><span className="text">国内</span></Link></Menu.Item>
                              <Menu.Item key="guoji"><Link to="/tag/guoji"><Icon type="global" /><span className="text">国际</span></Link></Menu.Item>
                              <Menu.Item key="yule"><Link to="/tag/yule"><Icon type="shop" /><span className="text">娱乐</span></Link></Menu.Item>
                              <Menu.Item key="tiyu"><Link to="/tag/tiyu"><Icon type="rocket" /><span className="text">体育</span></Link></Menu.Item>
                              <Menu.Item key="keji"><Link to="/tag/keji"><Icon type="video-camera" /><span className="text">科技</span></Link></Menu.Item>
                              <Menu.Item key="junshi"><Link to="/tag/junshi"><Icon type="video-camera" /><span className="text">军事</span></Link></Menu.Item>
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
                                    <Dropdown  overlay={menu}>
                                        <div className="user-login">
                                            <Link className="ant-dropdown-link" to={`/usercenter/${user.userid}`}>
                                                <Badge count={msg.total}><span className="img-container"><img src={user.avatar} /></span></Badge>
                                            </Link>
                                            <Icon type="down" />
                                        </div>
                                    </Dropdown>                                   
                                    :
                                    <div onClick={()=>onLoginVisible(true)}>
                                        <Icon type="user"/>注册/登录
                                    </div>
                                }
                            </div>                 
                          </div>     
                     </div>                 
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </header>

        )
    }    
}

export default PCHeader = withRouter(PCHeader);





