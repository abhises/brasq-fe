import { postRoute } from '@/lib/post-page';

const route = postRoute('comparison');
export const generateMetadata = route.generateMetadata;
export default route.Page;
