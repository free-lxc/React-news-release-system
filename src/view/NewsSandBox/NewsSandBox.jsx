import 'antd/dist/antd.css'
import 'nprogress/nprogress.css'
import './NewsSandBox.css'
import React, { useEffect } from 'react';
import SideMenu from '../../components/SideMenu/SideMenu'
import NewsRouter from '../../components/NewsRouter/NewsRouter';
import TopHeader from '../../components/TopHeader/TopHeader'
import { Layout } from 'antd';
import nProgress from 'nprogress'
const { Content } = Layout;

export default function NewsSandBox() {
  nProgress.start()
  useEffect(() => {
    nProgress.done()
  }, [])
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: "auto"
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  )

}
