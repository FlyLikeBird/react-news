import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon, Tabs, Input, message, Badge, Dropdown } from 'antd';

import style from './mobile-header-style.css';

class MobileHeader extends React.Component {
    
    handleInputFocus(e){
        var { history } = this.props;
        if (history) history.push(`/search`)
    }

    render() {
        var { user, searchHistory, onUpdateSearchHistory, onLoginOut } = this.props;
        var hasLogined = user && user.userid ? true : false;
        var menu =  <Menu>
                      <Menu.Item>
                        <Link to={`/usercenter/${user.userid}`}><Icon type="home" />个人中心</Link>
                      </Menu.Item>
                      <Menu.Item>
                        <span onClick={()=>onLoginOut(true)}><Icon type="logout" />退出登录</span>
                      </Menu.Item>
                    </Menu>
                      
                    
        return (
        
            <header className={style['header']}>
                
                    <div className={style['logo']}>
                        <span className={style['img-container']} style={{backgroundImage:`url(http://image.renshanhang.site/logo.png)`}}></span>
                        ReactNews
                    </div>
                    <Input placeholder="请输入查询关键词" onFocus={this.handleInputFocus.bind(this)}/>
                    {
                        hasLogined
                        ?
                        <div>                                                                                          
                            <Dropdown  overlay={menu}>
                                <div className={style['user-container']}>
                                    <Link className="ant-dropdown-link" to={`/usercenter/${user.userid}`}>
                                        <span className={style['img-container']} style={{backgroundImage:`url(${user.avatar})`}}></span>
                                    </Link>
                                    <Icon type="down" />
                                </div>
                            </Dropdown>                                                                
                        </div>
                        :
                        <div><Icon type="user" />注册/登录</div>
                    }
                    
                      
            </header>
        

        )
    }
}

export default MobileHeader = withRouter(MobileHeader);

