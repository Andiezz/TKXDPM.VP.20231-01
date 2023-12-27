import { useTheme } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import { shades } from '../../theme';

function Footer() {
  const {
    palette: { neutral },
  } = useTheme();
  return (
    <Box marginTop="70px" padding="40px 0" backgroundColor={neutral.light}>
      <Box
        width="80%"
        margin="auto"
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap="30px"
        columnGap="clamp(20px, 30px, 40px)"
      >
        <Box width="clamp(20%, 30%, 40%)">
          <Typography
            variant="h4"
            fontWeight="bold"
            mb="30px"
            color={shades.secondary[500]}
          >
            AIMS
          </Typography>
          <div>
            The path to knowledge, art, and entertainment has, is, and will
            always be a part of every person's life. However, life is inherently
            not easy. There will be times when the products of creative labor
            cannot reach everyone, simply because the spiritual offspring cannot
            provide for them - the artists, intellectuals - a minimum standard
            of living. Fortunately, difficulties do not make us falter. The era
            of the Internet explosion, along with the Fourth Industrial
            Revolution, has brought new opportunities for all of us: AIMS
            Project, an e-commerce software specializing in the buying and
            selling of media products.
          </div>
        </Box>

        <Box>
          <Typography variant="h4" fontWeight="bold" mb="30px">
            About Us
          </Typography>
          <Typography mb="30px">Careers</Typography>
          <Typography mb="30px">Our Stores</Typography>
          <Typography mb="30px">Terms & Conditions</Typography>
          <Typography mb="30px">Privacy Policy</Typography>
        </Box>

        <Box>
          <Typography variant="h4" fontWeight="bold" mb="30px">
            Customer Care
          </Typography>
          <Typography mb="30px">Help Center</Typography>
          <Typography mb="30px">Track Your Order</Typography>
          <Typography mb="30px">Corporate & Bulk Purchasing</Typography>
          <Typography mb="30px">Returns & Refunds</Typography>
        </Box>

        <Box width="clamp(20%, 25%, 30%)">
          <Typography variant="h4" fontWeight="bold" mb="30px">
            Contact Us
          </Typography>
          <Typography mb="30px">
            01 Tran Dai Nghia Street, Hai Ba Trung, Hanoi, Vietnam
          </Typography>
          <Typography mb="30px" sx={{ wordWrap: 'break-word' }}>
            Email: duyanhcva110t@gmail.com
          </Typography>
          <Typography mb="30px">+84 944 162 921</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
