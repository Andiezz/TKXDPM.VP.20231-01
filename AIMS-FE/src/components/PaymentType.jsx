import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentType = ({ order }) => {
  const paypal = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.paypal || paypal.current.innerHTML.trim() !== '') {
      return;
    }

    window.paypal
      .Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'pill',
        },
        createOrder: async function () {
          try {
            const response = await fetch(
              'http://localhost:8080/api/payments/checkout',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: Date.now().toString(),
                  paymentMethod: 'paypal',
                  amount: '500000',
                  currency: 'vnd',
                }),
              }
            );

            if (!response.ok) {
              const errorJson = await response.json();
              throw new Error(errorJson.error);
            }

            const resp = await response.json();
            return resp.data.result;
          } catch (error) {
            console.error(error.message);
          }
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();

          try {
            await fetch('http://localhost:8080/api/payments/txn/capture', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentMethod: 'paypal',
                amount: order?.purchase_units[0]?.amount?.value,
                currency: 'usd',
                orderId: order?.purchase_units[0]?.reference_id,
                captureId: order?.purchase_units[0]?.payments.captures[0]?.id,
              }),
            });
          } catch (e) {
            console.error(e);
          }
          navigate('/checkout/success');
        },
        onError: (err) => {
          console.error(err);
        },
      })
      .render(paypal.current);
  }, []);

  async function handleVNPayPayment() {
    try {
      const resp = await fetch('http://localhost:8080/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: 'vnpay',
          amount: '250000',
          currency: 'vnd',
          orderId: Date.now().toString(),
        }),
      });

      // Check if the request was successful (status code 2xx)
      if (!resp.ok) {
        throw new Error(`Error: ${resp.status} - ${resp.statusText}`);
      }

      // Parse the JSON response
      const { data } = await resp.json();
      const paymentUrl = data.result;
      // Capture Transaction
      await fetch('http://localhost:8080/api/payments/txn/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: 'vnpay',
          amount: '250000',
          currency: 'vnd',
          orderId: Date.now().toString(),
        }),
      });
      // Redirect the user to the payment URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ marginBottom: '25px', marginTop: '25px' }}
      >
        <Grid xs={8} item={true}>
          <Typography>Order Infos</Typography>
        </Grid>
        <Grid
          item={true}
          xs={4}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography sx={{ marginBottom: '10px' }}>Payment Method</Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#0063cc',
              boxShadow: 'none',
              color: 'white',
              fontSize: '18px',
              borderRadius: 10,
              padding: '8px 40px',
              marginBottom: '14px',
            }}
            onClick={handleVNPayPayment}
          >
            VN Pay
          </Button>
          <div style={{ width: '100%' }} ref={paypal}></div>
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentType;
