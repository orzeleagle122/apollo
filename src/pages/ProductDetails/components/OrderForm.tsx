import { Modal, Button, Result, Form, Input } from 'antd';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {gql, useMutation} from "@apollo/client";
import {useState} from "react";
import {generateRandomId} from "../../../utils/generateRandomId";

interface IOrderForm {
  visible:any,
  onClose:any,
  productDetails:{
    name:string,
    productID:number,
  },
}

const CREATE_ORDER_MUTATION=gql`
  mutation CreateOrder($orderID:Float,$street:String,$postalCode:String,$country:String,$city:String){
    createOrder(record: {
      orderID: $orderID,
      shipAddress:{
        street: $street,
        city: $city,
        postalCode: $postalCode,
        country: $country
      }
    }){
      __typename
    }
  }
`

export function OrderForm({ visible, onClose, productDetails }:IOrderForm) {
  const [isOrdered,setIsOrdered]=useState<boolean>(false);
  const [isError,setIsError]=useState<boolean>(false)
  const [createOrder]=useMutation(CREATE_ORDER_MUTATION,{
    onCompleted:()=>setIsOrdered(true),
    onError:()=>setIsError(true),
  });
  const isFormState = !isOrdered && !isError;

  const { name } = productDetails;
  
  const handleCancel = () => {
    setIsOrdered(false);
    setIsError(false);
    onClose();
  };
  
  const handleSubmit = (values:any) => {
    if(!values) return;

    const {postalCode,street,country,city}=values;
    createOrder({
      variables:{
        postalCode, street, country,city, orderID: generateRandomId(),
      }
    });
    console.log(values)
  };

  return (
    <Modal
      visible={visible}
      title={`Order ${name}`}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={isFormState ? [
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>
      ] : []}
    >
      {
        isFormState && (
          <Form
            name="normal_login"
            className="login-form"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="street"
              rules={[{ required: true, message: 'Please input your Street!' }]}
            >
              <Input placeholder="Street" />
            </Form.Item>
            <Form.Item
              name="city"
              rules={[{ required: true, message: 'Please input your City!' }]}
            >
              <Input
                placeholder="City"
              />
            </Form.Item>
            <Form.Item
              name="postalCode"
              rules={[{ required: true, message: 'Please input your Postal Code!' }]}
            >
              <Input
                placeholder="Postal Code"
              />
            </Form.Item>
            <Form.Item
              name="country"
              rules={[{ required: true, message: 'Please input your Country!' }]}
            >
              <Input
                placeholder="Country"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Submit
              </Button>
            </Form.Item>
          </Form>
        )
      }
      {
        isOrdered && (
          <Result
            icon={<SmileOutlined />}
            title="Great, your order is on the way!"
            extra={<Button type="primary" onClick={handleCancel}>Back to product</Button>}
          />
        )
      }
      {
        isError && (
          <Result
            status="error"
            icon={<CloseCircleOutlined />}
            title="Something went wrong!"
            subTitle="Please try again or contact with support!"
            extra={<Button type="primary" onClick={handleCancel}>Back to product</Button>}
          />
        )
      }
    </Modal>
  )
}