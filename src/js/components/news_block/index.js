import React from 'react';
import { Link  } from 'react-router-dom';
import { Card, Icon, Spin } from 'antd';

import style from './style.css';

export default class PCNewsBlock extends React.Component {
	
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

		
		}
	}

	componentDidMount(){
		this.loadNewsList();		
	}
	
	
	render() {
		
		var { data, title, forTopic, hasImg, fixPosition, fixWidth } = this.props;
		
		return(
			
			<div className={style["news-list-container"]}>
				{
					hasImg
					?
					<div style={{ width:fixWidth}} className={ fixPosition ? style["fixed"] + " " + style["img-container"] : style["img-container"] }>
						<div className={style["bg"]} style={{backgroundImage:`url(${data[0].thumbnails[0]})`}}></div>
						<span className={style["tags"]}>{data[0].type}</span>
						<span className={style["desc"]}>{data[0].title}</span>
					</div>
					:
					<div className={style["title-container"]}>
						{
							forTopic
							?
							<Icon type="message" theme="filled" className="motion"/>
							:
							<Icon type="fire" theme="filled" className="motion"/>
						}
						<span className={style["title"]}>{ title } </span>
						<span className={style.button}><Link to={ forTopic ? '/topicIndex':'/topNews'} >{ forTopic ? "查看更多话题":"查看更多新闻"}<Icon type="right-circle" /></Link></span>
					</div>
				}
				
				<div>					
						{
							data && data.length
							?
							<ul>
								{
									data.map((item,index)=>(
											<li key={index} className={style["news-item"]}>												
												{
													(()=>{														
														switch (index) {			
															case 0:return <div><span className={style["order-num"]}>1</span><Link to={`/details/${item._id}`}>{ item.title}</Link></div>;break;
															case 1:return <div><span className={style["order-num"]}>2</span><Link to={`/details/${item._id}`}>{ item.title}</Link></div>;break;
															case 2:return <div><span className={style["order-num"]}>3</span><Link to={`/details/${item._id}`}>{ item.title}</Link></div>;break;
															default:return <div><Icon type="link" style={{paddingRight:'4px'}}/><Link to={`/details/${item._id}`}>{ item.title}</Link></div>;break;
														}
													})(index)
												}												
											</li>
									))
								}
							</ul>	
							:
							<span>没有加载到新闻!</span>
						}					
				</div>
			</div>
			


		)
	}
}