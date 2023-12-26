import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Item from '../../components/Item';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setItems } from '../../state';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('all');
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery('(min-width:600px)');

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

  const cds = items.filter((item) => item?.kind === 'cd');
  const dvds = items.filter((item) => item?.kind === 'dvd');
  const books = items.filter((item) => item?.kind === 'book');

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Our Featured <b>Products</b>
      </Typography>
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
        }}
      >
        <Tab label="ALL" value="all" />
        <Tab label="BOOK" value="book" />
        <Tab label="DVD" value="dvd" />
        <Tab label="CD" value="cd" />
      </Tabs>
      <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {value === 'all' &&
          items.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
        {value === 'book' &&
          books.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
        {value === 'dvd' &&
          dvds.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
        {value === 'cd' &&
          cds.map((item) => (
            <Item item={item} key={`${item.title}-${item.id}`} />
          ))}
      </Box>
    </Box>
  );
};

export default ShoppingList;
