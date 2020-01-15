import React from 'react';
import { Icon, Badge, Spin } from 'antd';
import MobileUserContainer from './mobile_usercenter_container';
import style from './mobile_usercenter_style.css';

export default class MobileUsercenter extends React.Component {
    constructor(){
        super();
        this.state = {
            user:{},
            isLoading:true,
            isSelf:false,
        }
        
    }

    _loadUserInfo(props){
        var { match, history, socket } = props;
        var userid = match.params.id;
        var isSelf = localStorage.getItem('userid') == userid ? true :false;
        fetch(`/api/usr/usercenter?userid=${userid}&isSelf=${isSelf?'true':''}`)
            .then(response=>response.json())
            .then(json=>{
                var user = json.data;
                this.setState({user, isSelf, isLoading:false});     
        })
    }
    
    componentWillReceiveProps(newProps){
        this.setState({isLoading:true});
        if(this.props.match.params.id != newProps.match.params.id){
            this._loadUserInfo(newProps);
        }
    }

    componentDidMount(){
        this._loadUserInfo(this.props);
    }

    render(){
        var { user, isLoading, isSelf } = this.state;
        var { history, match, socket } = this.props;
        return (
                   
                <div className={style['container']}>                                       
                    {
                        isLoading
                        ?
                        <Spin size="large" className={style['spin']}/>
                        :
                        <MobileUserContainer user={user} isSelf={isSelf} history={history} socket={socket} match={match}/>
                    }
                </div>
            
        )
    }
}





