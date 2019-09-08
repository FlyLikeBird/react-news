import React from 'react';
import { Card, Icon } from 'antd';



import { Link } from 'react-router-dom';

var counter = 1;

export default class PCNewsImageBlock extends React.Component {
	constructor(){
		super();
		this.state = {
			//news:'',
			newsList:''
			
		}
	}
	
	componentWillMount(){

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

			this.setState({newsList:newsList});
			
			/*
			for(var i=0,len=json.length;i<len;i++){
					fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey="+json[i].uniquekey)
						.then(response=>response.json())
						.then(json=>{

							fetch('/article/addArticle',{
								method:'post',
								headers:{
									'Accept':'application/json',
									'Content-Type':'application/json'
								},
								body:JSON.stringify(json)
							})
						})

			}
			*/
			
		})
		
	}
	
	handleChangeNews(e){
		//e.preventDefault();
		e.preventDefault();
		++counter;
		
		var { count } = this.props;
		
		const imageContainer = {
			
			width:this.props.imageWidth,
			height:'150px'
			
		}

		var changeCount = counter*count;
		//console.log(changeCount);
		var fetchOptions = {
			method:'GET'
		};
		//var changeCount = 40;
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type="+this.props.type+"&count="+changeCount,fetchOptions)
		.then(response=>response.json())
		.then(json=>{
			//console.log(json)
			
			var newArr = json.slice(-count);
			const newsList = newArr.length
						?
						newArr.map((newsItem,index)=>(
							<div key={index} className="imageblock" style={imageContainer}>
								<Link to={`details/${newsItem.uniquekey}`} style={{display:'inline-block'}}>
									<div className="custom-image" style={{height:'100px',overflow:'hidden'}}>
										<img alt="" src={newsItem.thumbnail_pic_s} />
									</div>
									<div className="custom-card" style={{height:'50px'}}>
										<h3>{newsItem.title}</h3>
										<p>{newsItem.author_name}</p>
									</div>
								</Link>
							</div> 
						))				
						:
						'已无更多新闻！';

			this.setState({newsList:newsList});
			
			//this.setState({newsList})
		})
	}
	
	render() {

		const newsList = this.state.newsList;
		
		return(
			<div className="imgNewsList">
				<Card title={this.props.withoutTitle?null:<span><Icon type={this.props.iconType} /> {this.props.cardTitle}</span>} style={{width:this.props.width}} extra={this.props.withoutTitle?null:<span style={{cursor:'pointer'}}onClick={this.handleChangeNews.bind(this)}>换一换<Icon type="reload"/></span>}>
					<div className="block-container">
						{ newsList ? newsList :'头条正在加载中....'}
					</div>
				</Card>
			</div>
		)
		
	}
}