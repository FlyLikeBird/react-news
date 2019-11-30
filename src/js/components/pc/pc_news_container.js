import React from 'react';
import { Row, Col, Tabs, Icon, Card, Spin } from 'antd';

import PCNewsBlock from '../news_block';
import PCNewsImageBlock from '../news_image_block';
import PCProduct from './pc_product';
import AutoCarousel from '../autoCarousel';

const TabPane = Tabs.TabPane;

export default class PCNewsContainer extends React.Component {
	constructor(){
		super();
		this.state = {
			newsList:[],
			topList:[],
			isLoading:true
		}
	}

	componentDidMount(){
		fetch(`/api/article/getArticleTitle?type=yule&count=10`)
			.then(response=>response.json())
			.then(json=>{
				var { data } = json;
				this.setState({newsList:data, isLoading:false})
			})

	}

	render() {
		var { history } = this.props;
		var { newsList, topList, isLoading } = this.state;
		return(

			<section style={{paddingTop:'30px'}}>
				<Row>
					<Col span={2}></Col>
					<Col span={15} className="container">
						{/*
						<div style={{height:'300px'}} className="leftContainer">
							<AutoCarousel history={history} count={4}/>
						</div>
						*/}
						<div>
							<div style={{width:'64%',float:'left'}}>
								{
									isLoading
									?
									<Spin/>
									:
									<div style={{display:'flex'}}>
										<div style={{width:'50%',padding:'4px 8px 0 12px'}}>
											<PCNewsBlock title="本周热门新闻" data={newsList}/>
										</div>
										<div style={{width:'50%',padding:'4px 8px 0 12px'}}>
											<PCNewsBlock type="yule" title="本周热门话题" isTopic/>
										</div>
									</div>
								}
								
								
							</div>
							<div style={{width:'36%',float:'left'}}>
								<PCNewsImageBlock count={4} type="shehui" size="small" cardTitle="国际头条" columns={2} />	
							</div>
					
						</div>
						
					</Col>
					<Col span={5} style={{marginLeft:'20px'}}>
						<Tabs className="tabs_product">
							<TabPane tab=" React 产品" key="1">
								<PCProduct/>
							</TabPane>
						</Tabs>
					</Col>
					<Col span={2}></Col>
				</Row>

				<Row>
					<Col span={2}></Col>
					<Col span={20}>
						{/*
						<PCNewsImageBlock iconType="home" count={16} type="guonei"  cardTitle="国内新闻"  columns={6}/>																	
						<PCNewsImageBlock iconType="global" count={16} type="guoji"  cardTitle="国际新闻"  columns={6}/>
						<PCNewsImageBlock iconType="notification" count={16} type="shehui"  cardTitle="社会新闻"  columns={6}/>
						<PCNewsImageBlock iconType="mobile" count={16} type="keji"  cardTitle="科技新闻"  columns={6}/>
						<PCNewsImageBlock iconType="mobile" count={16} type="junshi"  cardTitle="军事新闻" columns={6}/>
						<PCNewsImageBlock iconType="rocket" count={16} type="tiyu"  cardTitle="体育新闻"  columns={6}/>
						*/}
					</Col>
					<Col span={2}></Col>

				</Row>

			</section>

		)
	}
}


