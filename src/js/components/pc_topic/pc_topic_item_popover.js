import React from 'react';
import { Link } from 'react-router-dom';
import { parseDate, formatDate, sortByDate } from '../../../utils/translateDate';

export default class TopicItemPopover extends React.Component{  
    constructor(){
        super();
        this.state = {
            data:[]
        }
    }

    _loadUsersAvatar(props){
        var { data, forShare } = props;
        var params;
        if ( forShare ){
            params = data.map(item=>{
                return `actionId[]=${item}`;
            })
        } else {
             params = data.map(item=>item.userid).map(item=>{
                return `userid[]=${item}`;
            })
        }
        params = params.join('&');
        fetch(`/action/getUsersInfo?${params}`)
            .then(response=>response.json())
            .then(json=>{
                var responseData = json.data;
                if (forShare){
                    this.setState({data:responseData});
                } else {
                    data = data.map(item=>{
                        for(var i=0,len=responseData.length;i<len;i++){
                            if (item.userid == responseData[i].userid){
                                item.username = responseData[i].username;
                                item.avatar = responseData[i].avatar;
                                return item;
                            }
                        }
                    })
                    this.setState({data:sortByDate(data)})
                }
                
            })      
        
    }

    componentDidMount(){
        this._loadUsersAvatar(this.props);
    }

    componentWillReceiveProps(newProps){
        if (this.props.data.length != newProps.data.length){
            this._loadUsersAvatar(newProps);
        }
    }

    handleClick(id){
        var { history } = this.props;
        history.push(`/usercenter/${id}`);
    }

    render(){
        var { data } = this.state;
        var { text, hasText } = this.props; 

        return(
            <div>
                {
                    data.length
                    ?
                    <ul style={{listStyle:'none',margin:'0',padding:'0'}}>
                        {
                            data.map((item,index)=>(
                                
                                <li className="topic-shareBy" key={index} onClick={this.handleClick.bind(this,item.userid)}>
                                    
                                    <span className="topic-shareBy-avatar"><img src={item.avatar} /></span>
                                    <div>
                                        <div style={{color:'#000',fontWeight:'500'}}>{item.username}</div>
                                        <span className="topic-shareBy-text">{item.value?item.value:''}</span>
                                        <span style={{transform:'scale(0.8)',transformOrigin:'left',position:'absolute',top:'10px',right:'-20px'}}>{`${text}于${formatDate(parseDate(item.date))}`}</span>
                                    </div>
                                    
                                </li>
                            
                            ))
                        }
                    </ul>
                    :
                    <p>{`暂时没有人${text}`}</p>
                }
            </div>
                       
        )
    }
}



