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

  const handleBotResponse = (userInput) => {
    setIsTyping(true);

    const responseText = processUserInput(userInput, language);
    const responseLength = responseText.length;
    const baseDelay = 500;
    const typingSpeed = 15;
    const responseTime = Math.min(baseDelay + responseLength * typingSpeed, 3000);

    setTimeout(() => {
      setIsTyping(false);
      const response = { text: responseText, sender: 'bot' };
      setMessages(prev => [...prev, response]);
      generateSuggestions(userInput, responseText);
    }, responseTime);
  };

  const processUserInput = (input, lang) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("my name is") || lowerInput.includes("i am ")) {
      const nameMatch = input.match(/my name is\s+([A-Za-z\s]+)|i am\s+([A-Za-z\s]+)/i);
      if (nameMatch) {
        const name = nameMatch[1] || nameMatch[2];
        setUserInfo(prev => ({...prev, name: name.trim()}));
        return `Nice to meet you, ${name.trim()}! How can I help with your museum visit?`;
      }
    }

    const emailMatch = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      setUserInfo(prev => ({...prev, email: emailMatch[0]}));
      return `Thank you! I've noted your email address. Would you like to receive ticket confirmation at this email?`;
    }

    const contextFromHistory = getConversationContext();

    if (contextFromHistory === 'booking') {
      switch(bookingStep) {
        case 'quantity':
          const adults = input.match(/(\d+)\s*adult/i);
          const children = input.match(/(\d+)\s*child/i);
          const seniors = input.match(/(\d+)\s*senior/i);
          const anyNumber = input.match(/\b(\d+)\b/);

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
            return "Great! For which date would you like to book your tickets?";
          }
          return "Please specify how many tickets you need (e.g., '2 adults, 1 child')";

        case 'date':
          const dateMatch = input.match(/(\d+\/\d+\/\d+)|today|tomorrow|next\s+\w+|this\s+\w+/i);
          if (dateMatch || lowerInput.includes('today') || lowerInput.includes('tomorrow')) {
            setUserInfo(prev => ({...prev, visitDate: dateMatch ? dateMatch[0] : input}));
            setBookingStep('museum');
            return "Perfect! Which museum would you like to visit?";
          }
          return "Please specify a date for your visit (e.g., DD/MM/YYYY or 'tomorrow')";

        case 'museum':
          setUserInfo(prev => ({...prev, preferredMuseum: input}));
          setBookingStep('confirmation');
          const price = calculatePrice(userInfo.ticketQuantity);
          return `Thank you! Here's your booking summary:\n
          - Museum: ${input}
          - Date: ${userInfo.visitDate}
          - Tickets: ${formatTickets(userInfo.ticketQuantity)}
          - Total price: ₹${price}
          
          Would you like to confirm this booking?`;

        case 'confirmation':
          if (lowerInput.includes('yes') || lowerInput.includes('confirm') || lowerInput.includes('ok')) {
            setBookingStep(null);
            setConversationContext(null);
            return `Booking confirmed! You'll receive a confirmation email${userInfo.email ? ' at ' + userInfo.email : ' shortly'}. Your booking reference is: MUS-${Math.floor(100000 + Math.random() * 900000)}.\n\n${getPersonalizedGreeting()}`;
          } else {
            setBookingStep(null);
            setConversationContext(null);
            return "Booking cancelled. Feel free to start a new booking whenever you're ready.";
          }

        default:
          setBookingStep('quantity');
          return "How many tickets would you like to book? (adults, children, seniors)";
      }
    }

    // Fix 1: Expanded keyword match for timing-related queries
    if (
      lowerInput.includes('time') ||
      lowerInput.includes('hour') ||
      lowerInput.includes('open') ||
      lowerInput.includes('timing') ||
      lowerInput.includes('schedule')
    ) {
      return `The museum is open from 9:00 AM to 5:00 PM Tuesday through Sunday. We're closed on Mondays.`;
    }

    // Fix 2: Handle student-related price questions
    if (lowerInput.includes('student')) {
      return `Currently, there is no separate pricing for students. Ticket rates are:\n- Adult: ₹50\n- Child: Free\n- Senior: ₹20`;
    }

    if (lowerInput.includes('book') || lowerInput.includes('ticket') || lowerInput.includes('reserve')) {
      setConversationContext('booking');
      setBookingStep('quantity');
      return translations[lang].bookingPrompt;
    }

    if (lowerInput.includes('exhibit') || lowerInput.includes('display') || lowerInput.includes('show')) {
      return `We currently have these exciting exhibitions:\n- Ancient Civilizations Gallery\n- Modern Art Exhibition\n- Natural History Wing\n- Interactive Science Displays\n\nWhich one interests you the most?`;
    }

    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('fee')) {
      return translations[lang].priceInfo;
    }

    if (lowerInput.includes('hello') || lowerInput.includes('hi ') || lowerInput === 'hi') {
      return `Hello${userInfo.name ? ' ' + userInfo.name : ''}! How can I help you with your museum visit today?`;
    }

    if (lowerInput.includes('thank')) {
      return `You're welcome${userInfo.name ? ' ' + userInfo.name : ''}! Is there anything else I can help you with?`;
    }

    return `I'm not sure I understand. ${translations[lang].options}`;
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
