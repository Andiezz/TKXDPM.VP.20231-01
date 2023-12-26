import {
  Box,
  Button,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Item from '../../components/Item';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { shades } from '../../theme';
import { addToCart } from '../../state';
import { useDispatch } from 'react-redux';

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState('description');
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItem() {
    const item = await fetch(`http://localhost:8080/api/products/${itemId}`, {
      method: 'GET',
    });
    const itemJson = await item.json();
    setItem(itemJson.data);
  }

  async function getItems() {
    const items = await fetch(
      `http://localhost:8080/api/products?limit=4`,
      {
        method: 'GET',
      }
    );
    const itemsJson = await items.json();
    setItems(itemsJson.data[0]?.paginatedResults);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    getItem();
    getItems();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width="80%" m="80px auto">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        {/* IMAGES */}
        <Box flex="1 1 40%" mb="40px">
          <img
            alt={item?.title}
            width="100%"
            height="100%"
            src={item?.image}
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {/* ACTIONS */}
        <Box flex="1 1 50%" mb="40px">
          <Box display="flex" justifyContent="space-between">
            <Box>Home/Item</Box>
            <Box>Prev Next</Box>
          </Box>

          <Box m="65px 0 25px 0">
            <Typography variant="h3">{item?.title}</Typography>
            <Typography>${item?.price}</Typography>
            <Typography>{item?.kind?.toUpperCase()}</Typography>
            <Typography sx={{ mt: '20px' }}>{item?.description}</Typography>
            <Typography>
              {'Import date: ' + new Date(item?.importDate).toLocaleString()}
            </Typography>
            <Typography>{'Barcode: ' + item?.barcode}</Typography>
            <Typography>
              {'Support rush delivery: '}{' '}
              {item?.supportRush === true ? 'yes' : 'no'}
            </Typography>
            <Typography variant="h5" sx={{ mt: '20px' }}>
              {item?.kind?.toUpperCase()} Information
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 600 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Info</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item?.kind === 'dvd' && [
                    <TableRow
                      key={'discType'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('discType')}
                      </TableCell>
                      <TableCell align="right">{item?.discType}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'director'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('director')}
                      </TableCell>
                      <TableCell align="right">{item?.director}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'runtime'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('runtime')}
                      </TableCell>
                      <TableCell align="right">{item?.runtime}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'studio'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('studio')}
                      </TableCell>
                      <TableCell align="right">{item?.studio}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'language'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('language')}
                      </TableCell>
                      <TableCell align="right">{item?.language}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'releaseDate'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('releaseDate')}
                      </TableCell>
                      <TableCell align="right">{new Date(item?.releaseDate).toLocaleString()}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'genre'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('genre')}
                      </TableCell>
                      <TableCell align="right">{item?.genre}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'subtitle'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('subtitle')}
                      </TableCell>
                      <TableCell align="right">{item?.subtitle}</TableCell>
                    </TableRow>,
                  ]}
                  {item?.kind === 'book' && [
                    <TableRow
                      key={'author'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('author')}
                      </TableCell>
                      <TableCell align="right">{item?.author}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'coverType'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('coverType')}
                      </TableCell>
                      <TableCell align="right">{item?.coverType}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'publisher'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('publisher')}
                      </TableCell>
                      <TableCell align="right">{item?.publisher}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'publicationDate'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('publicationDate')}
                      </TableCell>
                      <TableCell align="right">{new Date(item?.publicationDate).toLocaleString()}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'language'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('language')}
                      </TableCell>
                      <TableCell align="right">{item?.language}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'pages'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('pages')}
                      </TableCell>
                      <TableCell align="right">{item?.pages}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'bookCategory'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('bookCategory')}
                      </TableCell>
                      <TableCell align="right">{item?.bookCategory}</TableCell>
                    </TableRow>,
                  ]}
                  {item?.kind === 'cd' || item?.kind === 'long-play' && [
                    <TableRow
                      key={'artist'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('artist')}
                      </TableCell>
                      <TableCell align="right">{item?.artist}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'recordLabel'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('recordLabel')}
                      </TableCell>
                      <TableCell align="right">{item?.recordLabel}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'genre'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('genre')}
                      </TableCell>
                      <TableCell align="right">{item?.genre}</TableCell>
                    </TableRow>,
                    <TableRow
                      key={'releaseDate'}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirstLetter('releaseDate')}
                      </TableCell>
                      <TableCell align="right">{new Date(item?.releaseDate)}</TableCell>
                    </TableRow>,
                  ]}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${shades.neutral[300]}`}
              mr="20px"
              p="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 0))}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: '0 5px' }}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              sx={{
                backgroundColor: '#222222',
                color: 'white',
                borderRadius: 0,
                minWidth: '150px',
                padding: '10px 40px',
              }}
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
            >
              ADD TO CART
            </Button>
            <Typography sx={{ p: '0 10px' }}>
              {'In stock: ' + item?.quantity}
            </Typography>
          </Box>
          <Box>
            <Box m="20px 0 5px 0" display="flex">
              <FavoriteBorderOutlinedIcon />
              <Typography sx={{ ml: '5px' }}>ADD TO WISHLIST</Typography>
            </Box>
            <Typography>CATEGORIES: {item?.category}</Typography>
          </Box>
        </Box>
      </Box>

      {/* INFORMATION */}
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="DESCRIPTION" value="description" />
          <Tab label="REVIEWS" value="reviews" />
        </Tabs>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="15px">
        {value === 'description' && (
          <div>
            {item?.description}
            <Typography variant="h5" sx={{ mt: '20px' }}>
              Product Dimension
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 600 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Dimension</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item?.productDimensions &&
                    Object.entries(item?.productDimensions)?.map(
                      ([key, value]) => (
                        <TableRow
                          key={key}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {capitalizeFirstLetter(key)}
                          </TableCell>
                          <TableCell align="right">
                            {value !== null ? value : 'N/A'}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        {value === 'reviews' && <div>reviews</div>}
      </Box>

      {/* RELATED ITEMS */}
      <Box mt="50px" width="100%">
        <Typography variant="h3" fontWeight="bold">
          Related Products
        </Typography>
        <Box
          mt="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1.33%"
          justifyContent="space-between"
        >
          {items.slice(0, 4).map((item, i) => (
            <Item key={`${item.title}-${i}`} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
