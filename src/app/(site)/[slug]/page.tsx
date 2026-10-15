import { postRoute } from '@/lib/post-page';

/** Pages (type "page") live at the root: /deals, /how-we-test, /contact, ... */
const route = postRoute('page');
export const generateMetadata = route.generateMetadata;
export default route.Page;
