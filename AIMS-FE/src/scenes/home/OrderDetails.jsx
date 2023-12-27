import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import { ORDER_STATUS } from '../../constants/status';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const navigate = useNavigate();

  async function getOrder() {
    const response = await fetch(`http://localhost:8080/api/order/${orderId}`, {
      method: 'GET',
    });
    const orderJson = await response.json();
    setOrder(orderJson.data);
  }

  async function refund() {
    try {
      await fetch(`http://localhost:8080/api/payments/refund/${orderId}`, {
        method: 'POST',
      });
    } catch (e) {
      console.error(e);
    }

    window.location.reload();
  }

  const handleRefund = () => {
    refund();
  };

  const handleBackToShopping = () => {
    navigate('/');
  };

  function capitalizeFirstLetter(str) {
    if (!str) {
      return '_';
    }
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }

  function getKeyByValue(value) {
    return Object.keys(ORDER_STATUS).find((key) => ORDER_STATUS[key] === value);
  }
  useEffect(() => {
    getOrder();
  }, []);

  return (
    <Box width="80%" m="100px auto">
      {order && (
        <Grid container spacing={4}>
          <Grid xs={12} item={true}>
            <Alert severity="success" sx={{ marginBottom: '10px' }}>
              <AlertTitle>Success</AlertTitle>
              You have successfully made an Order —{' '}
              <strong>Congrats on Making your Purchase</strong>
            </Alert>
          </Grid>
          <Grid item={true} xs={6}>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Typography variant="h2" fontWeight="bold">
                Order Details
              </Typography>
              <Stack direction="row" justifyContent={'space-between'}>
                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '350px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    ORDER NUMBER
                  </Typography>
                  <Typography variant="h7">{orderId}</Typography>
                </Stack>

                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '400px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    ORDER STATUS
                  </Typography>
                  <Typography variant="h7">
                    {getKeyByValue(order?.Order_info?.status)}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent={'space-between'}>
                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '350px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    NAME
                  </Typography>
                  <Typography variant="h7">
                    {order?.Order_info?.deliveryInfo?.name}
                  </Typography>
                </Stack>

                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '400px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    CONTACT
                  </Typography>
                  <Typography variant="h7">
                    {order?.Order_info?.deliveryInfo?.email}
                  </Typography>
                  <Typography variant="h7">
                    {order?.Order_info?.deliveryInfo?.phone}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent={'space-between'}>
                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '350px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    DELIVERY ADDRESS
                  </Typography>
                  <Typography variant="h7" maxWidth={'200px'}>
                    {[
                      order?.Order_info?.deliveryInfo?.address,
                      order?.Order_info?.deliveryInfo?.district,
                      order?.Order_info?.deliveryInfo?.province,
                    ].join(', ')}
                  </Typography>
                </Stack>

                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '400px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    DELIVERY OPTION
                  </Typography>
                  <Typography variant="h7">
                    {capitalizeFirstLetter(
                      order?.Order_info?.deliveryInfo?.deliveryMethod
                    )}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent={'space-between'}>
                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '350px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    ORDER DATE
                  </Typography>
                  <Typography variant="h7">
                    {new Date(
                      order?.Order_info?.deliveryInfo?.createdAt
                    ).toLocaleString()}
                  </Typography>
                </Stack>

                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '400px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    PAYMENT METHOD
                  </Typography>
                  <Typography variant="h7" maxWidth={'200px'}>
                    {capitalizeFirstLetter(
                      order?.Order_info?.transaction?.paymentMethod
                    )}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent={'space-between'}>
                <Stack
                  direction="column"
                  spacing={1}
                  justifyContent={'flex-start'}
                  sx={{ width: '350px' }}
                >
                  <Typography variant="h7" fontWeight="bold">
                    EXPECTED ARRIVAL
                  </Typography>
                  <Typography variant="h7">
                    {new Date(
                      order?.Order_info?.deliveryInfo?.time
                    ).toLocaleString()}
                  </Typography>
                </Stack>

                {order?.Order_info?.transaction && (
                  <Stack
                    direction="column"
                    spacing={1}
                    justifyContent={'flex-start'}
                    sx={{ width: '400px' }}
                  >
                    <Typography variant="h7" fontWeight="bold">
                      TRANSACTION
                    </Typography>
                    <Typography variant="h7" maxWidth={'200px'}>
                      {`${order?.Order_info?.transaction?.amount.toLocaleString()} ${order?.Order_info?.transaction?.currency.toUpperCase()}`}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item={true} xs={6}>
            <Stack spacing={2}>
              <Typography variant="h2" fontWeight="bold">
                Order Summary
              </Typography>
              <Paper
                sx={{ backgroundColor: '#ecebeb', padding: '30px' }}
                elevation={0}
                square
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent={'space-between'}>
                    <Typography variant="h7" fontWeight="bold">
                      ITEMS
                    </Typography>
                    <Typography variant="h7" fontWeight="bold">
                      PRICE
                    </Typography>
                  </Stack>
                  <Divider />
                  {order?.Order_info?.listProductRush.map((v) => (
                    <Stack direction="row" justifyContent={'space-between'}>
                      <Typography variant="h7">
                        {v?.productId?.title} x {v?.quantity}
                      </Typography>
                      <Typography variant="h7">
                        {Number(v?.productId?.price).toLocaleString()} VND
                      </Typography>
                    </Stack>
                  ))}

                  {order?.Order_info?.listProductNormal.map((v) => (
                    <Stack direction="row" justifyContent={'space-between'}>
                      <Typography variant="h7">
                        {v?.productId?.title}
                      </Typography>
                      <Typography variant="h7">
                        {Number(v?.productId?.price).toLocaleString()} VND
                      </Typography>
                    </Stack>
                  ))}

                  <Divider />
                  <Stack direction="row" justifyContent={'space-between'}>
                    <Typography variant="h7" fontWeight="bold">
                      SHIPPING
                    </Typography>
                    <Typography variant="h7">
                      {Number(order?.Order_info?.shippingCost).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent={'space-between'}>
                    <Typography variant="h7" fontWeight="bold">
                      SUBTOTAL
                    </Typography>
                    <Typography variant="h7">
                      {Number(order?.Order_info?.totalPrice).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent={'space-between'}>
                    <Typography variant="h7" fontWeight="bold">
                      VAT
                    </Typography>
                    <Typography variant="h7">
                      {Number(
                        order?.Order_info?.totalPriceVAT
                      ).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent={'space-between'}>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color={'secondary'}
                    >
                      TOTAL
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color={'secondary'}
                    >
                      {Number(order?.Order_info?.totalAmount).toLocaleString()}{' '}
                      VND
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          <Grid xs={12} sx={{ marginTop: '40px' }}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBackToShopping}
                sx={{ marginLeft: '20px', width: '200px', height: '50px' }}
              >
                Continue shopping
              </Button>

              {order?.Order_info.status == ORDER_STATUS.PAID && (
                <Button
                  variant="contained"
                  sx={{ width: '200px', height: '50px' }}
                  onClick={handleRefund}
                >
                  Refund
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      )}
      {!order && (
        <>
          <Typography variant="h1" sx={{ marginBottom: '100px' }}>
            Order not found
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBackToShopping}
            sx={{ marginLeft: '20px', width: '200px', height: '50px' }}
          >
            Continue shopping
          </Button>
        </>
      )}
    </Box>
  );
};

export default OrderDetails;
