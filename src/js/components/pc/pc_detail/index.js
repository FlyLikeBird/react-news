import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Spin } from 'antd';

import CommentsListContainer from '../../common_comments/comments_list_container';
import ArticleAction from './pc_detail_article_action';
import SideBar from '../../side_bar';

export default class PCNewsDetails extends React.Component {
	constructor(props){
		super()
		this.state={
			newsItem:{},
			isLoading:true
			
		}
	}
	
	_loadArticle(props){
		var { match, user } = this.props;	
		var uniquekey = match.params.uniquekey;
		fetch('/api/article/getArticleContent?uniquekey='+uniquekey)
			.then(response=>response.json())
			.then(json=>{
					var data = json.data;
					//console.log(data);
					this.setState({newsItem:data,isLoading:false});
					/*			
					var articleTime = document.getElementsByClassName('article-src-time')[0];
					var text = articleTime.innerHTML;
					text += '&nbsp;&nbsp;&nbsp;&nbsp;'+ '浏览量: ' + data.viewcount;
					articleTime.innerHTML = text;
					*/
					document.title = this.state.newsItem.title + " -React News | React驱动的新闻平台";
			});	
		if( user&& user.userid){
			fetch(`/api/usr/pushHistory?uniquekey=${uniquekey}&userid=${user.userid}`)
		}		
	}

	componentDidMount(){
		this._loadArticle(this.props);
	}
	
	componentWillReceiveProps(newProps){
		var params = this.props.match.params.uniquekey;
		if ( params != newProps.match.params.uniquekey){
			this.setState({isLoading:true})
			this._loadArticle(newProps);
		}
		
	}

	createMarkup(){	
		return {__html:this.state.newsItem.content};
	}
	
	render(){
		var { isLoading, newsItem } = this.state;
		var { socket, history, location, match, user, onCheckLogin, onSetScrollTop } = this.props;
		var uniquekey   = this.props.match.params.uniquekey;	
		var  styleObj = {
			padding:'0 4px',
			color:'#1890ff',
			textDecoration : 'underline'
		};
		
		return(
			
				<Row style={{paddingTop:'30px'}}>
					<Col span={2}></Col>
					<Col span={20}>
						{
							isLoading
							?
							<Spin size="large"/>
							:
							<Row>								
								<Col span={18} style={{position:'relative',textAlign:'left', paddingRight:'30px'}}>
									<div className="articleContainer" dangerouslySetInnerHTML={this.createMarkup()} ></div>
									<div>
										<ArticleAction uniquekey={uniquekey} onCheckLogin={onCheckLogin} item={newsItem} history={history}/> 
										<CommentsListContainer commentType="Article" onCheckLogin={onCheckLogin} history={history} onSetScrollTop={onSetScrollTop} socket={socket} location={location} uniquekey={uniquekey} item={newsItem} warnMsg="还没有用户评论呢!快来抢沙发吧～"/>
									</div>
									
								</Col>	
								<Col span={6}>
									<SideBar />									
								</Col>
							</Row>
						}
					</Col>
					
					<Col span={2}></Col>
				</Row>
				
		)
	}
}
