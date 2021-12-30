import { ConfigProvider, Empty } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.less';
import Routes from './routes';
import { initTheme } from './utils/initTheme';

moment.locale('zh-cn');
initTheme();

ConfigProvider.config({
  prefixCls: 'api-to-code',
  // iconPrefixCls: 'smicon',
  theme: {
    // primaryColor: '#f56c1d',
  },
});

ReactDOM.render(
  <ConfigProvider
    prefixCls="api-to-code"
    // iconPrefixCls="smicon"
    locale={zhCN}
    renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
  >
    <HashRouter>
      <Routes />
    </HashRouter>
  </ConfigProvider>,
  document.getElementById('root'),
);
