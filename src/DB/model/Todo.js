import {
  relation,
  text,
  field,
  date,
  writer,
} from '@nozbe/watermelondb/decorators';
import {Model} from '@nozbe/watermelondb';

export default class Todo extends Model {
  static table = 'todos';
  static associations = {
    users: {type: 'belongs_to', key: 'user_id'},
  };

  @text('title') title;
  @text('description') description;
  @field('is_completed') isCompleted;
  @date('created_at') createdAt;
  @date('updated_at') updatedAt;
  @relation('users', 'user_id') user;

  @writer async toggleIsCompleted() {
    await this.update(todo => {
      todo.isCompleted = !todo.isCompleted;
    });
  }

  @writer async updateTodo({title, description}) {
    await this.update(todo => {
      todo.title = title;
      todo.description = description;
    });
  }

  @writer async deleteTodo() {
    await this.markAsDeleted();
  }
}
