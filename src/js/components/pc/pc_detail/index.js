import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Spin } from 'antd';

import CommonComments from '../../common_comments';
import ArticleAction from './pc_detail_article_action';
//import PCNewsImageBlock from '../pc_news_image_block';

export default class PCNewsDetails extends React.Component {
	constructor(props){
		super()
		this.state={
			newsItem:{},
			isLoad:true
			
		}
	}
	
	_loadArticle(props){

		var uniquekey = props.match.params.uniquekey;
		var userid = localStorage.getItem('userid');

		fetch('/article/getArticleContent?uniquekey='+uniquekey)
			.then(response=>response.json())
			.then(json=>{
					var data = json.data;
					//console.log(data);
					this.setState({newsItem:data,isLoad:false});
					/*			
					var articleTime = document.getElementsByClassName('article-src-time')[0];
					var text = articleTime.innerHTML;
					text += '&nbsp;&nbsp;&nbsp;&nbsp;'+ '浏览量: ' + data.viewcount;
					articleTime.innerHTML = text;
					*/
					document.title = this.state.newsItem.title + " -React News | React驱动的新闻平台";
			});

		if(userid){

			fetch(`/usr/pushHistory?uniquekey=${uniquekey}&userid=${userid}`)

		}		
	}

	componentDidMount(){
		this._loadArticle(this.props);
	}
	
	componentWillReceiveProps(newProps){
		var params = this.props.match.params.uniquekey;
		if ( params != newProps.match.params.uniquekey){
			this.setState({isLoad:true})
			this._loadArticle(newProps);
		}
		
	}

	createMarkup(){
		
		return {__html:this.state.newsItem.content};
	}
	
	render(){
		var { isLoad, newsItem } = this.state;
		var { socket, history, location, match } = this.props;
		var  uniquekey   = this.props.match.params.uniquekey;
		var userid = localStorage.getItem('userid');
		var isLogined = userid ? true : false;

		var  styleObj = {
			padding:'0 4px',
			color:'#1890ff',
			textDecoration : 'underline'
		};
		
		return(
			
				<Row style={{paddingTop:'30px'}}>
					<Col span={2}></Col>
					<Col span={20} style={{textAlign:'center'}}>
						{
							isLoad
							?
							<Spin size="large"/>
							:
							<Row>
								
								<Col span={18} style={{position:'relative',textAlign:'left'}}>
									<div className="articleContainer" dangerouslySetInnerHTML={this.createMarkup()} ></div>
									{
										isLogined
										?
										<div>
											<ArticleAction uniquekey={uniquekey} item={newsItem} history={history}/> 
											<CommonComments {...this.props} item={newsItem}/>
										</div>
										:
										<p>您还未登录！请先完成<span style={styleObj}>注册</span>或<span style={styleObj}>登录</span>查看评论！</p>
									}
						
								</Col>	
								<Col span={6} style={{marginLeft:'10px'}}>
									{/*
										<PCNewsImageBlock count={40} type="top" width="100%" cardTitle="相关新闻" imageWidth="130px" />
										*/
									}
								</Col>
							</Row>
						}
					</Col>
					
					<Col span={2}></Col>
				</Row>
				
		)
	}
}
