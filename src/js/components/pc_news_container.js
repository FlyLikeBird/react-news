import React from 'react';
import { Row, Col } from 'antd';

import { Tabs, Carousel, Icon } from 'antd';


import PCNewsBlock from './pc_news_block';
import PCNewsImageBlock from './pc_news_image_block';
import PCProduct from './pc_product';

import carousel_1 from './../../images/carousel_1.jpg';
import carousel_2 from './../../images/carousel_2.jpg';
import carousel_3 from './../../images/carousel_3.jpg';
import carousel_4 from './../../images/carousel_4.jpg';

const TabPane = Tabs.TabPane;

/*
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
								<Carousel>
									<div><img src={ carousel_1 } /></div>
									<div><img src={ carousel_2 }/></div>
									<div><img src={ carousel_3 }/></div>
									<div><img src={ carousel_4 } /></div>
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

*/

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
								<Carousel>
									<div><img src={ carousel_1 } /></div>
									<div><img src={ carousel_2 }/></div>
									<div><img src={ carousel_3 }/></div>
									<div><img src={ carousel_4 } /></div>
								</Carousel>
							</div>
														
							<PCNewsImageBlock count={6} type="yule" width="400px" cardTitle="国际头条" imageWidth="33%" />	
										
						</div>

						<Tabs className="tabs_news">
							<TabPane tab={<span><Icon type="profile" />新闻</span>} key="1">
								
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
						
						<PCNewsImageBlock count={16} type="guonei" width="100%" cardTitle="国内新闻" imageWidth="12%" />											
						<PCNewsImageBlock count={16} type="guoji" width="100%" cardTitle="国际新闻" imageWidth="12%" />
						<PCNewsImageBlock count={16} type="shehui" width="100%" cardTitle="社会新闻" imageWidth="12%" />
						<PCNewsImageBlock count={16} type="keji" width="100%" cardTitle="科技新闻" imageWidth="12%" />
						<PCNewsImageBlock count={16} type="tiyu" width="100%" cardTitle="时尚新闻" imageWidth="12%" />
						
					</Col>
					<Col span={2}></Col>
				</Row>
			</section>

		)
	}
}

