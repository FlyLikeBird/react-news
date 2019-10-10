import React from 'react';
import { Card, Icon, Spin } from 'antd';



import { Link } from 'react-router-dom';

var counter = 1;

export default class PCNewsImageBlock extends React.Component {
	constructor(){
		super();
		this.state = {
			isLoad:true,
			newsList:[]			
		}
	}
	
	componentDidMount(){

		const imageContainer = {
			
			width:this.props.imageWidth
			
		}	

		fetch('/article/getArticleList?type='+this.props.type+"&count="+this.props.count)
		.then(response=>response.json())
		.then(json=>{
			var data = json.data;
			const newsList = data.length
						?
						data.map((newsItem,index)=>(
							<div key={index} className="imageblock" style={imageContainer}>
								<Link to={`details/${newsItem.uniquekey}`}>
									<div className="custom-image" >
										<img alt="" src={newsItem.thumbnail[0]} />
									</div>
									<div className="custom-card">
										<h3>{newsItem.title}</h3>
										<p>{newsItem.auth}</p>
									</div>
								</Link>
							</div> 
						))				
						:
						'没有加载到任何新闻!';

			this.setState({newsList:newsList,isLoad:false});
			
		})
		
	}
	
	handleChangeNews(){
		var { newsList } = this.state;
		var count = newsList.length;
		var newArr = [];
		for(var i=0;i<count;i++){
			var randomIndex = Math.floor(Math.random()*(newsList.length))
			newArr[i] = newsList[randomIndex];
			newsList.splice(randomIndex,1);
		}		
		this.setState({newsList:newArr})	
	}
	
	render() {
		var { newsList, isLoad } = this.state;
		var { iconType, cardTitle, width } = this.props;
		return(
			<div className="imgNewsList">
				{
					isLoad
					?
					<Spin />
					:
					<div>
						<div className="news-title">
							<span className="text"><Icon type={iconType}/>{cardTitle}</span>
							<span className="button" onClick={this.handleChangeNews.bind(this)}>换一换<Icon type="reload"/></span>
						</div>
						<div className="block-container">
							{ newsList ? newsList :'头条正在加载中....'}
						</div>
					</div>
				}
				
			</div>
		)
		
	}
}