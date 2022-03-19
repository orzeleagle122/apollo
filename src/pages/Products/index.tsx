import { Row, Col, Empty, Result, Button, Pagination } from 'antd';
import { Product } from './components/Product';
import { Loader } from "../../components/Loader/Loader";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {BASIC_PRODUCT_FRAGMENT, CATEGORY_FRAGMENT} from "../../apollo/fragments";

interface IProduct {
  name:string,
  unitPrice:number,
  productID:number,
  category: {
    name:string,
  },
  _id?:number,
}

type GetProducts = {
  
}

const PER_PAGE=8;

// export const GET_PRODUCTS = gql`
//     ${BASIC_PRODUCT_FRAGMENT}
//     ${CATEGORY_FRAGMENT}
//   query GetProducts($perPage: Int, $page: Int) {
//     viewer {
//       productPagination(page: $page, perPage: $perPage) {
//         pageInfo {
//           pageCount
//           currentPage
//         }
//         items {
//           _id
//           ...BasicProduct
//           category {
//             ...CategoryFragment
//           }
//         }
//       }
//     }
//   }
// `;

export const GET_PRODUCTS_2 = gql`
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

function ProductsPage() {
  const navigate=useNavigate();
  const searchParams=new URLSearchParams(window.location.search);
  const pageParam=parseInt(searchParams.get('page') as string,10);
  const [page,setPage]=useState<number>(pageParam);
  const {data,loading,error,refetch}=useQuery(GET_PRODUCTS_2,{
    variables:{
      page,
      perPage: PER_PAGE,
    }
  });
  
  if (loading) {
    return <Loader />
  }
  console.log(data);
  if (error) {
    console.log(error);
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
    </div>
  )
}

export default ProductsPage;
