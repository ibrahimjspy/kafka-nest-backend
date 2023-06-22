# MSSQL Connector

The MSSQL Connector is a Kafka Connect connector that captures change events from a Microsoft SQL Server database and streams them to a Kafka topic. This README provides an overview of the connector configuration and usage.

## Prerequisites

Before using the MSSQL Connector, ensure that you have the following:

- Kafka Connect service up and running.
- Access to a Microsoft SQL Server database instance.
- Kafka cluster with appropriate bootstrap servers.

## Connector Configuration

The MSSQL Connector is configured using a JSON file. Here's an example configuration:

```json
{
  "name": "mssql-connector-8",
  "config": {
    "connector.class": "io.debezium.connector.sqlserver.SqlServerConnector",
    "tasks.max": "1",
    "database.hostname": "mssql",
    "database.port": "1433",
    "database.user": "sa",
    "database.password": "test1234!",
    "database.dbname": "ARAOS",
    "database.server.name": "mssql",
    "table.whitelist": "dbo.TBStyleNo",
    "database.history.kafka.bootstrap.servers": "kafka1:29092",
    "database.history.kafka.topic": "mssql_history_topic",
    "snapshot.mode": "schema_only",
    "snapshot.delay.ms": "10000",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false"
  }
}

- `connector.class`: Specifies the connector class for Microsoft SQL Server.
- `tasks.max`: Sets the maximum number of tasks for this connector (typically 1 for a single node).
- `database.hostname`, `database.port`, `database.user`, `database.password`: Database connection details.
- `database.dbname`: Specifies the name of the database to connect to.
- `database.server.name`: Unique identifier for the SQL Server instance.
- `table.whitelist`: Whitelists the specific table(s) to capture change events from.
- `database.history.kafka.bootstrap.servers`, `database.history.kafka.topic`: Kafka bootstrap servers and topic for storing connector history.
- `snapshot.mode`: Sets the snapshot mode. Use "schema_only" to capture the initial schema snapshot.
- `snapshot.delay.ms`: Adds a delay (in milliseconds) before starting the snapshot to skip previous messages.
- `transforms`, `transforms.unwrap.type`, `transforms.unwrap.drop.tombstones`: Transformation settings for unwrapping the message payload.

## Usage

To use the MSSQL Connector, follow these steps:

1. Ensure that the Kafka Connect service is running.
2. Create a JSON file with the connector configuration, e.g., `mssql-connector-config.json`.
3. Add the connector using the following command:

```bash
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" http://localhost:8083/connectors/ -d @mssql-connector-config.json

4. Monitor the connector status and check for any errors in the Kafka Connect logs.
5. To delete the connector, use the following command:

```bash
curl -i -X DELETE http://localhost:8083/connectors/mssql-connector-8

Ensure that you update the necessary details in the configuration file before adding the connector.