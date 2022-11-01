import { Logger } from '@nestjs/common';
import { connect, Request } from 'mssql';
import delay from 'delay';
import { config } from '../../../mssql-config';

export const mssqlCall = async (query: string, wait = 1000) => {
  let data = {};
  const sqlTransaction = delay(wait, { value: 'Done' }); //setting up sql transaction

  new connect(config, async (err) => {
    if (err) {
      Logger.warn(err);
      sqlTransaction.clear(); // aborting sql transaction
    }
    // requesting db with StyleSearchUnique query
    const request = new Request();
    return await request.query(query, function (err, recordset) {
      if (err) {
        Logger.warn(err);
        sqlTransaction.clear(); // aborting sql transaction
      }
      // send records as a response
      if (recordset.recordset[0]) {
        //   console.log(recordset);
        data = recordset.recordset;
        sqlTransaction.clear(); // aborting sql transaction
        return data;
      }
    });
  });
  await sqlTransaction;
  return data;
};
