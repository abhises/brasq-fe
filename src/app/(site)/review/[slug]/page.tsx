import { postRoute } from '@/lib/post-page';

const route = postRoute('review');
export const generateMetadata = route.generateMetadata;
export default route.Page;
