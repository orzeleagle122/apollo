import {ReactNode, useState} from 'react';
import {PageHeader, Descriptions, Button, Divider, Result} from 'antd';
import { OrderForm } from './components/OrderForm';
import {LayoutApp} from "../../components/layout/Layout";
import {gql, useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";
import {Loader} from "../../components/Loader/Loader";
import {BASIC_PRODUCT_FRAGMENT, CATEGORY_FRAGMENT} from "../../apollo/fragments";
import {GraphQLID, GraphQLInputObjectType, GraphQLString} from "graphql";

interface IProduct {
    category: {
        name:string,
        categoryID:number,
    },
    name:string,
    productID:number,
    quantityPerUnit:string,
    unitPrice:number,
    supplier:{
        companyName: string,
        contactTitle: string,
        address: {
            city: string,
            street: string,
        }
    }
}

const GET_PRODUCT_DETAILS=gql`
    query GetProductDetails($filter: FilterFindOneProductInput) {
      viewer {
        product(filter: $filter) {
          ...BasicProduct
          quantityPerUnit
          category {
            ...CategoryFragment
          }
          supplier {
            companyName
            contactTitle
            address {
              street
              city
            }
          }
        }
      }
    }
        
    ${BASIC_PRODUCT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`

function ProductDetails() {
    const {productID}=useParams();
    const [orderFormVisible, setOrderFormVisible] = useState(false);
    const {data,loading,error, refetch}=useQuery(GET_PRODUCT_DETAILS,{
        variables: {
            filter: {
                productID,
            },
        }
    })

    if (loading) {
        return <Loader />
    }

    if (error) {
        return (
            <Result
                status="500"
                title="Something went wrong..."
                subTitle="Please try again or contact with support."
                extra={[
                    <Button type="primary" key="retry" onClick={()=>refetch()}>
                        Retry
                    </Button>
                ]}
            />
        )
    }
    const {product}:{product:IProduct}=data.viewer;

    return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title={product.name}
      />
      <Descriptions title="Product details" bordered>
        <Descriptions.Item label="Category">{product.name}</Descriptions.Item>
        <Descriptions.Item label="Unit Price">${product.unitPrice}</Descriptions.Item>
        <Descriptions.Item label="Quantity per unit">{product.quantityPerUnit}</Descriptions.Item>
        <Descriptions.Item label="Address">
          Company name: {product.supplier.companyName}, <br />
          Contact title: {product.supplier.contactTitle}, <br />
          Address: <br />
            {product.supplier.address.city} {product.supplier.address.street}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Button type="primary" size="large" onClick={() => setOrderFormVisible(true)}>
        Order
      </Button>
      
      <OrderForm
        visible={orderFormVisible}
        productDetails={{
          name: product.name,
          productID: product.productID
        }}
        onClose={() => setOrderFormVisible(false)}
      />
    </>
  )
}

export default ProductDetails;