import React from 'react';
import UserList from '../../user_list/user_list';

export default class FollowContainer extends React.Component{

    constructor(){
        super();
        this.state = {
            commonUsers:[]
        }
    }

    componentDidMount(){

        var { isSelf, match, text } = this.props;
        if ( !isSelf && match){
            var currentUserId = match.params.id;
            var localUserId = localStorage.getItem('userid');
            fetch(`/api/usr/getCommonUsers?userId=${localUserId}&currentUserId=${currentUserId}&follow=${text=='follow'?'follow':''}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    this.setState({commonUsers:data})
                })
        }
        
    }

    render(){
        var { isSelf, data, socket, history, text } = this.props;
        var { commonUsers } = this.state;
        return(

            <div>
                {
                    isSelf
                    ?
                    null
                    :
                    <div>
                        {
                            commonUsers.length
                            ?
                            <div>
                                <span style={{fontSize:'12px',display:'inline-block',transform:'scale(0.8)'}}>{`共同${text=='follow'?'关注':'粉丝'}`}</span>
                                <UserList socket={socket} history={history} data={commonUsers} expand={true} />
                            </div>
                            :
                            null
                        }

                    </div>
                }
                <div>
                    { 
                        data.length
                        ?
                        <span style={{fontSize:'12px',display:'inline-block',transform:'scale(0.8)'}}>{`全部${text=='follow'?'关注':'粉丝'}`}</span>
                        :
                        null
                    }
                    <UserList socket={socket} history={history} data={data} expand={true} text={ text=='follow' ? '还没有任何关注!' : '还没有任何追随者!'} />
                </div>
            </div>
                     

        )
    }
}


