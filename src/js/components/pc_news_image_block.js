import React from 'react';
import { Card, Icon } from 'antd';

import { Router, Route, Link, hashHistory } from 'react-router';

export default class PCNewsImageBlock extends React.Component {
	constructor(){
		super();
		this.state = {
			news:'',
			newsList:''
			
		}
	}

	componentWillMount(){

		const styleImage = {
			display:'block',
			width:this.props.imageWidth,
			height:'90px'
		}

		const styleH3 = {
			width:this.props.imageWidth,
			whiteSpace:'nowrap',
			overflow:'hidden',
			textOverflow:'ellipsis'
		};


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
							<div key={index} className="imageblock">
								<Link to={'details/${newsItem.uniquekey}'} target="_blank">
									<div className="custom-image">
										<img alt=""  style={styleImage} src={newsItem.thumbnail_pic_s} />
									</div>
									<div className="custom-card">
										<h3 style={styleH3}>{newsItem.title}</h3>
										<p style={styleH3}>{newsItem.author_name}</p>
									</div>
								</Link>
							</div> 
						))				
						:
						'没有加载到任何新闻!';
			this.setState({newsList:newsList});
		})
		
		
		
	}

	render() {

		

		//console.log(newsList);

		
		const newsList = this.state.newsList;
		return(
			<div className="topNewsList">
				<Card title={this.props.cardTitle} bordered={true} style={{width:this.props.width}} extra={<a href="#">换一换<Icon type="home"/></a>}>
					
						{ newsList ? newsList :'头条正在加载中....'}
					
				</Card>
			</div>


		)
	}
}