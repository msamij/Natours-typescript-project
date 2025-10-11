/**
 * Since my typescript is setup to use "type": "module". Fixed it by following the github url.
 * https://github.com/simov/slugify/issues/173#issuecomment-1476782630
 *
 * Hack to make 'slugify' import work with "type": "module".
 */
import slugify from 'slugify';

export default slugify as unknown as typeof slugify.default;
