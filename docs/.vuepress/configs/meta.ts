export { name, description, version } from '../../../public/manifest.json'
import { name } from '../../../package.json'
export const PUBLIC_URL = `/${name}/` as const;
