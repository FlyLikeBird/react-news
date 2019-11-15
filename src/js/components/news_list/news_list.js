import React from 'react';

import {  List, Avatar, Button, Icon, Card } from 'antd';
import { Link } from 'react-router-dom';

import DeleteModal from '../deleteModal';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';

import NewsListItem from './news_list_item';

export default class NewsList extends React.Component{
  constructor(){
    super();
    this.state={
      list:[],
      visible:false,
      deleteId:''
    }
  }
 
  componentDidMount(){
      var { data } = this.props;
      this.setState({list:data});
  }

  componentWillReceiveProps(newProps){
    //  搜索页面的新闻列表当页码变化时强制更新
    var { forSearch, data } = this.props;
    if ( forSearch ) {
        this.setState({list:newProps.data});
        return ;
    } 
    if ( data.length != newProps.data.length) {
        this.setState({list:newProps.data})
    }
  }
  
  handleCleanHistory(){
      fetch(`/api/usr/cleanHistory?userid=${localStorage.getItem('userid')}`)
        .then(response=>response.json())
        .then(json=>{
          this.setState({list:[]})
        })
  }

  handleModalVisible(boolean,deleteId){
    this.setState({visible:boolean,deleteId});
  }
  
  handleDelete(){
    var { deleteId, list } = this.state;
    var data = [...list];
    var deleteIndex = 0;
    for(var i=0,len=list.length;i<len;i++){
        if(list[i].articleId === deleteId){
            deleteIndex = i;
            break;
        }
    }
    data.splice(deleteIndex,1);
    this.setState({list:data})
  }

  render(){
    var { hasImg, hastime, hasSearchContent, location, history, text, forSimple, forUser, forSearch } = this.props;
    var { list, visible, deleteId } = this.state;


    return(    
      
      <div style={{textAlign:'left'}}>
          {
              list.length
              ?
              <div>
                {
                    forUser
                    ?
                    <Button size="small" style={{fontSize:'12px'}} onClick={this.handleCleanHistory.bind(this)}>全部删除</Button>
                    :
                    null
                    
                }           
                {
                    
                    list.map((item,index)=>(
                        <NewsListItem 
                            item={item} 
                            key={index}
                            forSimple={forSimple}
                            forSearch={forSearch}
                            history={history}
                            hastime={hastime}
                            hasImg={hasImg}
                            location={location}
                            hasSearchContent={hasSearchContent} 
                            onVisible={this.handleModalVisible.bind(this)}
                        />
                    ))
                    
                }
                {
                    hastime && visible
                    ?
                    <DeleteModal 
                        visible={visible} 
                        onVisible={this.handleModalVisible.bind(this)} 
                        deleteId={deleteId} 
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="news"
                        forNews={true}
                    />
                    :
                    null
                }
              </div>
              :
              <div style={{margin:'20px 0'}}>{text}</div> 
          }
      </div>    
      
      
    )
  }
}


