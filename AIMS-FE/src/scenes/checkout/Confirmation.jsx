import { Box, Grid, Button, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';

const Confirmation = () => {
  const navigate = useNavigate();

  const handleBackToShopping = () => {
    navigate('/');
  };

  return (
    <Grid container spacing={2}>
      <Grid item={true} xs={8}>
        <Box m="90px auto" width="80%">
          <Alert severity="success" sx={{ marginBottom: '80px' }}>
            <AlertTitle>Success</AlertTitle>
            You have successfully made an Order —{' '}
            <strong>Congrats on Making your Purchase</strong>
          </Alert>
          <Typography variant="h2" height={'120px'} sx={{ marginLeft: '20px' }}>
            Please check your email for more informations !
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBackToShopping}
            sx={{ marginLeft: '20px' }}
          >
            Continue shopping
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Confirmation;
