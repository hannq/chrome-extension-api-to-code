import { useMemo, type FC } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { type ThemeConfig, ConfigProvider, Empty, theme as antdTheme, App as AntdApp, } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import DynamicTheme from "@/components/DynamicTheme";
import { ANTD_PREFIX_CLS } from "@/constant";
import { useTheme } from '@/hooks/useTheme';
import "./index.less";
import Routes from "./routes";
import { initTheme } from "./utils/initTheme";

dayjs.locale("zh-cn");
initTheme();

ConfigProvider.config({
  prefixCls: ANTD_PREFIX_CLS,
  // iconPrefixCls: 'smicon',
});

const App: FC = () => {
  const themeType = useTheme();
  const theme = useMemo<ThemeConfig>(() => ({
    algorithm: themeType === 'light' ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm,
  }), [themeType]);

  return (
    <ConfigProvider
      prefixCls={ANTD_PREFIX_CLS}
      // iconPrefixCls="smicon"
      locale={zhCN}
      renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      theme={theme}
    >
      <AntdApp>
        <DynamicTheme />
        <HashRouter>
          <Routes />
        </HashRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
