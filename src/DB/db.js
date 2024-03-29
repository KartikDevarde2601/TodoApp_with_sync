import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import User from './model/User';
import Todo from './model/Todo';
import migration from './model/migration';
import myschema from './model/schema';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: myschema, // Change this line
  migrations: migration,
  jsi: true,

  onSetUpError: error => {
    console.log(error);
  },
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [User, Todo],
  actionsEnabled: true,
});

export default database;
