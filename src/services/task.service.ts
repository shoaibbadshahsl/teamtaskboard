import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getAllTasks = async () => {
  return Task.find().populate('assignedTo', 'name email');
};

export const getTaskById = async (id: string) => {
  const task = await Task.findById(id).populate('assignedTo', 'name email');
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return task;
};

export const createTask = async (data: {
  title: string;
  description?: string;
  status?: 'Pending' | 'In Progress' | 'Done';
  assignedTo?: string;
}) => {
  if (!data.title) {
    throw new BadRequestError('Title is required');
  }

  const allowedStatuses = new Set(['Pending', 'In Progress', 'Done']);
  if (data.status && !allowedStatuses.has(data.status)) {
    throw new BadRequestError('Invalid status value');
  }

  if (data.assignedTo) {
    const user = await User.findById(data.assignedTo);
    if (!user) {
      throw new NotFoundError('Assigned user not found');
    }
  }

  const created = await Task.create(data);

  // Re-query to ensure assignedTo is populated and the response shape matches expected output
  const task = await Task.findById(created._id).populate('assignedTo', 'name email');
  if (!task) {
    throw new NotFoundError('Task not found after creation');
  }
  return task;
};

export const updateTask = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: 'Pending' | 'In Progress' | 'Done';
    assignedTo?: string;
  }
) => {
  const allowedStatuses = new Set(['Pending', 'In Progress', 'Done']);
  if (data.status && !allowedStatuses.has(data.status)) {
    throw new BadRequestError('Invalid status value');
  }

  if (data.assignedTo) {
    const user = await User.findById(data.assignedTo);
    if (!user) {
      throw new NotFoundError('Assigned user not found');
    }
  }

  const task = await Task.findByIdAndUpdate(id, data, { new: true }).populate(
    'assignedTo',
    'name email'
  );
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return task;
};

export const deleteTask = async (id: string) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return { message: 'Task deleted successfully' };
};

export const getDashboardStats = async () => {
  const [
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    activeUsers
  ] = await Promise.all([
    Task.countDocuments({}),
    Task.countDocuments({ status: 'Done' }),
    Task.countDocuments({ status: 'In Progress' }),
    Task.countDocuments({ status: 'Pending' }),
    User.countDocuments({})
  ]);

  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return {
    totalTasks,
    activeUsers,
    completionRate: `${completionRate}%`,
    completedTasks,
    inProgressTasks,
    pendingTasks
  };
};

export const assignTask = async (taskId: string, userId: string) => {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User to be assigned not found');
    }

    const task = await Task.findByIdAndUpdate(
        taskId,
        { assignedTo: userId },
        { new: true }
    ).populate('assignedTo', 'name email');

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    return task;
};