import { Button } from 'antd'
import NewsPublish from '../../../components/NewsPublish/NewsPublish'
import UsePublish from './UsePublish'
export default function Published() {
  const { dataSource, handlePublish } = UsePublish(2)
  return (
    <div>
      <NewsPublish dataSource={dataSource}
        button={(id) => <Button onClick={() => handlePublish(id)} danger>
          下线
        </Button>}
      ></NewsPublish>
    </div>
  )
}
