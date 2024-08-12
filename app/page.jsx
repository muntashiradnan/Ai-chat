'use client'

import { Box, Typography, Button } from '@mui/material';
import { useState } from 'react';
import Header from './components/Header';
import ChatModal from './components/ChatModal';

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Header Component */}
      <Header showNavigation={true} />

      {/* Main Content */}
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#E0FFFF" 
        p={3}
      >
        <Typography variant="h4" color="#4682B4">Welcome to Fierce Hydration</Typography>
        <Typography variant="body1" color="#4682B4" mt={2}>
          Learn about the importance of hydration, benefits of water, and tips for maintaining proper water intake.
        </Typography>
      </Box>

      {/* Chat Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          borderRadius: '50%',
          width: 56,
          height: 56,
          bgcolor: '#00BFFF', 
          color: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        💧 
      </Button>

      {/* Chat Modal */}
      <ChatModal open={open} onClose={handleClose} />
    </Box>
  );
}



