import React from 'react';
import { Card, Icon, Spin, Button } from 'antd';

import { Link } from 'react-router-dom';

import style from './style.css';

export default class PCNewsImageBlock extends React.Component {
	constructor(){
		super();
		this.state = {
			isLoad:true,
			newsList:[]			
		}
	}
	
	componentDidMount(){

		var { columns, type, count } = this.props;
		var width = (100/columns)+'%';
		fetch('/api/article/getArticleTitle?type='+type+"&count="+count)
		.then(response=>response.json())
		.then(json=>{
			var data = json.data;
			const newsList = data.length
						?
						data.map((newsItem,index)=>(
							<div key={index} className={style.imageblock} style={{width}}>
								<Link to={`/details/${newsItem._id}`}>
									<div className={style['custom-image']} style={{backgroundImage:`url(${newsItem.thumbnails[0]})`}}>
									</div>
									<div className={style['custom-card']}>
										<h3>{newsItem.title}</h3>
										<span>{newsItem.auth}</span>
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
		var { iconType, cardTitle, size } = this.props;
		return(
			<div className={size=='small'?style.imgNewsList+' '+style.small:style.imgNewsList}>
				{
					isLoad
					?
					<Spin />
					:
					<div>
						<div className={style['news-title']}>
							<span className={style.text}><Icon type={iconType}/>{cardTitle}</span>
							<Button className={style.button} type="primary" size="small" onClick={this.handleChangeNews.bind(this)}><span><Icon type="reload"/>换一换</span></Button>
						</div>
						<div className={style['block-container']}>
							{ newsList ? newsList :'头条正在加载中....'}
						</div>
					</div>
				}
				
			</div>
		)
		
	}
}