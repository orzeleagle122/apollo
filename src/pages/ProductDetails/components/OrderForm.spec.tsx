import {fireEvent, render, waitFor} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import {generateRandomId} from "../../../utils/generateRandomId";
import {CREATE_ORDER_MUTATION, OrderForm} from "./OrderForm";


describe('OrderForm', () => {  
  it ('renders OrderForm page and execute mutation', async () => {
    const orderRandomId = generateRandomId();
    const mocks = [
      {
        request: {
          query: CREATE_ORDER_MUTATION,
          variables: {
            orderID: orderRandomId,
            postalCode: '31-333',
            street: 'Sosnowa',
            country: 'Polska',
            city: 'Krakow'
          }
        },
        result: {
          data: {},
        },
      }
    ]
    
    const {getByPlaceholderText,getByText}=render(
      <MockedProvider mocks={mocks}>
         <OrderForm visible={true} productDetails={{name:'product name', productID:123}} onClose={jest.fn()} orderRandomId={orderRandomId} />
      </MockedProvider>
    );

    fireEvent.change(getByPlaceholderText('Street'),{target: {value: 'Sosnowa'}});
    fireEvent.change(getByPlaceholderText('City'),{target: {value: 'Krakow'}});
    fireEvent.change(getByPlaceholderText('Country'),{target: {value: 'Polska'}});
    fireEvent.change(getByPlaceholderText('Polstal Code'),{target: {value: '31-333'}});

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Great, your order is on the way!')).toBeInTheDocument();
    })
  })
})

