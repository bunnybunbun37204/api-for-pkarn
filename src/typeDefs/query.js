const { gql } = require("apollo-server");

const query = gql`
  type Query {
    me: User
    container(container_id : String!): Container
    all_container : AllId
  }
  type Mutation {
    register(username: String!, password: String!): User
    login(username: String!, password: String!): User
    addContainer(
      container_id : String!,
      container_size : Float!,
      container_type : String!,
      container_damage_level : String!,
      container_date_start : String!,
      container_date_end : String!,
      container_date_finish : String!
      container_fixed_status : Boolean!
    ): Container
    updateContainerStatus(
      container_id : String!, 
      container_date_finish : String!, 
      container_fixed_status : Boolean!
      ): Container
  }
`;

module.exports = {
  query,
};
