Short example of using @defer/@stream and to lazy-load some fields in GraphQL

## Run
```
npm i
npm run start
```
GraphiQL on http://localhost:4000

### Query to test @defer
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

### Query to test @stream
```graphql
query {
  collection {
    items @stream
  }
}
```