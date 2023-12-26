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
import Payment from './Payment';
import Shipping from './Shipping';
import { useNavigate } from 'react-router-dom';
// const stripePromise = loadStripe(
//   "pk_test_51LgU7yConHioZHhlAcZdfDAnV9643a7N1CMpxlKtzI1AUWLsRyrord79GYzZQ6m8RzVnVQaHsgbvN1qSpiDegoPi006QkO0Mlc"
// );

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const [order, setOrder] = useState({});
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;
  const isFinalStep = activeStep === 2;

  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1);

    if (isFirstStep) {
      // console.log(values);
    }

    if (isSecondStep) {
      const response = await createOrder(values);
      setOrder(values);
    }

    if (isFinalStep) {
      navigate('/');
    }

    actions.setTouched({});
  };

  async function createOrder(values) {
    // API CREATE ORDER
    const requestBody = {
      listProductId: cart.map(({ id, count }) => ({
        productId: id,
        quantity: count,
      })),
      deliveryInfo: {
        name: [
          values?.deliveryInfo?.firstName,
          values?.deliveryInfo?.lastName,
        ].join(' '),
        email: values.email,
        phone: values.phoneNumber,
        address: values?.deliveryInfo?.address,
        province: values?.deliveryInfo?.province,
        district: values?.deliveryInfo?.district,
        instructions: values?.deliveryInfo?.instructions,
        time: values?.deliveryInfo?.time,
        deliveryMethod: values?.deliveryInfo?.isRushDelivery
          ? 'rush'
          : 'normal',
      },
    };

    console.log(requestBody);

    const response = await fetch('http://localhost:8080/api/order/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
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
              {isFinalStep && <Payment order={order} />}
              {/* <Divider variant="middle" /> */}
              <Stack
                direction="row"
                alignItems="center"
                sx={{ marginTop: '25px' }}
                justifyContent="right "
              >
                {/* <Grid item={true}>
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
                </Grid> */}
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
  deliveryInfo: {
    firstName: '',
    lastName: '',
    province: '',
    district: '',
    address: '',
    instructions: '',
    isRushDelivery: false,
    time: '',
  },
  email: '',
  phoneNumber: '',
};

const checkoutSchema = [
  yup.object().shape({
    deliveryInfo: yup.object().shape({
      firstName: yup.string().required('required'),
      lastName: yup.string().required('required'),
      province: yup.string().required('required'),
      district: yup.string().required('required'),
      address: yup.string().required('required'),
      instructions: yup.string(),
      isRushDelivery: yup.boolean(),
      time: yup.string().when('isRushDelivery', {
        is: true,
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
