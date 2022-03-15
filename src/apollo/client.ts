import {ApolloClient, InMemoryCache} from "@apollo/client";

export const client = new ApolloClient({
    uri: 'https://graphql-compose.herokuapp.com/northwind/',
    cache: new InMemoryCache({
        typePolicies: {
            Query:{
                fields:{
                    viewer:{
                        merge:(existing={},incoming={})=>{
                            return {...existing, ...incoming}
                        }
                    }
                }
            },
            ProductPagination:{
                keyFields:['pageInfo']
            },
            Product: {
                keyFields:['productID'],
            },
            Category:{
                keyFields:['categoryID','name'],
                fields:{
                    name(cachedName){
                        return cachedName.toUpperCase();
                    }
                }
            }
        }
    })
});