import { type FC, useRef } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Tooltip, Switch, Select, Card, Button, Space, message } from 'antd';
import { useMount } from 'ahooks';
import options from '@/utils/options';
import { Options } from '@/types';
import { Theme } from '@/constant';
import './index.module.less';

const { Item, useForm } = Form;

const OptionsPage: FC = () => {
  const [formInstance] = useForm<Options>();
  const defaultOptsRef = useRef<Options | null>(null);

  useMount(async () => {
    const opts = await options.get();
    defaultOptsRef.current = opts;
    formInstance.setFieldsValue(opts);
  })

  return (
    <Form
      styleName="options-wrapper"
      form={formInstance}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      onFinish={async (values) => {
        try {
          await options.set(values);
          message.success(`保存配置成功`);
        } catch (err) {
          console.error(err);
          message.error(`保存配置失败`);
        }
      }}
    >
      <h1>配置页</h1>
      <Space size={20} styleName="content-wrapper" direction="vertical">
        <Card title="基础配置">
          <Item name={["basic", "theme"]} label="主题">
            <Select
              options={[
                { value: Theme.AUTO, label: '跟随操作系统' },
                { value: Theme.LIGHT, label: '亮色模式' },
                { value: Theme.DARK, label: '暗黑模式' }
              ]}
            />
          </Item>
          <Item label="生成代码后自动复制" name={["basic", "autoCopyAfterGenCode"]} valuePropName="checked">
            <Switch />
          </Item>
        </Card>
        <Card title="编辑器配置">
          <Item label="编辑器是否可编辑" name={["editor", "editable"]} valuePropName="checked">
            <Switch />
          </Item>
        </Card>
        <Card title="实验性功能">
          <Item
            label={(
              <div styleName="label-wrapper">
                <div styleName="label-text">懒癌模式</div>
                <Tooltip placement="top" title="接口详情页面加载完毕后，自动将生成的代码复制到剪贴板">
                  <QuestionCircleOutlined styleName="label-icon" />
                </Tooltip>
              </div>
            )}
            name={["beta", "laziestMode"]}
            valuePropName="checked"
          >
            <Switch />
          </Item>
        </Card>
        <div styleName="btn-wrapper">
          <Space size={20}>
            <Button
              size="large"
              onClick={() => {
                defaultOptsRef.current && formInstance.setFieldsValue(defaultOptsRef.current);
              }}
            >重置</Button>
            <Button size="large" type="primary" htmlType="submit">保存</Button>
          </Space>
        </div>
      </Space>
    </Form>
  )
}

export default OptionsPage;
