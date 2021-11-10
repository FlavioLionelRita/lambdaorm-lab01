# Lab 01

The goal of this lab is to use the Lambdaorm-cli commands

## Pre requirements

### Create database for test

Create file "docker-compose.yaml"

```yaml
version: '3'
services:
  test:
    container_name: lambdaorm-test
    image: mysql:5.7
    restart: always
    environment:
      - MYSQL_DATABASE=test
      - MYSQL_USER=test
      - MYSQL_PASSWORD=test
      - MYSQL_ROOT_PASSWORD=root
    ports:
      - 3306:3306
```

Create MySql database for test:

```sh
docker-compose up -d
```

Create user:

```sh
docker exec lambdaorm-test  mysql --host 127.0.0.1 --port 3306 -uroot -proot -e "GRANT ALL ON *.* TO 'test'@'%' with grant option; FLUSH PRIVILEGES;"
```

### Install lambda ORM CLI

Install the package globally to use the CLI commands to help you create and maintain projects

```sh
npm install lambdaorm-cli -g
```

## Test

### Create project

will create the project folder with the basic structure.

```sh
lambdaorm init -w lab_01
```

position inside the project folder.

```sh
cd lab_01
```

### Complete Schema

In the creation of the project the schema was created but without any entity.
Add the Country entity as seen in the following example

```yaml
app:
  src: src
  data: data
  models: models
  defaultDatabase: lab_01
databases:
  - name: mydb
    dialect: mysql
    schema: countries
    connection:
      host: localhost
      port: 3306
      user: test
      password: test
      database: test
      multipleStatements: true
      waitForConnections: true
      connectionLimit: 10
      queueLimit: 0
schemas:
  - name: countries
    enums: []
    entities:
      - name: Countries
        primaryKey: ["id"]
        uniqueKey: ["name"]
        properties:
          - name: id
            type: integer
            nullable: false
          - name: name
            nullable: false
          - name: alpha2
            nullable: false
            length: 2
          - name: alpha3
            length: 3
```

### Update

```sh
lambdaorm update
```

the file model.ts will be created inside src/models/countries  with the following content

```ts
/* eslint-disable no-use-before-define */
// THIS FILE IS NOT EDITABLE, IS MANAGED BY LAMBDA ORM
import { Queryable } from 'lambdaorm'
export class Country {
	id?: number
	name?: string
	alpha2?: string
	alpha3?: string
}
export interface QryCountry {
	id: number
	name: string
	alpha2: string
	alpha3: string
}
export let Countries: Queryable<QryCountry>
```

### Sync

```sh
lambdaorm sync
```

It will generate the table in database and a status file in the "data" folder, with the following content:

```json
{
	"schema": {
		"name": "lab_01",
		"entities": [
			{
				"name": "Country",
				"mapping": "COUNTRY",
				"primaryKey": [ "id" ],
				"uniqueKey": [ "name"	],
				"properties": [
					{	"name": "id", "mapping": "id", "type": "integer", "nullable": false },
					{ "name": "name", "mapping": "name", "type": "string","length": 80, "nullable": false },
					{ "name": "alpha2", "mapping": "alpha2", "type": "string", "length": 2, "nullable": false },
					{ "name": "alpha3", "mapping": "alpha3", "type": "string", "length": 3, "nullable": false }
				],
				"relations": [],
				"indexes": []
			}
		],
		"enums": []
	},
	"mapping": {},
	"pending": []
}
```

### Popuplate Data

At the root of the project we create a file called countries.json and add the records found in the following link

[cuntries](https://github.com/stefangabos/world_countries/blob/master/data/en/countries.json)

then we execute

```sh
lambdaorm run -e "Countries.bulkInsert()" -d ./countries.json
```

### Export Data

```sh
lambdaorm export 
```

will generate a file called "mydb-export.json"

### Import Data

Before importing we are going to delete all the records:

```sh
lambdaorm run -e "Countries.deleteAll()"
```

We verify that there are no records left:

```sh
lambdaorm run -e "Countries"
```

we import the file that we generate when exporting

```sh
lambdaorm import -s ./mydb-export.json
```

We verify that the data was imported.

```sh
lambdaorm run -e "Countries"
```

### Drop

remove all tables from the schema and delete the state file, mydb-state.json

```sh
lambdaorm drop
```

## End

### Remove database for test

Remove MySql database:

```sh
docker-compose down
```
