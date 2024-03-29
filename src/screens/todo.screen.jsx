import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons/faPenToSquare';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import {Formik} from 'formik';
import {withObservables} from '@nozbe/watermelondb/react';
import {Q} from '@nozbe/watermelondb';
import database from '../DB/db';

const TodoScreen = ({route, user, todos}) => {
  const [height, setHeight] = useState(0);
  const [isTodoUIVisible, setIsTodoUIVisible] = useState(false);
  const [formType, setFormType] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const handleAddTodo = async (values, {resetForm}) => {
    const {title, description} = values;
    await user.createTodo({title, description}).then(() => {
      resetForm();
      setIsTodoUIVisible(false);
    });
  };

  const handleUpdateTodo = async (values, {resetForm}) => {
    const {title, description} = values;
    await selectedTodo.updateTodo({title, description}).then(() => {
      resetForm();
      setIsTodoUIVisible(false);
    });
  };

  const handleCheckboxChange = async todo => {
    todo.toggleIsCompleted();
  };

  const handleDelete = async todo => {
    todo.deleteTodo();
  };

  const addTodo = () => {
    setIsTodoUIVisible(true);
    setFormType('create');
  };

  const updateTodo = todo => () => {
    setSelectedTodo(todo);
    setIsTodoUIVisible(true);
    setFormType('update');
  };

  const TodoCreate = () => {
    return (
      <View style={styles.FormikContainer}>
        <Formik
          initialValues={{title: '', description: ''}}
          onSubmit={handleAddTodo}>
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
                  {height: Math.max(35, height)},
                ]}
                placeholder="Enter description"
                multiline
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                onContentSizeChange={event => {
                  setHeight(event.nativeEvent.contentSize.height);
                }}
              />
              <Button title="Add Todo" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    );
  };

  const TodoUpdate = () => {
    return (
      <View style={styles.FormikContainer}>
        <Formik
          initialValues={{
            title: selectedTodo ? selectedTodo.title : '',
            description: selectedTodo ? selectedTodo.description : '',
          }}
          onSubmit={handleUpdateTodo}>
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
                  {height: Math.max(35, height)},
                ]}
                placeholder="Enter description"
                multiline
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                onContentSizeChange={event => {
                  setHeight(event.nativeEvent.contentSize.height);
                }}
              />
              <Button title="Update Todo" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleheader}>Add Todo</Text>
        <TouchableOpacity onPress={addTodo}>
          <FontAwesomeIcon icon={faCirclePlus} size={30} color="#2596be" />
        </TouchableOpacity>
      </View>
      {isTodoUIVisible && formType ? (
        formType === 'create' ? (
          <TodoCreate />
        ) : (
          <TodoUpdate />
        )
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.todoListContainer}>
        {todos.map((todo, index) => (
          <View key={index} style={styles.todo}>
            <Text style={styles.title}>{todo.title}</Text>
            <Text style={styles.description}>{todo.description}</Text>
            <View style={styles.operationalContainer}>
              <View style={styles.iconContainer}>
                <BouncyCheckbox
                  size={25}
                  fillColor="green"
                  unfillColor="#FFFFFF"
                  isChecked={todo.isCompleted}
                  onPress={() => handleCheckboxChange(todo)}
                />

                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => handleDelete(todo)}>
                  <FontAwesomeIcon icon={faTrash} size={25} color="#FF7F7F" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={updateTodo(todo)}>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    size={25}
                    color="grey"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const enhance = withObservables(['route'], ({route}) => ({
  user: database.collections.get('users').findAndObserve(route.params.userId),
  todos: database.collections
    .get('todos')
    .query(Q.where('user_id', route.params.userId))
    .observe(),
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    flexDirection: 'column',
  },
  titleheader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  FormikContainer: {
    marginBottom: 60, // Adjust this margin to control the gap
  },
  todoListContainer: {
    flex: 1, // Set the todoListContainer to take the remaining space
  },
  input: {
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  todo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    marginBottom: 12,
  },
  description: {
    color: '#666',
    fontSize: 16,
  },
  operationalContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
});

export default enhance(TodoScreen);
