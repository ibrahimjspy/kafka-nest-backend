import { gql } from 'graphql-request';

export const deleteUserMutation = (userId: string) => {
  return gql`
    mutation{
    staffDelete(id:"${userId}"){
        user{
        firstName
        }
    }
    }
    `;
};
