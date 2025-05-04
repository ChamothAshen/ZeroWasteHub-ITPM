import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ResultDisplay = ({ result, imagePreview }) => {
  if (!result) return null;

  const { labels, isRecyclable, confidence } = result;
  const wasteType = labels[0] || 'Unknown waste';
  const confidencePercent = Math.round(confidence * 100);
  
  // More detailed tips based on the waste type
  const getTips = () => {
    const tips = [];
    if (labels.some(l => l.includes('plastic'))) {
      tips.push('Rinse before recycling to remove food residue');
      tips.push('Remove and discard plastic caps and lids separately');
      tips.push('Flatten to save space in recycling bins');
    } else if (labels.some(l => l.includes('paper') || l.includes('cardboard'))) {
      tips.push('Remove tape, staples, and plastic wrapping');
      tips.push('Flatten cardboard boxes to save space');
      tips.push('Keep dry and clean for better recycling quality');
    } else if (labels.some(l => l.includes('glass'))) {
      tips.push('Rinse thoroughly to remove food residue');
      tips.push('Sort by color if required in your area');
      tips.push('Remove and separate metal lids and caps');
    } else if (labels.some(l => l.includes('metal') || l.includes('aluminum') || l.includes('can'))) {
      tips.push('Rinse to remove food or beverage residue');
      tips.push('No need to remove labels');
      tips.push('Crush cans to save space (if your facility allows)');
    } else if (labels.some(l => l.includes('electronic'))) {
      tips.push('Never dispose of in regular trash');
      tips.push('Find local e-waste collection centers');
      tips.push('Consider donating if still functional');
    } else {
      tips.push('Check local guidelines for specific disposal instructions');
      tips.push('Contact your waste management facility when in doubt');
    }
    return tips;
  };

  // Generate PDF report function
  const generateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(76, 175, 80); // Green color
    doc.text("Waste Analysis Report", 105, 15, { align: "center" });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${currentDate}`, 105, 22, { align: "center" });
    
    // Add image if available
    if (imagePreview) {
      try {
        doc.addImage(imagePreview, 'JPEG', 70, 30, 70, 70);
      } catch (error) {
        console.error("Error adding image to PDF:", error);
      }
    }
    
    // Add waste identification
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Waste Identification", 14, 115);
    
    autoTable(doc, {
      startY: 120,
      head: [['Property', 'Value']],
      body: [
        ['Item Type', wasteType.charAt(0).toUpperCase() + wasteType.slice(1)],
        ['Recyclable', isRecyclable ? 'Yes' : 'No'],
        ['Confidence', `${confidencePercent}%`],
        ['Also detected', labels.slice(1).join(', ')]
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: isRecyclable ? [76, 175, 80] : [244, 67, 54],
        textColor: [255, 255, 255]
      }
    });
    
    // Add disposal instructions
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Disposal Instructions", 14, doc.lastAutoTable.finalY + 15);
    
    const disposalTips = getTips();
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: disposalTips.map(tip => [tip]),
      theme: 'plain',
      styles: {
        cellPadding: 4
      }
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("ZeroWasteHub - Helping you dispose waste responsibly", 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save(`waste-analysis-${wasteType}-${currentDate.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
      <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
        <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Analysis Results
        </h2>
        <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
          Step 2
        </span>
      </div>

      {/* Show the image preview */}
      {imagePreview && (
        <div className="p-4 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-700/20">
          <div className="flex justify-center">
            <img 
              src={imagePreview} 
              alt="Analyzed waste" 
              className="max-h-[200px] object-contain rounded shadow" 
            />
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isRecyclable ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {isRecyclable ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                  This item is
                </p>
                <h3 className={`text-lg font-semibold ${
                  isRecyclable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {isRecyclable ? 'RECYCLABLE' : 'NOT RECYCLABLE'}
                </h3>
              </div>
            </div>
            
            <div className="hidden sm:block text-right">
              <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                Confidence
              </p>
              <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                {confidencePercent}%
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-700/30 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Identified as:
                </p>
                <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 capitalize my-1">
                  {wasteType}
                </h4>
                
                {labels.length > 1 && (
                  <div className="mt-3">
                    <p className="text-xs text-stone-600 dark:text-stone-400 mb-1.5">Also detected:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {labels.slice(1).map((label, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 rounded-full bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-stone-300 text-xs capitalize"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          isRecyclable ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 
          'border-rose-500 bg-rose-50 dark:bg-rose-900/10'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {isRecyclable ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                isRecyclable ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
              }`}>
                {isRecyclable ? 'How to Recycle This Item' : 'Disposal Instructions'}
              </h3>
              <div className="mt-2 text-sm space-y-1">
                {isRecyclable ? (
                  <ul className="space-y-1">
                    {getTips().map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-600 dark:text-emerald-400 mr-2 font-bold">•</span>
                        <span className={`text-emerald-700 dark:text-emerald-300`}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <span className="text-rose-600 dark:text-rose-400 mr-2 font-bold">•</span>
                      <span className="text-rose-700 dark:text-rose-300">Place in general waste bin</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-600 dark:text-rose-400 mr-2 font-bold">•</span>
                      <span className="text-rose-700 dark:text-rose-300">Consider if any parts can be reused</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-600 dark:text-rose-400 mr-2 font-bold">•</span>
                      <span className="text-rose-700 dark:text-rose-300">Check for special disposal requirements if it's electronic or hazardous waste</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Analysis Confidence
            </h3>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {confidencePercent}%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full ${isRecyclable ? 'bg-emerald-500' : 'bg-rose-500'}`} 
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
          <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
            Higher confidence indicates more reliable classification
          </p>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="ml-2 text-sm text-stone-600 dark:text-stone-400">
              Continue to the chat assistant for more detailed guidance
            </span>
          </div>
          
          <button
            onClick={generateReport}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;