import { supabase } from "@/integrations/supabase/client";

export const setupBlogStorage = async () => {
  try {
    console.log('Checking blog storage setup...');
    
    // First, check if we're authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication required to set up storage');
    }
    
    if (!session) {
      console.error('No active session');
      throw new Error('Authentication required to set up storage');
    }
    
    console.log('User is authenticated:', session.user.email);
    
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw new Error(`Failed to list buckets: ${bucketsError.message}`);
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name).join(', '));
    const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images');

    if (!blogImagesBucket) {
      console.error('Blog images bucket not found');
      throw new Error('Blog images bucket not found. Please create it manually in the Supabase dashboard.');
    }

    console.log('Blog images bucket exists:', blogImagesBucket);
    
    // Try to upload a small test file to verify write access
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload('test.txt', testFile, {
        upsert: true
      });

    if (uploadError) {
      console.error('Error testing bucket write access:', uploadError);
      throw new Error(`Failed to write to bucket: ${uploadError.message}`);
    }

    console.log('Successfully tested bucket write access');
    
    // Clean up the test file
    const { error: deleteError } = await supabase.storage
      .from('blog-images')
      .remove(['test.txt']);

    if (deleteError) {
      console.error('Error cleaning up test file:', deleteError);
      // Don't throw here, as the main test was successful
    }

    console.log('Blog storage setup verified successfully');
  } catch (error) {
    console.error('Error in setupBlogStorage:', error);
    throw error;
  }
}; 