import { connect, Request } from 'mssql';
import { config } from '../../../mssql-config';

export const getProductDetails = async (query: string) => {
  connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    const request = new Request();
    // query to the database and get the records
    request.query(query, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      console.log(recordset);
    });
  });
};
