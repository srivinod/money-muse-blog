import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log('Starting image upload process...');
    
    // Check if we're authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication required to upload images');
    }
    
    if (!session) {
      console.error('No active session');
      throw new Error('Authentication required to upload images');
    }
    
    console.log('User is authenticated:', session.user.email);
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    console.log(`Uploading file: ${file.name} to path: ${filePath}`);
    console.log(`File size: ${file.size} bytes, type: ${file.type}`);

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (error.message.includes('new row violates row-level security policy')) {
        throw new Error('Upload failed: You do not have permission to upload files. Please make sure you are logged in.');
      }
      
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('File uploaded successfully, getting public URL...');

    // Get the public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
      
    console.log(`Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    if (error instanceof Error) {
      throw new Error(`Image upload failed: ${error.message}`);
    } else {
      throw new Error('Image upload failed with unknown error');
    }
  }
}; 