import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Select, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      welcome: "Hello! I can help you book museum tickets. What would you like to do?",
      placeholder: "Type your message...",
      options: "You can ask about:\n1. Museum timings\n2. Ticket prices\n3. Book tickets\n4. Check availability",
      bookingPrompt: "Would you like to book tickets now? Please specify:\n- Number of tickets\n- Preferred date\n- Museum name",
      priceInfo: "Ticket Prices:\n- Adult: ₹50\n- Child: Free\n- Senior: ₹20",
    },
    hi: {
      welcome: "नमस्ते! मैं आपकी संग्रहालय टिकट बुक करने में मदद कर सकता हूं। आप क्या करना चाहेंगे?",
      placeholder: "अपना संदेश लिखें...",
      options: "आप पूछ सकते हैं:\n1. संग्रहालय का समय\n2. टिकट की कीमतें\n3. टिकट बुक करें\n4. उपलब्धता जांचें",
      bookingPrompt: "क्या आप अभी टिकट बुक करना चाहेंगे?",
      priceInfo: "टिकट की कीमतें:\n- वयस्क: ₹50\n- बच्चा: नि:शुल्क\n- वरिष्ठ नागरिक: ₹20",
    }
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
    const response = {
      text: processUserInput(userInput, language),
      sender: 'bot'
    };
    setTimeout(() => {
      setMessages(prev => [...prev, response]);
    }, 500);
  };

  const processUserInput = (input, lang) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('book') || lowerInput.includes('ticket')) {
      return translations[lang].bookingPrompt;
    }
    if (lowerInput.includes('price')) {
      return translations[lang].priceInfo;
    }
    return translations[lang].options;
  };

  useEffect(() => {
    if (isOpen) {
      setMessages([{ 
        text: translations[language].welcome,
        sender: 'bot' 
      }]);
    }
  }, [isOpen, language]);

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