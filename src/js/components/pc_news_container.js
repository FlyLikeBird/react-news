import React from 'react';
import { Row, Col } from 'antd';

import { Tabs, Carousel, Icon } from 'antd';
const TabPane = Tabs.TabPane;

import PCNewsBlock from './pc_news_block';
import PCNewsImageBlock from './pc_news_image_block';
import PCProduct from './pc_product';

export default class PCNewsContainer extends React.Component {
	render() {

		const settings = {
			dots:true,
			infinite:true,
			speed:500,
			slidesToShow:1,
			autoplay:true
			
		};

		return(

			<section>
				<Row>
					<Col span={2}></Col>
					<Col span={20} className="container">

						<div className="leftContainer">
							<div className="carousel">
								<Carousel {...settings} >
									<div><img src="./src/images/carousel_1.jpg" /></div>
									<div><img src="./src/images/carousel_2.jpg" /></div>
									<div><img src="./src/images/carousel_3.jpg" /></div>
									<div><img src="./src/images/carousel_4.jpg" /></div>
								</Carousel>
							</div> 
							<PCNewsImageBlock count={6} type="yule" width="400px" cardTitle="国际头条" imageWidth="108px" />

						</div>

						<Tabs className="tabs_news">
							<TabPane tab={<span><Icon type="profile" />新闻</span>} key="1">
								<Icon type="profile" />
								<PCNewsBlock type="top" count={20} width="100%"/>
							</TabPane>
							<TabPane tab="国内" key="2">
								<PCNewsBlock type="guonei" count={20} width="100%"/>
							</TabPane>
						</Tabs>

						<Tabs className="tabs_product">
							<TabPane tab=" React 产品" key="1">
								<PCProduct/>
							</TabPane>
						</Tabs>
						
						<PCNewsImageBlock count={14} type="guonei" width="100%" cardTitle="国内新闻" imageWidth="132px" />
						<PCNewsImageBlock count={14} type="guoji" width="100%" cardTitle="国际新闻" imageWidth="132px" />
						<PCNewsImageBlock count={14} type="shehui" width="100%" cardTitle="社会新闻" imageWidth="132px" />
						<PCNewsImageBlock count={14} type="keji" width="100%" cardTitle="科技新闻" imageWidth="132px" />
						<PCNewsImageBlock count={14} type="shishang" width="100%" cardTitle="时尚新闻" imageWidth="132px" />
					</Col>
					<Col span={2}></Col>
				</Row>
			</section>

		)
	}
}