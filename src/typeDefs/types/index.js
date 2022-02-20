const { gql } = require("apollo-server");

const userType = gql`
  type User {
    username: String!
    password: String!
    token: String
  }

  type Container {
    container_id : String!
    container_size : Float!
    container_type : String!
    container_damage_level : String!
    container_date_start : String!
    container_date_end : String!
    container_date_finish : String!
    container_fixed_status : Boolean!
  }
`

module.exports = {
  userType
};
