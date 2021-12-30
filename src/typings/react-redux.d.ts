import 'react-redux';
declare module 'react-redux' {
  export function createDispatchHook<S = RootStateOrAny, TDispatch = Dispatch<any>>(
    context?: Context<ReactReduxContextValue<S>>,
  ): () => TDispatch;
}
