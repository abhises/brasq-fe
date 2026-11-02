import { postRoute } from '@/lib/post-page';

const route = postRoute('informational');
export const generateMetadata = route.generateMetadata;
export default route.Page;
