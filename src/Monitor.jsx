import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import {Card} from "antd";
import './styles/Monitor.css'

const Monitor = () => {
  return (
      <>
        <Header />
        <main className="monitor">
          <Card title={'Palace Monitor'}>

          </Card>
        </main>
        <Footer />
      </>
  )
}

export default Monitor;