import React from 'react';
import { Card, Icon } from 'antd';

import { Router, Route, Link, hashHistory } from 'react-router';

export default class PCNewsBlock extends React.Component {
	constructor(){
		super();
		this.state = {
			news:'',
			newsList:''
			
		}
	}

	componentWillMount(){
		var fetchOptions = {
			method:'GET'
		};
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type="+this.props.type+"&count="+this.props.count,fetchOptions)
		.then(response=>response.json())
		.then(json=>{
			//console.log(json);
			this.setState({news:json});
		})
		
		.then(()=>{
			const news = this.state.news;
			const newsList = news.length
							?
							news.map((newsItem,index)=>(
							<li key={index}>
								
									{
										(()=>{
											//console.log('---');
											//console.log(newsItem);
											switch (index) {

												case 0:return <div><img src="./src/images/firstIcon.png" style={{paddingRight:'4px'}}/><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
												case 1:return <div><Icon type="link" style={{paddingRight:'4px'}}/><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
												case 2:return <div><Icon type="link" style={{paddingRight:'4px'}}/><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
												default:return <div><Icon type="link" style={{paddingRight:'4px'}}/><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
											}
										})(index)
									}
								
							</li>
						    ))	
							:
							'没有加载到任何新闻!';
			this.setState({newsList:newsList});
		})
		
		
	}

	render() {
		const news = this.state.news;
		const newsList = this.state.newsList;

		
		//const newsList = 'test';
		return(
			<div className="topNewsList">
				<Card bordered={false}>
					<ul>

						{ newsList? newsList:'新闻正在加载中……' }
					</ul>
				</Card>
			</div>


		)
	}
}