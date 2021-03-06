import React from 'react';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';
import { parseDate, formatDate, sortByDate, checkArrIsEqual } from '../../../utils/translateDate';

const desc = ['肺都气炸了', '一肚子槽要吐', '一般无感', '心情愉悦', '开心的飞起来'];

export default class TopicItemPopover extends React.Component{  
    
    handleClick(id){
        var { history, forShare } = this.props;
        console.log(history);
        if (history){
            if (forShare){
                history.push(`/action/${id}`)
            } else {
                history.push(`/usercenter/${id}`)
            }
        }
    }

    render(){
        var { data } = this.props;
        var { text, forShare, forRate } = this.props; 
        //console.log(data);
        return(
            <div>
                {
                    data.length
                    ?
                    <ul style={{listStyle:'none',margin:'0',padding:'0',fontSize:'12px'}}>
                        {
                            data.map((item,index)=>(
                                
                                <li className='topic-shareBy' key={index} onClick={this.handleClick.bind(this, forShare ? item._id : item.user._id)}>
                                    
                                    <span className='topic-shareBy-avatar'><img src={item.user.userImage?item.user.userImage:''} /></span>
                                    <div>
                                        <div style={{color:'#000',fontWeight:'500'}}>{item.user.username?item.user.username:''}</div>
                                        {
                                            forRate
                                            ?
                                            <span className='topic-shareBy-text'>表示<span style={{color:'#1890ff',marginLeft:'4px'}}>{`${desc[item.score-1]} `}</span></span>
                                            :
                                            <span className='topic-shareBy-text'>{item.value?item.value:''}</span>
                                        }                     
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



