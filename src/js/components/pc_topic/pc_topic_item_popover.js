import React from 'react';

export default class TopicItemPopover extends React.Component{
    
    render(){
       var { data, text, hasText } = this.props;
        
        return(

            <div>
                {
                    data.length
                    ?
                    <ul style={{listStyle:'none',margin:'0',padding:'0'}}>
                        {
                            data.map((item,index)=>(
                                <li className="topic-shareBy" key={index}>
                                    <span className="topic-shareBy-avatar"><img src={item.avatar} /></span>
                                    <div>
                                        <div style={{color:'#000',fontWeight:'500'}}>{item.username}</div>
                                        {
                                            hasText
                                            ?
                                            <p className="topic-shareBy-text">{item.content}</p>
                                            :
                                            null
                                        }
                                        <span style={{transform:'scale(0.8)',transformOrigin:'left',position:'absolute',top:'10px',right:'-20px'}}>转发于{formatDate(parseDate(item.date))}</span>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    :
                    <p>{text}</p>
                }
            </div>
                       
        )
    }
}


