# Discourse - TeamSpeak 3 Server Bridge

[![Build Status](https://drone.sc-web.de/api/badges/SvenC56/discourse-teamspeak-bridge/status.svg)](https://drone.sc-web.de/SvenC56/discourse-teamspeak-bridge)

## Getting started

This Bridge Server syncs specified user groups from the Discourse Board to the TeamSpeak 3 Server. The server runs a cronjob every 5 minutes to sync both servers. This server is in early dev stage but it is _fully working_.

On server start the server will create a database file which has to be filled by you. It is a pivot table which contains the Group_ID of Discourse and TeamSpeak3.

### Small Note

By default this project can be accessed by everybody. This is OK if you have it only running locally but if you deploy it on a server which is accessible from the web you have to make sure that this project is protected (e.g. with Basic Auth)!

### Docker

You can simply pull the provided docker image.

[svenc56/discourse-teamspeak-bridge](https://hub.docker.com/r/svenc56/discourse-teamspeak-bridge)

Please add the following environment variables:

```dockerfile
ENV DISCOURSE_BASE_URL ''
ENV DISCOURSE_API_KEY ''
ENV DISCOURSE_USER ''
ENV DISCOURSE_CUSTOM_FIELD_NAME ''
ENV DISCOURSE_USER_LIST_QUERY_ID ''
ENV DISCOURSE_WEBHOOK_SECRET ''
ENV TEAMSPEAK_USERNAME 'serveradmin'
ENV TEAMSPEAK_PASSWORD ''
ENV TEAMSPEAK_HOST 'localhost'
ENV TEAMSPEAK_SERVER_PORT '9987'
ENV TEAMSPEAK_QUERY_PORT '10011'
ENV TEAMSPEAK_PROTOCOL 'raw'
ENV TEAMSPEAK_BOT_NAME 'Bot'
ENV BASE_URL ''
```

### Installing

1.) Install dependencies:

```bash
$ npm install
```

2.) Configure Environment Variables

Edit the `.env.example` file with your data.

3.) Install the [Dataexplorer Plugin](https://meta.discourse.org/t/data-explorer-plugin/32566) in Discourse.

4.) Add the following query:

```sql
-- [params]
-- string :custom_field_name

SELECT
   u.id AS user_id,
   u.username AS username,
   g.id AS group_id,
   ucf.value  AS user_field_value
FROM
   users u
   JOIN user_custom_fields ucf
         ON ucf.user_id = u.id
   join
      group_users gu
      ON gu.user_id = u.id
   join
      GROUPS g
      ON g.id = gu.group_id
WHERE  ucf.name = :custom_field_name
       AND ucf.value <> ''
ORDER BY g.id
```

5.) Create a custom Field in Discourse for the TeamSpeak UID.

6.) Then you have to know which userfield name you are searching for.

This query will help you:

```sql
SELECT * FROM user_custom_fields
```

## Using the Webhook

This Server provides a Post-URL (`/webhook`) where you can trigger the synchronisation process. The Secret can be set in the Environment Variables.

## Running the tests

At the moment no testing is done. This will be a part of future development.

```bash
$ npm run test
```

## Deployment

```bash
$ npm run build

$ npm run serve
```

_or_

```bash
$ npm run start
```

## Built With

- [Node.js](https://nodejs.org/en/)

- [Express](https://expressjs.com/de/) - The Web-Framework

## Authors

- **SvenC56** - [SvenC56](https://github.com/svenc56)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- [TS3-NodeJS-Library](https://github.com/Multivit4min/TS3-NodeJS-Library)
