import React from 'react';
import { Spin } from 'antd';
import UserList from '../../user_list/user_list';

export default class MobileFollow extends React.Component{

    constructor(){
        super();
        this.state = {
            isLoading:true,
            commonUsers:[],
            ownUsers:[]
        }
    }

    componentDidMount(){
        var { isSelf, currentUser, text } = this.props;  
        var userid = localStorage.getItem('userid');
        var allPromise = [];
        var promise1 = new Promise((resolve, reject)=>{
            fetch(`/api/usr/usercenter?userid=${userid}`)
                .then(response=>response.json())
                .then(json=>{
                    var userInfo = json.data;
                    var { userFans, userFollows } = userInfo;
                    resolve(text=='follow'?userFollows:userFans);
                }) 
        });
        if (!isSelf){
            var promise2 = new Promise((resolve, reject)=>{
                fetch(`/api/usr/getCommonUsers?userId=${userid}&currentUserId=${currentUser}&follow=${text=='follow'?'follow':''}`)
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;
                        resolve(data);
                    }) 
            });
        }
        allPromise = isSelf ? [promise1] : [promise1, promise2];
        Promise.all(allPromise)
            .then(([ownUsers, commonUsers])=>{
                console.log(ownUsers, commonUsers);
                if(isSelf){
                    this.setState({ownUsers, isLoading:false});
                } else {
                    this.setState({ownUsers, commonUsers, isLoading:false});
                }
            })
                  
    }

    render(){
        var { isSelf, socket, history, text } = this.props;
        var { commonUsers, ownUsers, isLoading } = this.state;

        return(

            <div>
                {
                    isLoading
                    ?
                    <Spin className="spin" size="large"/>
                    :
                    <div style={{textAlign:'left'}}>
                        <div>
                            {                              
                                !isSelf && commonUsers.length
                                ?
                                <div>
                                    <span style={{fontSize:'12px',display:'inline-block',transform:'scale(0.8)'}}>{`共同${text=='follow'?'关注':'粉丝'}`}</span>
                                    <UserList socket={socket} history={history} data={commonUsers} forMobile={true} />
                                </div>
                                :
                                null
                                
                            }
                        </div>
                        <div>
                            { 
                                ownUsers.length
                                ?
                                <span style={{fontSize:'12px',display:'inline-block',transform:'scale(0.8)'}}>{`全部${text=='follow'?'关注':'粉丝'}`}</span>
                                :
                                null
                            }
                            <UserList socket={socket} history={history} data={ownUsers} forMobile={true} text={ text=='follow' ? '还没有任何关注!' : '还没有任何追随者!'} />
                        </div>
                    </div>
                }               
            </div>
        )
    }
}


