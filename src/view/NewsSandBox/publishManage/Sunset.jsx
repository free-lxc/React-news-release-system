import { Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsPublish from '../../../components/NewsPublish/NewsPublish'
import UsePublish from './UsePublish'
export default function Sunset() {
  const { dataSource, handleSunset } = UsePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource}
        button={(id) => <Button type='primary' danger onClick={() => handleSunset(id)}>
          删除
        </Button>}

      ></NewsPublish>
    </div>
  )
}
