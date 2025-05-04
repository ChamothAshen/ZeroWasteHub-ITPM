import { useState } from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  };

  const processFile = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    try {
      await onImageUpload(image, preview);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
      <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
        <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Upload Waste Image
        </h2>
        <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
          Step 1
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div 
          className={`relative border-2 ${
            isDragging 
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' 
              : preview 
                ? 'border-stone-200 dark:border-stone-700' 
                : 'border-dashed border-stone-300 dark:border-stone-600'
            } 
            rounded-lg p-8 flex flex-col items-center justify-center h-64 md:h-72 transition-all duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !preview && document.getElementById('fileInput').click()}
        >
          {preview ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={preview} 
                alt="Waste Preview" 
                className="max-h-full max-w-full object-contain rounded shadow-sm" 
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="absolute -top-3 -right-3 bg-stone-800 text-white p-1.5 rounded-full shadow-lg hover:bg-stone-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-stone-800 dark:text-stone-200 font-medium mb-1">
                Upload your waste photo
              </p>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-3">
                Drag & drop or click to browse
              </p>
              <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                JPG, PNG, WEBP • Max 10MB
              </div>
            </div>
          )}
          <input 
            id="fileInput" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className={`w-full flex items-center justify-center rounded-lg py-3 px-4 text-sm font-medium transition-all
              ${!image 
                ? 'bg-stone-200 cursor-not-allowed text-stone-400 dark:bg-stone-700 dark:text-stone-500' 
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow'
              }`}
            disabled={!image || loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Analyze Waste</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-700">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="ml-2 text-xs text-stone-500 dark:text-stone-400">
            For best results, take clear photos with good lighting and minimal background clutter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader; 