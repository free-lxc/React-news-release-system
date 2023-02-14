import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from 'antd'
import UsePublish from './UsePublish'
import NewsPublish from '../../../components/NewsPublish/NewsPublish'
export default function Unpublished() {
  const { dataSource, handleUnPublish } = UsePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource}
        button={(id) =><Button type='primary' onClick={() => handleUnPublish(id)}>发布</Button>}

      ></NewsPublish>
    </div>
  )
}
