'use client'

import { Box, Typography, Button } from '@mui/material';
import WaterIcon from '@mui/icons-material/Water';
import { useRouter } from 'next/navigation';

export default function Header({ showNavigation = true }) {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      bgcolor="#00BFFF" 
      color="white"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
    >
      <Box display="flex" alignItems="center">
        <WaterIcon sx={{ fontSize: 40, mr: 1 }} /> 
        <Typography variant="h6">Fierce Hydration</Typography>
      </Box>
      {showNavigation && (
        <Box display="flex" alignItems="center">
          <Button color="inherit" onClick={() => handleNavigation('/')}>Home</Button>
          <Button color="inherit" onClick={() => handleNavigation('/about')}>About</Button>
          <Button color="inherit" onClick={() => handleNavigation('/products')}>Products</Button>
          <Button color="inherit" onClick={() => handleNavigation('/contact')}>Contact</Button>
        </Box>
      )}
    </Box>
  );
}


