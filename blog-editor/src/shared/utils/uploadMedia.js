import axios from 'axios';

/**
 * Uploads a media file (image/video) to the backend API and returns the CloudFront URL.
 * 
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} The CloudFront URL of the uploaded media
 */
export const uploadMediaForEditor = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file); // Assuming the field name is 'file'

        const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:9000/api';
        const token = localStorage.getItem('blog_token');

        const response = await axios.post(`${baseURL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        // We assume the response structure is { url: 'https://...' } based on common patterns.
        // If the backend returns something different (e.g., { data: { cloudfront_url: '...' } }),
        // we would need to adjust this.
        return response.data.url;
    } catch (error) {
        console.error('Error uploading media:', error);
        throw new Error('Failed to upload media. Please try again.');
    }
};
