import React from 'react';
import { Card, Icon } from 'antd';

import { Link } from 'react-router-dom';

export default class PCNewsImageBlock extends React.Component {
	constructor(){
		super();
		this.state = {
			news:'',
			newsList:''
			
		}
	}
	
	componentWillMount(){

		const imageContainer = {
			
			width:this.props.imageWidth
			
		}	

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
							<div key={index} className="imageblock" style={imageContainer}>
								<Link to={`details/${newsItem.uniquekey}`}>
									<div className="custom-image" >
										<img alt="" src={newsItem.thumbnail_pic_s} />
									</div>
									<div className="custom-card">
										<h3>{newsItem.title}</h3>
										<p>{newsItem.author_name}</p>
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

		const newsList = this.state.newsList;
		
		return(
			<div className="topNewsList">
				<Card title={this.props.cardTitle} style={{width:this.props.width}} extra={<a href="#">换一换<Icon type="home"/></a>}>
					<div className="block-container">
						{ newsList ? newsList :'头条正在加载中....'}
					</div>
				</Card>
			</div>
		)
		
	}
}