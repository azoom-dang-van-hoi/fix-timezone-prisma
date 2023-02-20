# Problem
Currently, Prisma automatically converts Datetime (Timestamp) to UTC when saving or retrieving data. For example: when saving a `created_at` field with the time `2023-02-20 12:00:00 (in +9 time zone)`, Prisma will convert it to UTC time `2023-02-20 03:00:00`, and in the database, it will store the value `2023-02-20 03:00:00` (regardless of the database timezone). When retrieving the `created_at` field, Prisma will consider `2023-02-20 03:00:00` as UTC time, and the client will format the time according to the local time.
The automatic conversion to UTC by Prisma ensures consistency and avoids timezone-related issues when the server timezone is different from the database timezone. However, in some cases, it can cause unnecessary problems:
- When the database already has existing data, and a module is using Prisma to connect to the database. In this case, there may be conflicts between the data created by Prisma and the old data if the database is in a timezone different from +0.
- When direct database modification is necessary (such as correcting incorrect data or when there is no UI to create new data). At this point, Datetime fields will be saved according to the database timezone, and Prisma may display the wrong Datetime.

# Solution
This issue can be fixed by adding 9 hours when saving the datetime data and subtracting 9 hours when retrieving the data. For new projects with minimal code, the fix can be implemented directly when saving the data. However, for projects that have been operational for some time, this approach can be costly. Upon research, there are three automatic fix options for this issue:
- Changing the default Date object of JS ([link](https://github.com/prisma/prisma/issues/5051#issuecomment-977921944)): As Prisma returns a JS Date object, we can simply change the Date when querying to convert the time from the database timezone to UTC timezone. However, this approach only fixes the issue when retrieving data and does not work for update/insert cases.
- Using Prisma hooks to format data before sending and after returning ([link](https://github.com/prisma/prisma/issues/5051#issuecomment-878106427)): This approach can fix the timezone issue for both update/insert cases. However, it can cause performance issues for Prisma with nested data structures or large amounts of data returned. Additionally, this approach does not handle cases where Datetime fields are created with default values because there is no default time value to convert.
- Using the dbgenerated function when defining the schema ([link](https://github.com/prisma/prisma/issues/5051#issuecomment-1279790199)): Prisma provides the dbgenerated function to represent default values in the schema that Prisma does not have. When using dbgenerated with SQL syntax, Prisma will not intervene, so the default Datetime value will follow the timezone of the database and not be related to Prisma. This approach only fixes fields related to Datetime with default values and when saving data, the Datetime value is not sent.

### I have tried combining the above 3 methods in different cases:
- For formatting data after retrieving it, I used method 1.
- For create/update operations, I used method 2. When creating or updating the `params` structure in the Prisma hook `prisma.$use(async (params, next) => {})`, it's usually quite simple and only involves updating a few dozen records, so using this method in this case doesn't have a significant impact on performance.
```
Update post:
args {
    data: {
       ....
    }
}
Create many post:
args {
    data: [{
       ....
    }]
}
```
- For fields with default values, I used method 3.
# Testing
### Setup:
1. Create database: `yarn dcc up -d`.
2. Install package `yarn`.
3. Migrate database `yarn prisma migrate dev`.
4. Start server `yarn dev`.

### Testing: The `/v1` route uses the regular Prisma config, while the `/v2` route has fixed Prisma's timezone issue.
- Test performance (`route /v2/post/bulk-insert`): For the case of creating/updating a few records, the response time is not significantly affected. I tested creating 1000 records, and the API with the timezone fix had a similar response time.
```
Response time v1 (normal config Prisma): 107.952, 134.357, 121.901, 127.487, 102.211, 96.026, 106.68, 119.202, 105.782, 119.135 
   => Average: `114.073ms`
Response time v2 (fix timezone Prisma): 116.569, 127.815, 128.098, 116.498, 110.355, 117.034, 115.782, 107.002, 124.934, 106.174 
   => Average: `117.026ms`

Concurrency v1 (10s): 254, 271, 264, 263, 276
  => Average: 266
Concurrency v2 (10s): 247, 245, 256, 257, 247
  => Average: 251  
```
- In addition, I have tested with cases such as `create, update, and upsert`, and it still works quite well.
- Note: Some cases need to be retested: rawQuery and querying data with time-related conditions.