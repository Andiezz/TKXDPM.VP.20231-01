import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Stack,
} from '@mui/material';
import { Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { shades } from '../../theme';
import Contact from './Contact';
import PaymentType from '../../components/PaymentType';
import Shipping from './Shipping';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
// const stripePromise = loadStripe(
//   "pk_test_51LgU7yConHioZHhlAcZdfDAnV9643a7N1CMpxlKtzI1AUWLsRyrord79GYzZQ6m8RzVnVQaHsgbvN1qSpiDegoPi006QkO0Mlc"
// );

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const cart = useSelector((state) => state.cart.cart);
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;
  const isFinalStep = activeStep === 2;

  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1);
    // this copies the billing address onto shipping address
    if (isFirstStep && values.shippingAddress.isSameAddress) {
      actions.setFieldValue('shippingAddress', {
        ...values.billingAddress,
        isSameAddress: true,
      });
    }

    if (isSecondStep) {
      setOrder(values);
      // createOrder(values);
    }

    if (isFinalStep) {
      navigate('/');
    }

    actions.setTouched({});
  };

  async function createOrder(values) {
    // API CREATE ORDER
    const stripe = await stripePromise;
    const requestBody = {
      userName: [values.firstName, values.lastName].join(' '),
      email: values.email,
      products: cart.map(({ id, count }) => ({
        id,
        count,
      })),
    };

    const response = await fetch('http://localhost:2000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    // const session = await response.json();
    // await stripe.redirectToCheckout({
    //   sessionId: session.id,
    // });
  }

  return (
    <Box width="80%" m="100px auto">
      <Stepper activeStep={activeStep} sx={{ m: '20px 0' }}>
        <Step>
          <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
          <StepLabel>Contact</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>
      <Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema[activeStep]}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              {isFirstStep && (
                <Shipping
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              {isSecondStep && (
                <Contact
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              {isFinalStep && <PaymentType order={order} />}
              <Divider variant="middle" />
              <Stack
                direction="row"
                alignItems="center"
                sx={{ marginTop: '25px' }}
                justifyContent="space-between"
              >
                <Grid item={true}>
                  {!isFirstStep && (
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      sx={{
                        backgroundColor: shades.primary[200],
                        boxShadow: 'none',
                        color: 'white',
                        borderRadius: 0,
                        padding: '15px 40px',
                      }}
                      onClick={() => setActiveStep(activeStep - 1)}
                    >
                      Back
                    </Button>
                  )}
                </Grid>
                <Grid item={true}>
                  <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{
                      justifyItems: 'right',
                      backgroundColor: shades.primary[400],
                      boxShadow: 'none',
                      color: 'white',
                      borderRadius: 0,
                      padding: '15px 40px',
                    }}
                  >
                    {isFirstStep && 'Next'}
                    {isSecondStep && 'Place Order'}
                    {isFinalStep && 'Cancel'}
                  </Button>
                </Grid>
              </Stack>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const initialValues = {
  billingAddress: {
    firstName: '',
    lastName: '',
    country: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
  },
  shippingAddress: {
    isSameAddress: true,
    firstName: '',
    lastName: '',
    country: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
  },
  email: '',
  phoneNumber: '',
};

const checkoutSchema = [
  yup.object().shape({
    billingAddress: yup.object().shape({
      firstName: yup.string().required('required'),
      lastName: yup.string().required('required'),
      country: yup.string().required('required'),
      street1: yup.string().required('required'),
      street2: yup.string(),
      city: yup.string().required('required'),
      state: yup.string().required('required'),
      zipCode: yup.string().required('required'),
    }),
    shippingAddress: yup.object().shape({
      isSameAddress: yup.boolean(),
      firstName: yup.string().when('isSameAddress', {
        is: false,
        then: yup.string().required('required'),
      }),
      lastName: yup.string().when('isSameAddress', {
        is: false,
        then: yup.string().required('required'),
      }),
      country: yup.string().when('isSameAddress', {
        is: false,
        then: yup.string().required('required'),
      }),
      street1: yup.string().when('isSameAddress', {
        is: false,
        then: yup.string().required('required'),
      }),
      street2: yup.string(),
      city: yup.string().when('isSameAddress', {
        is: false,
        then: yup.string().required('required'),
      }),
      state: yup.string().when('isSameAddress', {
        is: false,
        then: yup.string().required('required'),
      }),
      zipCode: yup.string().when('isSameAddress', {
        is: false,
        then: yup.string().required('required'),
      }),
    }),
  }),
  yup.object().shape({
    email: yup.string().required('required'),
    phoneNumber: yup.string().required('required'),
  }),
];

export default Checkout;
