import { getIn } from 'formik';
import { Box } from '@mui/material';
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PROVINCE, DISTRICT } from '../../constants/locations';
import { useState, useEffect } from 'react';

const AddressForm = ({
  type,
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [districtList, setDistrictList] = useState([]);
  useEffect(() => {
    let provinceObj = {};
    for (let i = 0; i < PROVINCE.length; i++) {
      if (PROVINCE[i].name == values.deliveryInfo.province) {
        provinceObj = PROVINCE[i];
        break;
      }
    }

    const filtered = DISTRICT.filter(
      (v) => v?.province_code == provinceObj?.code
    );
    setDistrictList(filtered);
  }, [values.deliveryInfo.province]);
  // these functions allow for better code readability
  const formattedName = (field) => `${type}.${field}`;

  const formattedError = (field) =>
    Boolean(
      getIn(touched, formattedName(field)) &&
        getIn(errors, formattedName(field))
    );

  const formattedHelper = (field) =>
    getIn(touched, formattedName(field)) && getIn(errors, formattedName(field));

  return (
    <Box
      display="grid"
      gap="15px"
      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      sx={{
        '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
      }}
    >
      <TextField
        fullWidth
        type="text"
        label="First Name*"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.firstName}
        name={formattedName('firstName')}
        error={formattedError('firstName')}
        helperText={formattedHelper('firstName')}
        sx={{ gridColumn: 'span 2' }}
      />
      <TextField
        fullWidth
        type="text"
        label="Last Name*"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.lastName}
        name={formattedName('lastName')}
        error={formattedError('lastName')}
        helperText={formattedHelper('lastName')}
        sx={{ gridColumn: 'span 2' }}
      />
      <FormControl sx={{ gridColumn: 'span 2' }}>
        <InputLabel id="province-label">Province*</InputLabel>
        <Select
          labelId="province-label"
          id="province-select"
          value={values.province}
          onChange={handleChange}
          name={formattedName('province')}
          error={formattedError('province')}
          defaultValue={''}
        >
          {PROVINCE.map((v) => {
            return (
              <MenuItem value={v.name} key={v.name}>
                {v.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 2' }}>
        <InputLabel id="district-label">District*</InputLabel>
        <Select
          labelId="district-label"
          id="district-select"
          value={values.district}
          onChange={handleChange}
          name={formattedName('district')}
          error={formattedError('district')}
          defaultValue={''}
        >
          {districtList.map((v) => {
            return (
              <MenuItem value={v.name} key={v.name}>
                {v.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        type="text"
        label="Address"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.address}
        name={formattedName('address')}
        error={formattedError('address')}
        helperText={formattedHelper('address')}
        multiline
        rows={2}
        sx={{ gridColumn: 'span 4' }}
      />
      <TextField
        fullWidth
        type="text"
        label="Instructions (Optional)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.instructions}
        name={formattedName('instructions')}
        error={formattedError('instructions')}
        helperText={formattedHelper('instructions')}
        multiline
        rows={4}
        sx={{ gridColumn: 'span 4' }}
      />
    </Box>
  );
};

export default AddressForm;
