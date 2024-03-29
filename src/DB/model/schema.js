import {appSchema, tableSchema} from '@nozbe/watermelondb';

const myschema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'password', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'todos',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'is_completed', type: 'boolean'},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
  ],
});

export default myschema;
