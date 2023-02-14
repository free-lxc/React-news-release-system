import React, { useEffect, useState, useRef } from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import axios from 'axios';
import * as echarts from 'echarts'
import _ from 'lodash'
export default function Home() {
  const { Meta } = Card;
  const [dataSource, setDataSource] = useState([])
  const [starList, setStarList] = useState([])
  const [allList, setAllList] = useState([])
  const [open, setOpen] = useState(false);
  const [pieChart, setPieChart] = useState(null)
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6')
      .then(res => {
        setDataSource(res.data)
      })
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6')
      .then(res => {
        setStarList(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category')
      .then(res => {
        // 给数据分组
        renderBar(_.groupBy(res.data, item => item.category.title))
        setAllList(res.data)
      })
    return () => {
      // 组件销毁
      window.onresize = null
    }
  }, [])

  const showDrawer = () => {
    // 虽然延迟了0s，但已经是进入了异步的
    setTimeout(() => {
      setOpen(true);
      renderPieView()
    }, 0)

  };
  const onClose = () => {
    setOpen(false);
  };
  const renderBar = (item) => {
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(item),
        axisLabel: {
          rotate: '60',
          interval: 0
        },

      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(item).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      // 设置自适应
      myChart.resize()
    }
  }
  const renderPieView = () => {
    var currentList = allList.filter(item => item.author === username)
    var groupPie = _.groupBy(currentList, item => item.category.title)
    var list = []
    for (var i in groupPie) {
      list.push({
        name: i,
        value: groupPie[i].length
      })
    }
    var chartDom = document.getElementById('pin');
    var myChart
    if (!pieChart) {
      myChart = echarts.init(chartDom);
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;
    option = {
      title: {
        text: '当前用户新闻分类图示',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered>
            <List
              size="small"
              dataSource={dataSource}
              renderItem={(item) => <List.Item>
                {/* 注意跳转路径的正确写法 */}
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item>
                {/* 注意跳转路径的正确写法 */}
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={showDrawer}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '10px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div id="main" style={{ width: '100%', height: "400px" }}></div>
      <Drawer title="个人新闻分类" placement="right" onClose={onClose} open={open} width='500px'>
        <div id="pin" style={{ width: '100%', height: "400px" }}></div>
      </Drawer>
    </div>
  )
}
