import { Context } from 'hono';
import { HonoEnv } from '../types';
import { getTodosByUserId } from '../db/queries';

export const getTodos = async (c: Context<HonoEnv>) => {
  const user = c.get('user');

  try {
    const todos = await getTodosByUserId(user.id);
    return c.json(todos);
  } catch (error) {
    console.error('Failed to fetch todos: ', error);
    return c.json({ error: 'Failed to fetch todos' }, 500);
  }
};

export const createTodo = async (c: Context<HonoEnv>) => {
  const user = c.get('user');
  const todoData = c.req.valid('json');

  try {
    // TODO: Replace with actual database creation
    // const newTodo = await createTodoInDatabase({
    //   ...todoData,
    //   userId: user.id,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });

    const newTodo = {
      id: `todo-${Date.now()}`,
      ...todoData,
      completed: false,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return c.json(newTodo, 201);
  } catch (error) {
    console.error('Failed to create todo: ', error);
    return c.json({ error: 'Failed to create todo' }, 500);
  }
};

export const updateTodo = async (c: Context<HonoEnv>) => {
  const user = c.get('user');
  const { id } = c.req.valid('param');
  const updateData = c.req.valid('json');

  try {
    // TODO: Replace with actual database update
    // const updatedTodo = await updateTodoInDatabase(id, user.id, updateData);

    const updatedTodo = {
      id,
      ...updateData,
      userId: user.id,
      updatedAt: new Date(),
    };

    return c.json(updatedTodo);
  } catch (error) {
    console.error('Failed to update todo: ', error);
    return c.json({ error: 'Failed to update todo' }, 500);
  }
};

export const deleteTodo = async (c: Context<HonoEnv>) => {
  const user = c.get('user');
  const { id } = c.req.valid('param');

  try {
    // TODO: Replace with actual database deletion
    // await deleteTodoFromDatabase(id, user.id);

    return c.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Failed to delete todo: ', error);
    return c.json({ error: 'Failed to delete todo' }, 500);
  }
};

