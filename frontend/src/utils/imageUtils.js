export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If the image path is already a full URL, return it as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Otherwise, prepend the API URL
    return `${process.env.REACT_APP_API_URL}${imagePath}`;
}; 