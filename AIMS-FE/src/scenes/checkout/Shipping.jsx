import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  Select,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddressForm from './AddressForm';

const Shipping = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  const formattedName = (field) => `${'deliveryInfo'}.${field}`;

  return (
    <Box m="30px auto">
      {/* BILLING FORM */}
      <Box>
        <Typography sx={{ mb: '15px' }} fontSize="18px">
          Billing Information
        </Typography>
        <AddressForm
          type="deliveryInfo"
          values={values}
          touched={touched}
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      </Box>

      <Box mb="20px">
        <FormControlLabel
          control={
            <Checkbox
              value={values.deliveryInfo.isRushDelivery}
              onChange={() =>
                setFieldValue(
                  'deliveryInfo.isRushDelivery',
                  !values.deliveryInfo.isRushDelivery
                )
              }
            />
          }
          label="Rush Delivery"
        />
      </Box>

      {/* SHIPPING FORM */}
      {values?.deliveryInfo?.isRushDelivery && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              onChange={(value) =>
                setFieldValue(formattedName('time'), value, true)
              }
              value={values.deliveryInfo?.time}
              slotProps={{ textField: { variant: 'outlined' } }}
            />
          </DemoContainer>
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default Shipping;
