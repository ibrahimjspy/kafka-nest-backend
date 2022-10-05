import postgres from 'postgres';
// only for local testing
// TODO change configurations to env
const sql = postgres('postgres://saleor:saleor@localhost:5432/postgres', {
  host: 'localhost', // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: 'saleor', // Name of database to connect to
  username: 'saleor', // Username of database user
  password: 'saleor', // Password of database user
});

export const fetchProductId = async (sourceId: string) => {
  const users = await sql`
      select
      destination_id
      from product_id_mapping_table
      where source_id = ${sourceId}
    `;
  return users[0];
};

export const InsertProductId = async (
  sourceId: string,
  destinationId: string,
) => {
  const users = await sql`
        insert into product_id_mapping_table (
            source_id
            destination-id
        ) values (
            ${sourceId}
            ${destinationId}
        )
      `;
  return users[0];
};

export const fetchMasterCategoryId = async (
  sourceId: string,
): Promise<string> => {
  const users = await sql`
        select
        destination_id
        from product_id_mapping_table
        where source_id = ${sourceId}
      `;
  return users[0].destination_id;
};

export const fetchSubCategoryId = async (sourceId: string): Promise<string> => {
  const users = await sql`
          select
          destination_id
          from product_id_mapping_table
          where source_id = ${sourceId}
        `;
  return users[0].destination_id;
};
