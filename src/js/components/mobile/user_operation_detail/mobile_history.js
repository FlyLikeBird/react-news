import React from 'react';
import {  List, Avatar, Button, Icon, Card } from 'antd';
import HistoryItem from '../../news_list/history_item';
import { sortByDate } from '../../../../utils/translateDate';

export default class MobileHistory extends React.Component{
  constructor(){
    super();
    this.state={
      list:[]
    }
  }
 
  componentDidMount(){
      var { user } = this.props;
      fetch(`/api/usr/usercenter?userid=${user}`)
        .then(response=>response.json())
        .then(json=>{
            var userInfo =json.data;
            var { userHistorys } = userInfo;
            var data = sortByDate(userHistorys, 'viewtime');
            this.setState({list:data});
        })
  }

  handleCleanHistory(){
      fetch(`/api/usr/cleanHistory?userid=${localStorage.getItem('userid')}`)
        .then(response=>response.json())
        .then(json=>{
          this.setState({list:[]})
        })
  }

  handleDelete(historyId){
    var { list } = this.state;
    var data = [...list];
    var deleteIndex = 0;
    for(var i=0,len=list.length;i<len;i++){
        if(list[i]._id === historyId){
            deleteIndex = i;
            break;
        }
    }
    data.splice(deleteIndex,1);
    this.setState({list:data})
  }

  render(){
    var { hasImg, hastime, location, history, text } = this.props;
    var { list } = this.state;

    return(    
      
      <div style={{textAlign:'left'}}>
          {
              list.length
              ?
              <div>
                  <Button type="primary" style={{fontSize:'12px',marginBottom:'20px'}} onClick={this.handleCleanHistory.bind(this)}>全部删除</Button>               
                  <div style={{ borderRadius:'4px',padding:'10px 20px',backgroundColor:'#f7f7f7'}}>          
                      {
                          
                          list.map((item,index)=>(
                              <HistoryItem 
                                  data={item} 
                                  key={index}
                                  
                                  history={history}
                                  hastime={hastime}
                                  hasImg={hasImg}
                                  location={location}
                              
                                  onDelete={this.handleDelete.bind(this)}
                              />
                          ))
                          
                      }
                  </div>
                
              </div>
              :
              <div style={{margin:'20px 0'}}>{text}</div> 
          }
      </div>    
      
      
    )
  }
}


