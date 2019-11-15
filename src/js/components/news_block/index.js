import React from 'react';
import { Link  } from 'react-router-dom';
import { Card, Icon, Spin } from 'antd';

const { Meta } = Card;

export default class PCNewsBlock extends React.Component {
	constructor(){
		super();
		this.state = {
			newsListWithoutHot:[],
			newsList:[],
			newsImg:'',
			newsTitle:'',
			newsId:'',
			scrollStyle:{}
			
		}
	}

	loadNewsList(){

		if ( this.props.isTopic){

			var arr = [];
			for(var i=0;i<10;i++){
				arr[i] = '国际泳联警告霍顿'
			}

			var textStyle = {
				    whiteSpace: 'nowrap',
    				overflow: 'hidden',
    				textOverflow :'ellipsis',
    				width:'170px',
    				fontSize:'14px'
			}

			arr = arr.map((item,index)=>(
					<li key={index} className="topic-item">
						<span><span className="icon"><Icon type="number" /></span><span style={textStyle}>{item}</span></span>
					</li>
				))
			this.setState({newsList:arr})

		} else {

		fetch('/api/article/getArticleTitle?type='+this.props.type+"&count="+this.props.count)
		.then(response=>response.json())
		.then(json=>{
			
				//console.log(json);
				var data = json.data;
				const newsList = data.length
								?
								data.map((newsItem,index)=>(
									<li key={index} className="news-item">
										
											{
												(()=>{
													
													switch (index) {
		
														case 0:return <div><span className="order-num">1</span><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
														case 1:return <div><span className="order-num">2</span><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
														case 2:return <div><span className="order-num">3</span><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
														default:return <div><Icon type="link" style={{paddingRight:'4px'}}/><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>;break;
													}
												})(index)
											}
										
									</li>
							    ))	
								:
								'没有加载到新闻!';
								
				var newsListWithoutHot = data.map((newsItem,index)=>(
								<li key={index} className="news-item">
									
										
									<div><Icon type="link" style={{paddingRight:'4px'}}/><Link to={`/details/${newsItem.uniquekey}`}>{ newsItem.title}</Link></div>
												
								</li>
							    ))	
				
				this.setState({newsList,newsListWithoutHot});

			})
		}
	}

	componentDidMount(){
		this.loadNewsList();		
	}
	
	componentWillReceiveProps(newProps){
		var { reload } = newProps;
		if (reload){
			var prevNewsList = this.state.newsList;
			var nextIndex = prevNewsList.length - 1;
			var addNewsList = this.state.newsListWithoutHot;
			addNewsList = addNewsList.map(item=>{
				var obj = {};
				return {...item,key:++nextIndex}
			})
			var finalArr = [...prevNewsList,...addNewsList];
			
			setTimeout(()=>{
				this.setState({newsList:finalArr});
				if (this.props.onReload){
				this.props.onReload();
			}
			},500)
			
		}
	}
	
	render() {
		
		const { newsList } = this.state;

		const linkStyle = {
			    backgroundColor: '#1890ff',
    			padding: '4px 10px',
    			color: '#fff',
    			borderRadius: '14px',
    			display: 'inline-block',
    			transform: 'scale(0.7)',

		}

		const titleContent = this.props.title
							?

							this.props.isTopic
							?
							<span>
								<Icon type="message" theme="filled" className="motion"/>
								{this.props.title}
							</span>
							:
							<span>
								<Icon type="fire" theme="filled" className="motion"/>
								{this.props.title}
							</span>
							:
							null;

		const extraContent = this.props.title
							?
							this.props.isTopic
							?							
							<Link style={linkStyle} to={`/topicIndex`}>进入话题中心<Icon type="right-circle" /></Link>							
							:							
							<Link style={linkStyle} to={`/topNews`}>查看更多新闻<Icon type="right-circle" /></Link>
							:
							null;

						
		return(
			
			<Card 
				width={this.props.width}
				className="topNewsList" 
				title={titleContent} 
				bordered={false} 
				extra={extraContent}				
			>
				<Meta
					description={
						<div>
							{	
								this.props.hasImg
								?
								<div className="img-container"  style={this.props.scrollStyle} ref={img=>this.imgContainer = img}>
									<Link to={`/details/${this.state.newsId}`}>
										<img src={this.state.newsImg}/>
										<span className="newsList-title">{this.state.newsTitle}</span>
										<span className="tags">{this.props.newsListTitle}</span>
									</Link>
								</div>
								:
								null
							}
							
							<ul>
								{ newsList? newsList:'新闻正在加载中……' }
							</ul>
								
							
						</div>
					}
				/>
				
			</Card>
			


		)
	}
}