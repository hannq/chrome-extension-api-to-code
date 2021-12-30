import { useEffect, useState } from 'react';
import options, { defaultOptions } from '@/utils/options';
import { Options } from '@/types';

export function useOptions() {
  const [opts, setOpts] = useState<Options>(defaultOptions);

  useEffect(() => {
    options.onChange(setOpts)
    options.get().then(setOpts);

    return () => options.offChange(setOpts);
  }, []);

  return opts;
}
