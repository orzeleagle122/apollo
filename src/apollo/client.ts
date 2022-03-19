import {ApolloClient, InMemoryCache,split, HttpLink} from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {getMainDefinition} from "@apollo/client/utilities";

const wsLink = new GraphQLWsLink(createClient({
    url: 'wss://graphql-compose.herokuapp.com/northwind/',
}));

const httpLink = new HttpLink({
    uri: 'https://graphql-compose.herokuapp.com/northwind/'
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const client = new ApolloClient({
    link: splitLink,
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