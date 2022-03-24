import { Row, Col, Empty, Result, Button, Pagination } from 'antd';
import { Product } from './components/Product';
import { Loader } from "../../components/Loader/Loader";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {BASIC_PRODUCT_FRAGMENT, CATEGORY_FRAGMENT} from "../../apollo/fragments";
import {generateRandomId} from "../../utils/generateRandomId";

interface IProduct {
  name:string,
  unitPrice:number,
  productID:number,
  category: {
    name:string,
  },
  _id?:number,
}

const PER_PAGE=8;

export const GET_PRODUCTS = gql`
  ${BASIC_PRODUCT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  query GetProducts($perPage: Int, $page: Int) {
    viewer {
      productPagination(page: $page, perPage: $perPage) {
        pageInfo {
          pageCount
          currentPage
        }
        items {
          _id
          ...BasicProduct
          category {
            ...CategoryFragment
          }
        }
      }
    }
  }
`;

export const CREATE_PRODUCT=gql`
  mutation createProduct($supplier: Float) {
    createProduct(record: {
      name: "tese4",
      productID: 1233332,
      unitPrice: 1234,
      categoryID: 1,
      quantityPerUnit: "34324",
      supplierID: $supplier,
      unitsOnOrder: 13,
      unitsInStock: 13,
    }){
      record {
        name
        productID
        unitPrice
        category {
          categoryID
          name
        }
        _id
      }
    }
  }
`;

export const REMOVE_PRODUCT=gql`
    mutation deleteProduct {
      removeProduct(filter: {name: "test"}){
        record {
          name
        }
      }
    }
`

function ProductsPage() {
  const navigate=useNavigate();
  const searchParams=new URLSearchParams(window.location.search);
  const pageParam=parseInt(searchParams.get('page') as string,10);
  const [page,setPage]=useState<number>(pageParam);
  const {data,loading,error,refetch}=useQuery(GET_PRODUCTS,{
    variables:{
      page,
      perPage: PER_PAGE,
    }
  });

  const [createProduct]=useMutation(CREATE_PRODUCT,{
    variables: {
      supplier:generateRandomId()
    },

    update: ( store, { data } ) => {
      const paginationData = store.readQuery({
        query: GET_PRODUCTS,
        variables:{
          page,
          perPage: PER_PAGE,
        }
      })

      store.writeQuery({
        query: GET_PRODUCTS,
        variables:{
          page,
          perPage: PER_PAGE,
        },
        data: {
          viewer: {
            productPagination: {
              ...data?.viewer?.productPagination,
              items: [paginationData]
            },
          }
        }
      })

    }

    // onQueryUpdated(observableQuery) {
    //     return observableQuery.refetch();
    // }
    // refetchQueries: [{query: GET_PRODUCTS, variables:{}}]
  });
  
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

  const {viewer:{productPagination:{items,pageInfo}}}=data;
  const {pageCount,currentPage}=pageInfo;
  
  return (
    <div>
      {data ? (
        <>
          <Row gutter={[16, 16]}>
            {items.map((i:IProduct)=>(<Col span={6}>
              <Product
                  key={i.productID}
                  title={i.name}
                  unitPrice={i.unitPrice}
                  productId={i.productID}
                  category={i.category.name}
              />
            </Col>))}
          </Row>
          
          <div style={{textAlign: 'center', marginTop: '16px'}}>
            <Pagination pageSize={PER_PAGE} current={currentPage} total={pageCount*PER_PAGE} onChange={(page)=> {
              setPage(page);
              navigate({
                pathname:'/',
                search:`?page=${page}`
              });
            }}/>
          </div>
        </>
      ) : (
        <Empty />
      )}
      <button
        onClick={async()=>{
          await createProduct({
            // refetchQueries: [{query: GET_PRODUCTS, variables:{}}]
          });
        }}
      >Create Product</button>
    </div>
  )
}

export default ProductsPage;
