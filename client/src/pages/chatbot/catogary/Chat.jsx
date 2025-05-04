import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Get API key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const Chat = ({ analysisResult }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I can help answer your questions about waste management and recycling. What would you like to know?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const initialMessageSent = useRef(false);
  const wasteContext = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // If we have analysis results and haven't sent the initial message yet
    if (analysisResult && !initialMessageSent.current) {
      const wasteType = analysisResult.labels[0] || 'waste item';
      const recyclability = analysisResult.isRecyclable ? 'recyclable' : 'not recyclable';
      
      // Store the waste context for future responses
      wasteContext.current = {
        type: wasteType,
        recyclable: analysisResult.isRecyclable,
        labels: analysisResult.labels
      };
      
      const systemMessage = {
        role: 'assistant',
        content: `I've detected a ${wasteType}, which is ${recyclability}. You can ask me about proper disposal methods or any other waste management questions.`
      };
      
      setMessages(prev => [...prev, systemMessage]);
      initialMessageSent.current = true; // Mark initial message as sent
    }
  }, [analysisResult]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      // Always try to use the actual Gemini API first
      try {
        if (GEMINI_API_KEY) {
          // Use actual Gemini API
          response = await callGeminiAPI(inputMessage, wasteContext.current, messages);
        } else {
          throw new Error('No API key available');
        }
      } catch (apiError) {
        console.warn('Error calling Gemini API:', apiError);
        console.warn('Falling back to simulated responses');
        // Fall back to simulated responses only if the API call fails
        response = await simulateGeminiResponse(inputMessage, wasteContext.current, messages);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const callGeminiAPI = async (message, wasteInfo, previousMessages) => {
    try {
      // Prepare the conversation history for the API - only include relevant messages
      // Get the last 6 messages to maintain context without exceeding token limits
      const recentMessages = previousMessages.slice(-6);
      
      const history = recentMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      // Enhanced system prompt with specific instructions for concise, focused responses
      let systemPrompt = "You are WasteWise, a waste management assistant with expertise in recycling and waste disposal. Follow these guidelines strictly:";
      systemPrompt += "\n1. Keep responses brief and focused on waste management only (1-3 sentences when possible)";
      systemPrompt += "\n2. Provide clear, actionable advice without flowery language";
      systemPrompt += "\n3. Format information in simple, easy-to-follow points";
      systemPrompt += "\n4. Focus on practical disposal methods that average people can implement";
      systemPrompt += "\n5. Never include lengthy disclaimers or irrelevant information";
      systemPrompt += "\n6. Never respond with generic greetings like 'Hello! How can I help?' to follow-up questions";
      
      // Add waste analysis context if available
      if (wasteInfo) {
        const wasteType = wasteInfo.type;
        const recyclability = wasteInfo.recyclable ? 'recyclable' : 'not recyclable';
        
        systemPrompt += `\n\nThe user has uploaded an image of ${wasteType}, which is ${recyclability}. When the user asks about "this" or "it", they are referring to the ${wasteType}. Focus your advice on this specific waste type and how to properly dispose of it.`;
      }
      
      // Prepare the request with specific generation parameters for concise responses
      const requestBody = {
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          ...history,
          { role: "user", parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 400,
          topP: 0.8,
          topK: 40
        }
      };
      
      console.log('Sending request to Gemini API:', JSON.stringify(requestBody));
      
      // Make the API request
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Received response from Gemini API:', response.data);
      
      // Extract and process the response text to ensure it's concise
      if (response.data.candidates && response.data.candidates.length > 0) {
        let responseText = response.data.candidates[0].content.parts[0].text;
        
        // Post-process to remove common verbose patterns
        responseText = responseText
          .replace(/^(Sure!|Of course!|I'd be happy to help!|Certainly!|Absolutely!|I understand\.|Let me help you with that\.|Great question!)/i, '')
          .replace(/^(Here's|Here is|Here are) (some|the) (information|details|advice|thoughts|insights):/i, '')
          .replace(/^(Based on the information provided,|According to my knowledge,|From what I understand,)/i, '')
          .replace(/I hope this helps!|Let me know if you have any other questions!|Feel free to ask if you need more information!/g, '')
          .trim();

        return responseText;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  // Simulated response function as a fallback
  const simulateGeminiResponse = async (message, wasteInfo, previousMessages) => {
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const messageLC = message.toLowerCase();
    
    // Generate a fallback message explaining the situation
    const fallbackPrefix = "I'm currently operating in fallback mode without API access. Based on your query about ";
    
    // Provide a basic fallback response
    if (messageLC.includes('earn') || messageLC.includes('money') || messageLC.includes('cash') || messageLC.includes('paid')) {
      if (wasteInfo) {
        return `${fallbackPrefix}earning money from recycling:\n\nSome materials like aluminum cans, scrap metal, and certain electronics may have monetary value at recycling centers. Check with local recycling facilities to see if they offer payment for ${wasteInfo.type}.`;
      }
      return `${fallbackPrefix}recycling for money:\n\nSome materials like aluminum cans, scrap metal, and certain electronics may have monetary value at recycling centers. Most curbside recycling programs don't offer direct payment to individuals.`;
    }
    
    // Check for recycling questions about the analyzed item
    if ((messageLC.includes('recycle') || messageLC.includes('how') || messageLC.includes('dispose')) && 
        (messageLC.includes('this') || messageLC.includes('it') || messageLC.includes(wasteInfo?.type))) {
      
      if (wasteInfo) {
        return `${fallbackPrefix}how to recycle ${wasteInfo.type}:\n\nThe general approach is to clean the item, remove any non-recyclable parts, and place it in the appropriate bin. Always check your local recycling guidelines for specific instructions.`;
      }
    }
    
    // General fallback response
    return `${fallbackPrefix}waste management:\n\nI'm operating without connection to the Gemini AI. For accurate information about recycling and waste disposal, please check your local waste management guidelines or try again when API access is restored.`;
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 flex flex-col h-[500px]">
      <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
        <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Waste Management Chat
        </h2>
        <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
          Step 3
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-stone-50 dark:bg-stone-700/20">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
            )}
            <div 
              className={`px-4 py-3 max-w-[75%] ${
                message.role === 'user' 
                  ? 'bg-amber-600 text-white rounded-t-lg rounded-l-lg ml-auto'
                  : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-t-lg rounded-r-lg shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-t-lg rounded-r-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-sm">
              <div className="flex space-x-2 h-4 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-60 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-80 animate-pulse delay-150"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question about waste disposal..."
            className="flex-1 py-2 px-4 text-sm bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 dark:placeholder-stone-500 text-stone-800 dark:text-stone-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className={`rounded-lg p-2 transition-colors focus:outline-none ${
              !inputMessage.trim() || isLoading
                ? 'bg-stone-200 text-stone-400 dark:bg-stone-700 dark:text-stone-500 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        
        <div className="mt-2.5 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Ask specific questions about waste disposal methods, recycling tips, and more
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat; 