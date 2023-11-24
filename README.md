Short example of using @defer and to lazy-load some fields in GraphQL

## Run
```
npm i
npm run start
```
GraphiQL on http://localhost:4000

### Query to test the @defer
```graphql
query {
   hello {
    world
    ... on Hello @defer {
     	defered 
    }
  }
}
```