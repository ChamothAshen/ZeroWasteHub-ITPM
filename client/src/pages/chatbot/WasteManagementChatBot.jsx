import { useState } from 'react'
import Layout from './catogary/Layout'
import ImageUploader from './catogary/ImageUploader'
import ResultDisplay from './catogary/ResultDisplay'
import Chat from './catogary/Chat'
import useWasteAnalyzer from './catogary/WasteAnalyzer'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const WasteManagementChatBot = () => {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [activeTab, setActiveTab] = useState('results') // 'results' or 'chat'
  const [imagePreview, setImagePreview] = useState(null) // Store the image preview
  
  // Use the hook directly in the component
  const { analyzeImage, loading } = useWasteAnalyzer(setAnalysisResult)
  
  const handleImageUpload = async (image, preview) => {
    try {
      // Store the image preview
      setImagePreview(preview)
      // Use the analyzeImage function from the hook
      await analyzeImage(image)
      // After analysis is complete, switch to results tab
      setActiveTab('results')
    } catch (error) {
      console.error('Error analyzing image:', error)
    }
  }
  
  const resetAnalysis = () => {
    setAnalysisResult(null)
    setImagePreview(null)
    setActiveTab('results')
  }

  // Generate comprehensive report that includes both analysis and chat
  const generateCompleteReport = () => {
    if (!analysisResult) return;
    
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Add title and header
    doc.setFontSize(22);
    doc.setTextColor(76, 175, 80);
    doc.text("Waste Management Complete Report", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${currentDate}`, 105, 27, { align: "center" });
    
    // Add image if available
    if (imagePreview) {
      try {
        doc.addImage(imagePreview, 'JPEG', 70, 35, 70, 70);
      } catch (error) {
        console.error("Error adding image to PDF:", error);
      }
    }
    
    // Add waste identification
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Waste Identification", 14, 120);
    
    const wasteType = analysisResult.labels[0] || 'Unknown waste';
    const isRecyclable = analysisResult.isRecyclable;
    const confidencePercent = Math.round(analysisResult.confidence * 100);
    
    autoTable(doc, {
      startY: 125,
      head: [['Property', 'Value']],
      body: [
        ['Item Type', wasteType.charAt(0).toUpperCase() + wasteType.slice(1)],
        ['Recyclable', isRecyclable ? 'Yes' : 'No'],
        ['Confidence', `${confidencePercent}%`],
        ['Also detected', analysisResult.labels.slice(1).join(', ')]
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: isRecyclable ? [76, 175, 80] : [244, 67, 54],
        textColor: [255, 255, 255]
      }
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("ZeroWasteHub - Helping you dispose waste responsibly", 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save(`complete-waste-report-${currentDate.replace(/\//g, '-')}.pdf`);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {!analysisResult ? (
          <>
            <div className="flex flex-col items-center justify-center mb-10 text-center">
              <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-3">
                Waste Identification & Disposal Guide
              </h1>
              <p className="text-stone-600 dark:text-stone-400 max-w-2xl">
                Upload a photo of your waste item and our AI will identify it, tell you if it's recyclable, and provide specific disposal instructions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:row-span-2">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
              
              <div className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
                <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700">
                  <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How It Works
                  </h2>
                </div>
                <div className="p-6">
                  <ol className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-medium mr-3">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-800 dark:text-stone-200">Upload an image</h3>
                        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                          Take a clear photo of the item you want to dispose of
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-medium mr-3">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-800 dark:text-stone-200">Get analysis</h3>
                        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                          Our AI will identify the item and determine if it's recyclable
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-medium mr-3">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-800 dark:text-stone-200">Review disposal instructions</h3>
                        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                          Learn the proper way to dispose of or recycle your item
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg overflow-hidden border border-amber-200 dark:border-amber-800/30 p-5">
                <div className="flex mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-amber-800 dark:text-amber-400">Why is proper waste disposal important?</h3>
                    <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-400/80">
                      Proper waste disposal preserves our environment, conserves natural resources, and reduces pollution. It prevents harmful chemicals from contaminating soil and water, and can significantly reduce landfill waste.
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 text-xs bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-300 rounded px-3 py-2">
                  <p className="font-medium">Did you know?</p>
                  <p className="mt-1">About 75% of the average American's waste is recyclable, but only about 30% actually gets recycled.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Waste Analysis Results</h1>
              <div className="flex space-x-2">
                <button
                  onClick={generateCompleteReport}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 transition-colors mr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Complete Report
                </button>
                <button
                  onClick={resetAnalysis}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900/70 text-amber-800 dark:text-amber-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Analyze New Item
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex mb-4">
                  <button
                    className={`flex-1 py-2.5 px-4 text-center text-sm font-medium rounded-l-lg transition-colors ${
                      activeTab === 'results'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
                    }`}
                    onClick={() => setActiveTab('results')}
                  >
                    Analysis Results
                  </button>
                  <button
                    className={`flex-1 py-2.5 px-4 text-center text-sm font-medium rounded-r-lg transition-colors ${
                      activeTab === 'chat'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
                    }`}
                    onClick={() => setActiveTab('chat')}
                  >
                    Chat Assistant
                  </button>
                </div>
                
                {activeTab === 'results' ? (
                  <ResultDisplay result={analysisResult} imagePreview={imagePreview} />
                ) : (
                  <Chat analysisResult={analysisResult} />
                )}
              </div>
              
              <div className="hidden md:block">
                {activeTab === 'results' ? (
                  <Chat analysisResult={analysisResult} />
                ) : (
                  <div className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
                    <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700">
                      <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100">Analyzed Image</h2>
                    </div>
                    <div className="p-6 flex items-center justify-center">
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="Analyzed waste" 
                          className="max-w-full max-h-[400px] object-contain rounded" 
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {!analysisResult && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">Reduce Waste</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Buy only what you need, choose products with less packaging, and use reusable alternatives.
              </p>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">Reuse Items</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Repair broken items, donate usable ones, and repurpose materials for new uses.
              </p>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">Recycle Properly</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Learn what's recyclable in your area, clean items before recycling, and avoid wishcycling.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default WasteManagementChatBot;
