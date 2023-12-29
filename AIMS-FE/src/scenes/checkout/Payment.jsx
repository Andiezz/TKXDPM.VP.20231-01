import { Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../state';

const Payment = ({ invoice }) => {
  const paypal = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
                  orderId: invoice?.orderId,
                  paymentMethod: 'paypal',
                  amount: invoice?.totalAmount,
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
          dispatch(clearCart());
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
          amount: invoice?.totalAmount.toFixed(),
          currency: 'vnd',
          orderId: invoice?.orderId,
        }),
      });

      // Check if the request was successful (status code 2xx)
      if (!resp.ok) {
        throw new Error(`Error: ${resp.status} - ${resp.statusText}`);
      }

      // Parse the JSON response
      const { data } = await resp.json();
      const paymentUrl = data.result;

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
        <Grid item={true} xs={6} container direction="column">
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            width="500px"
          >
            <Typography
              variant="h2"
              sx={{ marginBottom: '40px' }}
              fontWeight="bold"
            >
              Payment Method
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#0063cc',
                boxShadow: 'none',
                color: 'white',
                fontSize: '22px',
                borderRadius: 10,
                padding: '8px 40px',
                marginBottom: '14px',
              }}
              onClick={handleVNPayPayment}
            >
              VN Pay
            </Button>
            <div style={{ width: '100%', zIndex: '0' }} ref={paypal}></div>
          </Stack>
        </Grid>
        <Grid xs={6} item={true} sx={{ marginBottom: '20px' }}>
          <Stack alignItems={'flex-end'}>
            <Stack direction="column" spacing={2}>
              <Typography
                variant="h2"
                sx={{ marginBottom: '40px' }}
                fontWeight="bold"
              >
                Invoice
              </Typography>
              <Paper
                sx={{ backgroundColor: '#ecebeb', padding: '30px' }}
                elevation={0}
                square
              >
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7" bo>
                      Order No:{' '}
                    </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {invoice?.orderId}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7" bo>
                      Name:{' '}
                    </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {invoice?.deliveryInfoDetail?.name}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">Email: </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {invoice?.deliveryInfoDetail?.email}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">Phone: </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {invoice?.deliveryInfoDetail?.phone}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">Address: </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {[
                        invoice?.deliveryInfoDetail?.address,
                        invoice?.deliveryInfoDetail?.district,
                        invoice?.deliveryInfoDetail?.province,
                      ].join(', ')}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">Delivery option: </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {invoice?.deliveryInfoDetail?.deliveryMethod}
                    </Typography>
                  </Stack>
                  {invoice?.deliveryInfoDetail?.time && (
                    <Stack
                      direction="row"
                      spacing={4}
                      justifyContent={'space-between'}
                      sx={{ width: '550px' }}
                    >
                      <Typography variant="h7">Expected arrival: </Typography>
                      <Typography variant="h7" fontWeight="bold">
                        {new Date(
                          invoice?.deliveryInfoDetail?.time
                        ).toLocaleString()}
                      </Typography>
                    </Stack>
                  )}
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">Date: </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {new Date(
                        invoice?.deliveryInfoDetail?.createdAt
                      ).toLocaleString()}
                    </Typography>
                  </Stack>

                  <Divider sx={{ width: '550px' }} />
                  {invoice?.listProduct.map((item) => (
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      sx={{ width: '550px' }}
                      key={item._id}
                    >
                      <Typography variant="h7">
                        {item?.productDetail?.title} x {item?.quantity}{' '}
                      </Typography>
                      {item?.productDetail?.supportRush && <BoltIcon />}

                      <Typography variant="h7" fontWeight="bold">
                        {Number(
                          item.productDetail?.price.toFixed() * item?.quantity
                        ).toLocaleString()}{' '}
                        VND
                      </Typography>
                    </Stack>
                  ))}
                  <Divider sx={{ width: '550px' }} />
                  <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">Shipping </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {Number(invoice?.shippingCost.toFixed()).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">Subtotal </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {Number(invoice?.totalPrice.toFixed()).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography variant="h7">VAT </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      {Number(
                        invoice?.totalPriceVAT.toFixed()
                      ).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>
                  <Divider sx={{ width: '550px' }} />

                  <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    sx={{ width: '550px' }}
                  >
                    <Typography
                      variant="h3"
                      color={'secondary'}
                      fontWeight="bold"
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="h3"
                      color={'secondary'}
                      fontWeight="bold"
                    >
                      {Number(invoice?.totalAmount.toFixed()).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Payment;
