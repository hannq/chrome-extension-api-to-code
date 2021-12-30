import { type ForwardRefRenderFunction, forwardRef } from 'react';
import { Input } from 'antd';
import { SearchProps, } from 'antd/es/input/Search';
import './index.module.less';

const { Search } = Input;

interface Props extends SearchProps {

}

const SearchBar: ForwardRefRenderFunction<Input, Props> = (props, ref) => {
  const { ...rest } = props;

  return (
    <div styleName="search-bar-wrapper">
      <Search
        ref={ref}
        styleName="seach-input"
        placeholder="支持输入 Yapi 或 Swagger 页面地址"
        {...rest}
      />
    </div>
  )
}

export default forwardRef(SearchBar);
