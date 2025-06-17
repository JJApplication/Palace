// 底部版权信息 直接嵌入单独页面中使用
import './Footer.css';

const Footer = () => {
  return (
      <>
        <div className={'footer'}>
          <p>
            <span>Palace App of <a>JJApps</a></span>
            &nbsp;-&nbsp;
            Copyright <a href={'https://renj.io'}>renj.io</a>
          </p>
        </div>
      </>
  )
}

export default Footer;