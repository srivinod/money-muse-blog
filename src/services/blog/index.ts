// Export all blog services
export * from './fetchPosts';
export * from './managePosts';
export * from './categories';
export * from './types';
export * from './migration';
export * from './addMetaTagsFields';
export * from './uploadImage';
export * from './setupStorage';

// Run migrations when this module is imported
import { addMetaTagsFields } from './addMetaTagsFields';

// Execute the migration
addMetaTagsFields().catch(error => {
  console.error('Failed to run meta tags migration:', error);
});
