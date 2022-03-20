import {ApolloClient, InMemoryCache,split, HttpLink} from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {getMainDefinition} from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";

// const wsLink = new GraphQLWsLink(createClient({
//     url: 'wss://graphql-compose.herokuapp.com/northwind/',
// }));

const wsLink = new WebSocketLink({
    uri: 'wss://graphql-compose.herokuapp.com/northwind/',
    options: {
        reconnect:true,
    },
})

const httpLink = new HttpLink({
    uri: 'https://graphql-compose.herokuapp.com/northwind/',
    headers: {
        'x-api-key': 'da2-g462acl3rnclplgtyxmbcqircy',
        'x-rapidapi-host': 'schedule-import.p.rapidapi.com',
        'x-rapidapi-key': 'c0b70ff419mshf6abc2a144dfa76p19dbe1jsn4a93647205b3'
    }
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