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
    // const items = await fetch(
    //   'http://localhost:2000/api/items?populate=image',
    //   { method: 'GET' }
    // );
    const items = {
      data: [
        {
          id: 0,
          category: 'topRated',
          price: '100000',
          name: 'Lionel Messi',
          image:
            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-lionel-messi-rezeky-art.jpg',
        },
        {
          id: 1,
          category: 'topRated',
          price: '100000',
          name: 'Luis Suarez',
          shortDescription: 'FC Barcelona',
          image:
            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-lionel-messi-rezeky-art.jpg',
        },
        {
          id: 2,
          category: 'topRated',
          price: '100000',
          name: 'Neymar JR',
          shortDescription: 'FC Barcelona',

          image:
            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-lionel-messi-rezeky-art.jpg',
        },
        {
          id: 3,
          category: 'topRated',
          price: '100000',
          name: 'Sergio Busquet',
          shortDescription: 'FC Barcelona',

          image:
            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-lionel-messi-rezeky-art.jpg',
        },
        {
          id: 4,
          category: 'topRated',
          price: '100000',
          name: 'Andres Iniesta',
          shortDescription: 'FC Barcelona',
          image:
            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-lionel-messi-rezeky-art.jpg',
        },
        {
          id: 5,
          category: 'newArrivals',
          price: '100000',
          name: 'Joao Felix',
          shortDescription: 'FC Barcelona',
          image:
            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-lionel-messi-rezeky-art.jpg',
        },
        {
          id: 6,
          category: 'bestSellers',
          price: '100000',
          name: 'Joao Cancelo',
          shortDescription: 'FC Barcelona',
          image:
            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-lionel-messi-rezeky-art.jpg',
        },
      ],
    };
    // const itemsJson = await items.json();
    const itemsJson = items;
    dispatch(setItems(itemsJson.data));
  }

  useEffect(() => {
    getItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const topRatedItems = items.filter((item) => item?.category === 'topRated');
  const newArrivalsItems = items.filter(
    (item) => item?.category === 'newArrivals'
  );
  const bestSellersItems = items.filter(
    (item) => item?.category === 'bestSellers'
  );

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
        TabIndicatorProps={{ sx: { display: breakPoint ? 'block' : 'none' } }}
        sx={{
          m: '25px',
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
          },
        }}
      >
        <Tab label="ALL" value="all" />
        <Tab label="NEW ARRIVALS" value="newArrivals" />
        <Tab label="BEST SELLERS" value="bestSellers" />
        <Tab label="TOP RATED" value="topRated" />
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
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === 'newArrivals' &&
          newArrivalsItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === 'bestSellers' &&
          bestSellersItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === 'topRated' &&
          topRatedItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
      </Box>
    </Box>
  );
};

export default ShoppingList;
