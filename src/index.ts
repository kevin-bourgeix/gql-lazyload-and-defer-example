import { Repeater, createSchema } from 'graphql-yoga'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time))

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Hello {
      world: String
      defered: String
    }
    type Collection {
      items: [String]
    }
    type Query {
      hello: Hello
      helloFilled: Hello
      collection: Collection
    }
  `,
  resolvers: {
    Hello: {
      world: (parent) => {
          console.log('hello from hello world resolver')
          // It's possible to lazy load the field if a resolver has been provided in the parent resolver
          // In the helloFilled query, we pass a "world" resolver, so this will call it.
          // If none is passed like in the hello query, it will execute the rest and return "world!!"
          if (parent.world) {
            return parent.world()
          }
          return 'world!!'
      
      },
      // Illustrates : https://the-guild.dev/graphql/yoga-server/docs/features/defer-stream
      // Works fine in graphiQL, the query returns first a partial result, then the complete one with the defered field
      defered: async (parent) => {
          // Lazy load the defered field
          if (parent.defered) {
            return parent.defered()
          }
          await wait(3000)
          return 'defered!!'
      }
    },
    Collection: {
      // https://the-guild.dev/graphql/yoga-server/docs/features/defer-stream#writing-safe-stream-resolvers
      items: () => new Repeater<string>(async (push, stop) => {
        for (let i = 0; i < 10; i++) {
          await wait(500)
          push(`Item ${i}`)
        }
        stop()
      })
    },
    Query: {
      hello: () => ({}),
      helloFilled: () => {
        return {
            world: () => 'filled!',
            defered: () => 'filled!',
        };
      },
      collection: () => ({}),
    },
  },
})
 
// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ schema, plugins: [useDeferStream()] })
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})