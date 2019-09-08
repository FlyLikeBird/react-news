import React from 'react';

import { Row, Col, Input, Select, DatePicker, Pagination, Spin } from 'antd';

import NewsList from '../pc_usercenter/pc_newslist';
import UserList from './pc_user_list';
import SearchComponent from './search_component';

const { Option, OptGroup } = Select;
const Search = Input.Search;
const { RangePicker } = DatePicker;

export default class PCSearchContent extends React.Component{
  constructor(){
    super();
    this.state={
      list:[],
      userList:[],
      value:'time',
      count:0,
      order:'time',
      type:'news',
      startDate:'',
      endDate:'',
      load:true,
      isLogined:false,
    }
  }


  handleDateChange(date,datestring){
    this.setState({startDate:datestring[0],endDate:datestring[1]});
    this._loadSearchList(1,this.state.order,null,datestring[0],datestring[1]);
  }

  componentDidMount(){

    this._loadSearchList();
   

  }

  
  _loadSearchList(pageNum=1,order="time",params,start,end){
    var search = params ? params:this.props.location.search;
    //console.log(search);
    //console.log(this);
    var type = search.match(/&type=(\w*)/)[1];
    //console.log('old',type,search);
    //console.log(type);
    fetch(`/article/search${search}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
      .then(response=>response.json())
      .then(data=>{
        
        var responseData = data.data;
         
          
        if (type === 'news'){
          
          var list = responseData.data;
          var total = responseData.total;
         
          this.setState({list,count:total,type,load:false});
        } else {
          //console.log(userList);
          var userList = responseData;
          this.setState({type:type,userList,load:false})
        }
        
      })
      
    
  }



  handlePageChange(pageNum){
    //console.log(this.state.order);

    this._loadSearchList(pageNum,this.state.order,null,this.state.startDate,this.state.endDate);
  }

  componentWillReceiveProps(newProps){
    
    this._loadSearchList(1,this.state.order,newProps.location.search);
      
  }

  handleSelectChange(value){
    
    this.setState({order:value});

    this.setState((state)=>{
      //console.log(state.order);
      this._loadSearchList(1,state.order,null,state.startDate,state.endDate);
      
    })
  }

  
  render(){
    var { location } = this.props;
    const dropdownStyle = {
      width:'160px',
      fontSize:'12px'
    };

    const searchContent = 
          this.state.type === 'news'
          ?
           <div>
             <div className="search-option">
               <span>{`共为您搜索结果 ${this.state.count} 个`}</span>
               
               <Select onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" defaultValue={this.state.value}  dropdownMatchSelectWidth={false}>
                 <OptGroup label="按时间">
                   <Option value="time">从远到近</Option>
                   <Option value="timeInvert">从近到远</Option>
                 </OptGroup>
                 <OptGroup label="按热度">
                   <Option value="hot">从高到低</Option>
                   <Option value="hotInvert">从低到高</Option>
                 </OptGroup>
               </Select>
    
               <RangePicker size="small" onChange={this.handleDateChange.bind(this)} />
             </div>
             
             <NewsList data={this.state.list} location={location} isHistoryList={false} text="没有找到合适的搜索结果!"/> 
             {this.state.list.length ? <Pagination style={{paddingTop:'20px'}} hideOnSinglePage={true} showQuickJumper defaultPageSize={20} total={this.state.count} onChange={this.handlePageChange.bind(this)}/> : null }

           </div> 
           :
           <UserList {...this.props} data={this.state.userList} text="没有找到匹配的用户"/>
          
    return(
      
      <div className="search-content">
        <SearchComponent isSearchPage {...this.props}/>
        {
          this.state.load 
          ?
          <Spin size="large"/>
          :
          searchContent
        }
        
          
          
      </div>
        
    )
  }
}


