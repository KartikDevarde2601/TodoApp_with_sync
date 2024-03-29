import {Model} from '@nozbe/watermelondb';
import {children, date, text, writer} from '@nozbe/watermelondb/decorators';
export default class User extends Model {
  static table = 'users';
  static associations = {
    todos: {type: 'has_many', foreignKey: 'user_id'},
  };

  @text('name') name;
  @text('email') email;
  @text('password') password;
  @date('created_at') createdAt;
  @date('updated_at') updatedAt;
  @children('todos') todos;

  @writer async createTodo({title, description}) {
    return this.collections.get('todos').create(todo => {
      todo.user.set(this);
      todo.title = title;
      todo.description = description;
      todo.isCompleted = false;
    });
  }
}
