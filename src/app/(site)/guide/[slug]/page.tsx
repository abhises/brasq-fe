import { postRoute } from '@/lib/post-page';

const route = postRoute('guide');
export const generateMetadata = route.generateMetadata;
export default route.Page;
