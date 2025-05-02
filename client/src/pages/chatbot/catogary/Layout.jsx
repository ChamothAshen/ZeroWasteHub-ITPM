import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-900 font-sans">
      <header className="bg-green-700 dark:bg-green-800 text-white py-3">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Zero-Waste</h1>
          </div>
          <div className="text-sm hidden md:block">Identify • Dispose • Recycle</div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {children}
      </div>

      <footer className="bg-green-100 dark:bg-green-800 border-t border-green-200 dark:border-green-700 py-6 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-600 dark:text-green-400 text-sm">
              © {new Date().getFullYear()} WasteWise • Sustainable Disposal Solutions
            </p>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-xs text-green-500 dark:text-green-500 mr-2">Powered by:</span>
              <div className="flex space-x-3 items-center">
                <span className="text-green-700 dark:text-green-500 text-sm">Vision AI</span>
                <span className="text-green-300 dark:text-green-600">•</span>
                <span className="text-green-700 dark:text-green-500 text-sm">Gemini</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
