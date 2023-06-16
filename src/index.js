import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import neo4j from 'neo4j-driver'
import { Neo4jGraphQL } from '@neo4j/graphql'
 
const driver = neo4j.driver(
  'neo4j+s://db516a29.databases.neo4j.io',
  neo4j.auth.basic('neo4j', 'z0GC2lItD0cTk7ePeoB6OOc9wwKlF7_sSz1q6qJNDl8')
)
 
const typeDefs = /* GraphQL */ `
type Business {
  businessId: ID!
  name: String!
  city: String!
  state: String!
  address: String!
  location: Point!
  reviews: [Review!]! @relationship(type: "REVIEWS", direction: IN)
  categories: [Category!]!
    @relationship(type: "IN_CATEGORY", direction: OUT)
}
 
type User {
  userID: ID!
  name: String!
  reviews: [Review!]! @relationship(type: "WROTE", direction: OUT)
}
 
type Review {
  reviewId: ID!
  stars: Float!
  date: Date!
  text: String
  user: User! @relationship(type: "WROTE", direction: IN)
  business: Business! @relationship(type: "REVIEWS", direction: OUT)
}
 
type Category {
  name: String!
  businesses: [Business!]!
    @relationship(type: "IN_CATEGORY", direction: IN)
}
`;
 
const neoSchema = new Neo4jGraphQL({ typeDefs, driver })
 
const schema = await neoSchema.getSchema()
const server = new ApolloServer({ schema })
console.log("server", server)
const { url } = await startStandaloneServer(server)

console.log(`GraphQL server ready at ${url}`)
