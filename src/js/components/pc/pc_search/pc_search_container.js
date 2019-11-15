import React from 'react';

import { Row, Col, Input, Select, DatePicker, Pagination, Spin, Tabs } from 'antd';

import NewsList from '../../news_list/news_list';
import UserList from '../../user_list/user_list';
import SearchComponent from './search_component';

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const { RangePicker } = DatePicker;

export default class PCSearchContainer extends React.Component{
  constructor(){
    super();
    this.state={
      newsList:[],
      topicList:[],
      userList:[],
      value:'time',
      count:0,
      order:'time',
      type:'news',
      startDate:'',
      endDate:'',
      isLoading:true,
      userLoaded:false
    }
  }


  handleDateChange(date,datestring){
    this.setState({startDate:datestring[0],endDate:datestring[1]});
    this._loadSearchList(1,this.state.order,null,datestring[0],datestring[1]);
  }

  componentDidMount(){
    this._loadSearchList();
  }

  
  _loadSearchList(pageNum=1,state,params,start,end){
    
    var search = params ? params:this.props.location.search;
    var type = 'news',order = 'time';
    if (state){
        type = state.type;
        order = state.order;
    }
    fetch(`/api/article/search${search}&type=${type}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
      .then(response=>response.json())
      .then(json=>{        
          var data = json.data;
          if (type=='news') {
              var { data, total } = data;
              this.setState({newsList:data,count:total,isLoading:false});
          } else if (type == 'topic'){
              this.setState({topicList:data,count:total,isLoading:false});
          } else if (type == 'user') {
              this.setState({userList:data,count:data.length,isLoading:false,userLoaded:true});
          }          
      })   
  }


  handlePageChange(pageNum){
    this._loadSearchList(pageNum,this.state,null,this.state.startDate,this.state.endDate);
  }

  componentWillReceiveProps(newProps){
    if (this.props.location.search != newProps.location.search){
        this.setState({isLoading:true});
        this._loadSearchList(1,null,newProps.location.search);
    }   
  }

  handleSelectChange(value){   
    this.setState({order:value});
    this.setState((state)=>{
      //console.log(state.order);
      this._loadSearchList(1,state,null,state.startDate,state.endDate);
      
    })
  }

  handleSearchType(type){
      this.setState({type});
      this.setState(state=>{
          this._loadSearchList(1,state,null)
      })
      
  }
  
  render(){
    var { type, newsList, topicList, userList, count, value, isLoading, userLoaded } = this.state;
    var { location, socket } = this.props;
    const dropdownStyle = {
      width:'160px',
      fontSize:'12px'
    };
    return(
        <div className="search-content">
            <SearchComponent {...this.props}/>
            {
                isLoading
                ?
                <Spin/>
                :
                <div>
                    <div className="search-option">
                        <span>{`共为您搜索结果 ${count?count:0} 个`}</span>             
                        <Select onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" defaultValue={value}  dropdownMatchSelectWidth={false}>
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
                    <Tabs onChange={this.handleSearchType.bind(this)}>
                        <TabPane tab="新闻" key="news">
                            <NewsList data={newsList} location={location} forSearch={true} noFetch={true} hasSearchContent={true} text="没有找到合适的搜索结果!"/> 
                            { newsList.length ? <Pagination style={{paddingTop:'20px'}} hideOnSinglePage={true} showQuickJumper defaultPageSize={20} total={count} onChange={this.handlePageChange.bind(this)}/> : null }
                        </TabPane>
                        <TabPane tab="话题" key="topic">
                            <div>topic</div>
                        </TabPane>
                        <TabPane tab="用户" key="user">
                            { userLoaded ? <UserList data={userList} socket={socket} history={history} text="没有找到相关的用户!"/> : null}
                            
                        </TabPane>
                    </Tabs>
                </div>
            } 
            
       </div>      
    )
  }
}

