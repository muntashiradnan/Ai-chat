'use client'

import { Box, Button, Stack, TextField, Dialog, IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';

export default function ChatModal({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Fierce Hydration support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Header showNavigation={false} /> {/* No navigation in chat modal */}
      <Box
        display="flex"
        flexDirection="column"
        height="80vh"
        position="relative" 
      >
        {/* Chat Area */}
        <Stack
          direction={'column'}
          flexGrow={1}
          p={2}
          spacing={3}
          overflow="auto"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.light'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
                maxWidth="75%"
              >
                  {message.content.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex}>{line}</div>
                  ))}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        {/* Chat Input Area */}
        <Box
          p={2}
          bgcolor="grey.100"
          borderTop="1px solid grey"
          display="flex"
          alignItems="center"
        >
          <TextField
            label="Type your message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{ marginLeft: 2 }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Box>

        {/* Close Button */}
        <IconButton
          color="inherit"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Dialog>
  );
}
