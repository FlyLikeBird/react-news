import React from 'react';

import { Row, Col, Input, Select, DatePicker, Pagination, Spin, Tabs } from 'antd';

import NewsList from '../pc_usercenter/pc_newslist';
import UserList from './pc_user_list';
import SearchComponent from './search_component';

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const { RangePicker } = DatePicker;

export default class PCSearchContainer extends React.Component{
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
      isLoading:true
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
    var { type } = this.state;
    fetch(`/api/article/search${search}&type=${type}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
      .then(response=>response.json())
      .then(json=>{        
          var data = json.data;         
          this.setState({list:data.data,count:data.total,isLoading:false});
        
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

  handleSearchType(activekey){
    console.log(activekey);
  }
  
  render(){
    var { type, list, isLoading } = this.state;
    var { location } = this.props;
    const dropdownStyle = {
      width:'160px',
      fontSize:'12px'
    };

    const searchContent = 
            isLoading 
            ?
            <Spin />
            :
            <div>            
             <Tabs onChange={this.handleSearchType.bind(this)}>
                <TabPane tab="新闻" key="1">
                    <NewsList data={list} location={location} noFetch={true} hasSearchContent={true} text="没有找到合适的搜索结果!"/> 
                </TabPane>
                <TabPane tab="话题" key="2">
                    <div>topic</div>
                </TabPane>
                <TabPane tab="用户" key="3">
                    <div>user</div> 
                </TabPane>
              </Tabs>
             
              { list.length ? <Pagination style={{paddingTop:'20px'}} hideOnSinglePage={true} showQuickJumper defaultPageSize={20} total={this.state.count} onChange={this.handlePageChange.bind(this)}/> : null }

           </div> 
           
          
    return(
      
      <div className="search-content">
        <SearchComponent {...this.props}/>
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
        { searchContent }      
      </div>
        
    )
  }
}


