import React from 'react';
import { Row, Col } from 'antd';

import { Tabs, Icon, Card } from 'antd';


import img1 from '../../images/1.jpg';
import img2 from '../../images/2.jpg';
import img3 from '../../images/3.jpg';

import PCNewsBlock from './pc_news_block';
import PCNewsImageBlock from './pc_news_image_block';
import PCProduct from './pc_product';
import AutoCarousel from './AutoCarousel';


const TabPane = Tabs.TabPane;

export default class PCNewsContainer extends React.Component {
	render() {
		var data = [];
		data.push(img1);
		data.push(img2);
		data.push(img3);
		return(

			<section style={{paddingTop:'30px'}}>
				<Row>
					<Col span={2}></Col>
					<Col span={15} className="container">

						<div style={{height:'300px',overflow:'hidden'}} className="leftContainer">
							<AutoCarousel data={data} />
						</div>
						
						<div>
							<div style={{width:'36%',float:'left'}}>
								<PCNewsImageBlock count={4} type="shehui" cardTitle="国际头条" imageWidth="50%" />	
							</div>
							<div style={{width:'64%',float:'left',display:'flex'}}>
								
								<div style={{width:'50%',padding:'4px 8px 0 12px'}}>
									<PCNewsBlock type="yule" title="本周热门新闻" count={10}/>
								</div>
								<div style={{width:'50%',padding:'4px 8px 0 12px'}}>
									<PCNewsBlock type="yule" title="本周热门话题" count={10} isTopic/>
								</div>
								
							</div>
						</div>
						
					</Col>
					
					<Col span={5}>
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
						<PCNewsImageBlock iconType="home" count={16} type="guonei" width="100%" cardTitle="国内新闻" imageWidth="12.5%" />																	
						<PCNewsImageBlock iconType="global" count={16} type="guoji" width="100%" cardTitle="国际新闻" imageWidth="12.5%" />
						<PCNewsImageBlock iconType="notification" count={16} type="shehui" width="100%" cardTitle="社会新闻" imageWidth="12.5%" />
						<PCNewsImageBlock iconType="mobile" count={16} type="keji" width="100%" cardTitle="科技新闻" imageWidth="12.5%" />
						<PCNewsImageBlock iconType="mobile" count={16} type="junshi" width="100%" cardTitle="军事新闻" imageWidth="12.5%" />
						<PCNewsImageBlock iconType="rocket" count={16} type="tiyu" width="100%" cardTitle="体育新闻" imageWidth="12.5%" />
						*/}
					</Col>
					<Col span={2}></Col>

				</Row>

			</section>

		)
	}
}


