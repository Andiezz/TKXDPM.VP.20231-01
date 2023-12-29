import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { IconButton, Grid } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import Item from '../../components/Item';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setItems } from '../../state';

const ITEMS_PER_PAGE = 4;

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('all');
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery('(min-width:600px)');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItems() {
    const items = await fetch('http://localhost:8080/api/products', {
      method: 'GET',
    });

    const itemsJson = await items.json();
    const itemlist = itemsJson.data[0].paginatedResults.map((item) => {
      return {
        id: item._id,
        category: item.category,
        price: item.price,
        title: item.title,
        kind: item.kind,
        longDescription: item.description,
        image: item.image,
        importDate: item.importDate,
        quantity: item.quantity,
        productDimensions: item.productDimensions,
        barcode: item.barcode,
        kind: item.kind,
        supportRush: item.supportRush,
      };
    });
    dispatch(setItems(itemlist));
  }

  useEffect(() => {
    getItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredItems = () => {
    let filteredList = items;

    if (searchTerm) {
      filteredList = filteredList.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (value) {
      case 'book':
        filteredList = filteredList.filter((item) => item.kind === 'book');
        break;
      case 'dvd':
        filteredList = filteredList.filter((item) => item.kind === 'dvd');
        break;
      case 'cd':
        filteredList = filteredList.filter((item) => item.kind === 'cd');
        break;
      default:
        break;
    }

    return filteredList;
  };

  const paginatedItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredItems().slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredItems().length / ITEMS_PER_PAGE);

  const cds = items.filter((item) => item?.kind === 'cd');
  const dvds = items.filter((item) => item?.kind === 'dvd');
  const books = items.filter((item) => item?.kind === 'book');

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Our Featured <b>Products</b>
      </Typography>
      <Box sx={{ marginRight: '45px' }}>
        <Stack
          direction={'row'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          spacing={2}
        >
          <TextField
            id="outlined-basic"
            label="search"
            variant="outlined"
            value={searchTerm}
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchOutlined sx={{ color: 'action.active' }} />
        </Stack>
      </Box>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{
          sx: { display: breakPoint ? 'block' : 'none' },
        }}
        sx={{
          m: '25px',
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
          },
          mt: 0,
        }}
      >
        <Tab label="ALL" value="all" />
        <Tab label="BOOK" value="book" />
        <Tab label="DVD" value="dvd" />
        <Tab label="CD" value="cd" />
      </Tabs>
      {/* <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {searchTerm &&
          value === 'all' &&
          items
            .filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <Item item={item} key={`${item.title}-${item.id}`} />
            ))}
        {searchTerm &&
          value === 'book' &&
          books
            .filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <Item item={item} key={`${item.title}-${item.id}`} />
            ))}
        {searchTerm &&
          value === 'dvd' &&
          dvds
            .filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <Item item={item} key={`${item.title}-${item.id}`} />
            ))}
        {searchTerm &&
          value === 'cd' &&
          cds
            .filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <Item item={item} key={`${item.title}-${item.id}`} />
            ))}
        {value === 'all' &&
          !searchTerm &&
          items.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
        {value === 'book' &&
          !searchTerm &&
          books.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
        {value === 'dvd' &&
          !searchTerm &&
          dvds.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
        {value === 'cd' &&
          !searchTerm &&
          cds.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
      </Box> */}
      <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {paginatedItems().map((item) => (
          <Item item={item} key={`${item.title}-${item.id}`} />
        ))}
      </Box>
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Typography
              key={index}
              variant="button"
              color={currentPage === index + 1 ? 'primary' : 'inherit'}
              onClick={() => setCurrentPage(index + 1)}
              style={{ cursor: 'pointer', margin: '0 5px' }}
            >
              {index + 1}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ShoppingList;
