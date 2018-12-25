import React from 'react';
import { Row, Col, BackTop } from 'antd';

import PCHeader from './pc_header';
import PCFooter from './pc_footer';
import CommonComments from './common_comments';
import PCNewsImageBlock from './pc_news_image_block';

export default class PCNewsDetails extends React.Component {
	constructor(){
		super()
		this.state={
			newsItem:''
		}
	}

	componentDidMount(){
		var fetchOption = {
			method:'GET'
		}
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey="+this.props.params.uniquekey,fetchOption)
		.then(response=>response.json())
		.then(json=>{
			this.setState({newsItem:json});
			document.title = this.state.newsItem.title + " -React News | React驱动的新闻平台";
		})
	}

	createMarkup(){
		//return {__html:'<a>ceshi</a>'}
		return {__html:this.state.newsItem.pagecontent};
	}

	render(){

		return(
			<div>
				<PCHeader/>
				<Row style={{paddingTop:'20px'}}>
					<Col span={2}></Col>
					<Col span={14}>
						<div className="articleContainer" dangerouslySetInnerHTML={this.createMarkup()} ></div>
						
					</Col>
					<Col span={6} style={{marginLeft:'10px'}}>
						<PCNewsImageBlock count={40} type="top" width="100%" cardTitle="相关新闻" imageWidth="130px" />
					</Col>
					<Col span={2}></Col>
				</Row>
				<BackTop/>
				<PCFooter/>
			</div>


		)
	}
}