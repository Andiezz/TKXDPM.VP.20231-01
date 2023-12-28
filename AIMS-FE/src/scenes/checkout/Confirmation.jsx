import { Box, Button, Grid, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../state';

const Confirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCaptured, setIsCaptured] = useState(false);

  const handleBackToShopping = () => {
    navigate('/');
  };

  function getParamsObject(url) {
    const paramsString = url.split('?')[1];
    if (!paramsString) {
      return null;
    }
    const paramsArray = paramsString.split('&');

    const paramsObject = {};

    paramsArray.forEach((param) => {
      const [key, value] = param.split('=');
      paramsObject[key] = decodeURIComponent(value);
    });

    return paramsObject;
  }

  async function captureTransaction(vnpParams) {
    try {
      await fetch('http://localhost:8080/api/payments/txn/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: 'vnpay',
          amount: vnpParams?.vnp_Amount / 100,
          currency: 'vnd',
          orderId: vnpParams?.vnp_TxnRef,
        }),
      });
    } catch (e) {
      console.error(e);
    }
    dispatch(clearCart());
  }

  useEffect(() => {
    const paramsObject = getParamsObject(window.location.href);

    if (paramsObject?.vnp_Amount && !isCaptured) {
      captureTransaction(paramsObject);
      setIsCaptured(true);
    }
  }, []);

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
