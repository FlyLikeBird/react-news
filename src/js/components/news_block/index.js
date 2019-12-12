import React from 'react';
import { Link  } from 'react-router-dom';
import { Card, Icon, Spin } from 'antd';

import style from './newsBlock.style.css';

export default class PCNewsBlock extends React.Component {
	
	render() {
		
		var { data, title, forTopic, hasTitle, fixPosition, fixWidth } = this.props;
		
		return(
			
			<div className={style["news-list-container"]}>
				{
					hasTitle
					?
					<div className={style["title-container"]}>
						{
							forTopic
							?
							<Icon type="message" theme="filled" style={{color:'#1890ff'}}  className={style.motion}/>
							:
							<Icon type="fire" theme="filled" style={{color:'rgb(226, 85, 85)'}} className={style.motion}/>
						}
						<span className={style["title"]}>{ title } </span>
						<span className={style.button}><Link to={ forTopic ? '/topicIndex':'/topNews'} ><span className={style.text}>{ forTopic ? "查看更多话题":"查看更多新闻"}</span><Icon type="right-circle" /></Link></span>
					</div>
					:
					null
				}
				
				<div>					
						{
							data && data.length
							?
							<ul>
								{
									forTopic
									?
									data.map((item,index)=>(
										<li key={index} className={style["topic-item"]}>
											<div>
												<span className={style["icon"]}><Icon type="number" /></span>
												<span className={style.text}>{item.title}</span>
											</div>
										</li>
									))
									:
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