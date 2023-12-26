import { Box, Grid, Button, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';

const Confirmation = () => {
  const navigate = useNavigate();
  const [dataFetched, setDataFetched] = useState(false);

  const handleBackToShopping = () => {
    navigate('/');
  };

  function getUrlParams(url) {
    const params = {};
    const urlParts = url.split('?');
    if (urlParts.length > 1) {
      const queryString = urlParts[1];
      const pairs = queryString.split('&');

      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value || '');
      }
    }

    return params;
  }

  useEffect(() => {
    // const paramsObject = getUrlParams(window.location.href);
    // if (paramsObject?.vnp_Amount && !dataFetched) {
    //   try {
    //     fetch('http://localhost:8080/api/payments/txn/capture', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         paymentMethod: 'vnpay',
    //         amount: paramsObject?.vnp_Amount / 100,
    //         currency: 'vnd',
    //         orderId: paramsObject?.vnp_TxnRef,
    //       }),
    //     });
    //     setDataFetched(true);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item={true} xs={8}>
        <Box m="90px auto" width="80%">
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            You have successfully made an Order —{' '}
            <strong>Congrats on Making your Purchase</strong>
          </Alert>
        </Box>
      </Grid>
      <Grid item={true} xs={12} sx={{ marginLeft: '90px' }} height="50vh">
        <Typography>Order Info</Typography>
      </Grid>
      <Grid item={true} xs={12} sx={{ marginLeft: '90px' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBackToShopping}
        >
          Continue shopping
        </Button>
      </Grid>
    </Grid>
  );
};

export default Confirmation;
