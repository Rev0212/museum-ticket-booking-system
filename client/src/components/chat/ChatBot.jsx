import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [conversationContext, setConversationContext] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: null,
    email: null,
    phoneNumber: null,
    preferredMuseum: null,
    ticketQuantity: null,
    visitDate: null
  });
  const [bookingStep, setBookingStep] = useState(null);

  const translations = {
    en: {
      welcome: "Hello! I'm your virtual museum assistant. How can I help you today?",
      placeholder: "Type your message...",
      options: "You can ask about:\n1. Museum timings\n2. Ticket prices\n3. Book tickets\n4. Check availability\n5. Exhibition details",
      bookingPrompt: "I'd be happy to help you book tickets! Could you please specify:\n- How many adults, children or seniors?\n- Which date are you planning to visit?\n- Which museum are you interested in?",
      priceInfo: "Ticket Prices:\n- Adult: ₹50\n- Child: Free\n- Senior: ₹20",
      thinking: "Thinking..."
    },
    hi: {
      welcome: "नमस्ते! मैं आपकी संग्रहालय टिकट बुक करने में मदद कर सकता हूं। आप क्या करना चाहेंगे?",
      placeholder: "अपना संदेश लिखें...",
      options: "आप पूछ सकते हैं:\n1. संग्रहालय का समय\n2. टिकट की कीमतें\n3. टिकट बुक करें\n4. उपलब्धता जांचें",
      bookingPrompt: "क्या आप अभी टिकट बुक करना चाहेंगे?",
      priceInfo: "टिकट की कीमतें:\n- वयस्क: ₹50\n- बच्चा: नि:शुल्क\n- वरिष्ठ नागरिक: ₹20",
      thinking: "सोच रहा हूँ..."
    }
  };

  useEffect(() => {
    if (isOpen) {
      setMessages([{ 
        text: translations[language].welcome,
        sender: 'bot' 
      }]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      handleBotResponse(input);
      setInput('');
    }
  };

  const callOllamaAPI = async (userMessage) => {
    try {
      const endpoint = 'https://1hl9rpqb-11434.inc1.devtunnels.ms/api/generate';
      
      const context = messages.slice(-5).map(msg => {
        return `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`;
      }).join('\n');

      const systemPrompt = `You are a helpful museum virtual assistant for the Museum Ticket Booking System. 
      You provide information about museum timings, ticket prices, exhibitions, and help with bookings.
      Respond in ${language === 'en' ? 'English' : 'Hindi'}.
      Today's date is ${new Date().toLocaleDateString()}.
      Keep your responses concise, friendly and helpful.
      
      Information you should know:
      - Adult tickets cost ₹50
      - Children enter for free
      - Senior tickets cost ₹20
      - Museums are typically open from 9:00 AM to 5:00 PM Tuesday through Sunday, closed on Mondays
      - Current exhibitions include: Ancient Civilizations Gallery, Modern Art Exhibition, Natural History Wing, and Interactive Science Displays`;
      
      const prompt = `${systemPrompt}\n\n${context}\nUser: ${userMessage}\nAssistant:`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3', 
          prompt: prompt,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "Sorry, I couldn't process your request.";
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      return "I'm having trouble connecting to my knowledge base. Please try again later.";
    }
  };

  const handleBotResponse = async (userInput) => {
    setIsTyping(true);

    try {
      let responseText;
      const lowerInput = userInput.toLowerCase();
      
      if (conversationContext === 'booking' && bookingStep) {
        switch(bookingStep) {
          case 'quantity':
            const adults = userInput.match(/(\d+)\s*adult/i);
            const children = userInput.match(/(\d+)\s*child/i);
            const seniors = userInput.match(/(\d+)\s*senior/i);
            const anyNumber = userInput.match(/\b(\d+)\b/);

            if (adults || children || seniors || anyNumber) {
              setUserInfo(prev => ({
                ...prev, 
                ticketQuantity: {
                  adults: adults ? parseInt(adults[1]) : (anyNumber ? parseInt(anyNumber[1]) : 0),
                  children: children ? parseInt(children[1]) : 0,
                  seniors: seniors ? parseInt(seniors[1]) : 0
                }
              }));
              setBookingStep('date');
              responseText = "Great! For which date would you like to book your tickets?";
            } else {
              responseText = "Please specify how many tickets you need (e.g., '2 adults, 1 child')";
            }
            break;

          case 'date':
            const dateMatch = userInput.match(/(\d+\/\d+\/\d+)|today|tomorrow|next\s+\w+|this\s+\w+/i);
            if (dateMatch || lowerInput.includes('today') || lowerInput.includes('tomorrow')) {
              setUserInfo(prev => ({...prev, visitDate: dateMatch ? dateMatch[0] : userInput}));
              setBookingStep('museum');
              responseText = "Perfect! Which museum would you like to visit?";
            } else {
              responseText = "Please specify a date for your visit (e.g., DD/MM/YYYY or 'tomorrow')";
            }
            break;

          case 'museum':
            setUserInfo(prev => ({...prev, preferredMuseum: userInput}));
            setBookingStep('confirmation');
            const price = calculatePrice(userInfo.ticketQuantity);
            responseText = `Thank you! Here's your booking summary:\n
            - Museum: ${userInput}
            - Date: ${userInfo.visitDate}
            - Tickets: ${formatTickets(userInfo.ticketQuantity)}
            - Total price: ₹${price}
            
            Would you like to confirm this booking?`;
            break;

          case 'confirmation':
            if (lowerInput.includes('yes') || lowerInput.includes('confirm') || lowerInput.includes('ok')) {
              setBookingStep(null);
              setConversationContext(null);
              responseText = `Booking confirmed! You'll receive a confirmation email${userInfo.email ? ' at ' + userInfo.email : ' shortly'}. Your booking reference is: MUS-${Math.floor(100000 + Math.random() * 900000)}.\n\n${getPersonalizedGreeting()}`;
            } else {
              setBookingStep(null);
              setConversationContext(null);
              responseText = "Booking cancelled. Feel free to start a new booking whenever you're ready.";
            }
            break;

          default:
            setBookingStep('quantity');
            responseText = "How many tickets would you like to book? (adults, children, seniors)";
        }
      } else {
        responseText = await callOllamaAPI(userInput);
        
        if (lowerInput.includes('book') || lowerInput.includes('ticket') || lowerInput.includes('reserve')) {
          setConversationContext('booking');
          setBookingStep('quantity');
          responseText = translations[language].bookingPrompt;
        }

        const emailMatch = userInput.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          setUserInfo(prev => ({...prev, email: emailMatch[0]}));
        }

        if (lowerInput.includes("my name is") || lowerInput.includes("i am ")) {
          const nameMatch = userInput.match(/my name is\s+([A-Za-z\s]+)|i am\s+([A-Za-z\s]+)/i);
          if (nameMatch) {
            const name = nameMatch[1] || nameMatch[2];
            setUserInfo(prev => ({...prev, name: name.trim()}));
          }
        }
      }

      setIsTyping(false);
      const response = { text: responseText, sender: 'bot' };
      setMessages(prev => [...prev, response]);
      generateSuggestions(userInput, responseText);
    } catch (err) {
      console.error('Error in bot response:', err);
      setIsTyping(false);
      const errorMessage = { 
        text: "I'm having trouble processing your request right now. Please try again later.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const getConversationContext = () => conversationContext;
  const getPersonalizedGreeting = () => userInfo.name ? `How else can I help you today, ${userInfo.name}?` : "How else can I help you today?";
  const calculatePrice = (quantity) => !quantity ? 0 : (quantity.adults || 0) * 50 + (quantity.children || 0) * 0 + (quantity.seniors || 0) * 20;

  const formatTickets = (quantity) => {
    if (!quantity) return "No tickets";
    const parts = [];
    if (quantity.adults) parts.push(`${quantity.adults} adult${quantity.adults > 1 ? 's' : ''}`);
    if (quantity.children) parts.push(`${quantity.children} child${quantity.children > 1 ? 'ren' : ''}`);
    if (quantity.seniors) parts.push(`${quantity.seniors} senior${quantity.seniors > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const generateSuggestions = (userInput, botResponse) => {
    const lowerInput = userInput.toLowerCase();
    if (botResponse.includes("book tickets") || botResponse.includes("specify")) {
      setSuggestions(["2 adults, 1 child", "Museum timings?", "What are the prices?"]);
    } else if (botResponse.includes("exhibition") || botResponse.includes("display")) {
      setSuggestions(["Tell me about Ancient Civilizations", "Interactive Science Displays", "Ticket prices"]);
    } else if (botResponse.includes("date")) {
      setSuggestions(["Tomorrow", "Next Saturday", "10/05/2025"]);
    } else if (botResponse.includes("museum")) {
      setSuggestions(["National Museum", "Art Gallery", "Science Museum"]);
    } else {
      setSuggestions(["Book tickets", "Opening hours", "Current exhibitions"]);
    }
  };

  return (
    <>
      {!isOpen ? (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <ChatIcon />
        </IconButton>
      ) : (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 320,
            height: 450,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000
          }}
        >
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">Chat Support</Typography>
            <Box>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                size="small"
                sx={{ mr: 1, color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिंदी</MenuItem>
              </Select>
              <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  p: 1,
                  px: 2,
                  borderRadius: 2,
                  maxWidth: '80%'
                }}
              >
                <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                  {message.text}
                </Typography>
              </Box>
            ))}

            {isTyping && (
              <Box
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: 'grey.100',
                  p: 1,
                  px: 2,
                  borderRadius: 2,
                  maxWidth: '80%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2">
                  {translations[language].thinking}
                </Typography>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={translations[language].placeholder}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton onClick={handleSend} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatBot;
