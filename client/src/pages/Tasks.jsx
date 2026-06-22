import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { ListSkeleton } from '../components/LoadingSkeletons';
import { useToast } from '../context/ToastContext';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Tasks = ({
  triggerFetchFlag,
  setTriggerFetchFlag,
  taskToEdit,
  setTaskToEdit,
  isTaskModalOpen,
  setIsTaskModalOpen,
  globalSearch,
  setGlobalSearch,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Deletion Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const { addToast } = useToast();

  // Debouncing effect for search text using globalSearch prop
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(globalSearch || '');
    }, 400);

    return () => clearTimeout(handler);
  }, [globalSearch]);

  const fetchFilteredTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      
      // If sorting by priority, we fetch without backend sorting and sort on client
      if (sortBy && !sortBy.startsWith('priority')) {
        params.sortBy = sortBy;
      }

      const response = await api.get('/tasks', { params });
      let fetchedTasks = response.data;

      // Handle custom client-side priority weight sorting
      if (sortBy && sortBy.startsWith('priority')) {
        const desc = sortBy.endsWith('desc');
        const priorityWeights = { High: 3, Medium: 2, Low: 1 };
        
        fetchedTasks.sort((a, b) => {
          const weightA = priorityWeights[a.priority] || 0;
          const weightB = priorityWeights[b.priority] || 0;
          return desc ? weightB - weightA : weightA - weightB;
        });
      }

      setTasks(fetchedTasks);
    } catch (err) {
      addToast('Failed to retrieve task records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredTasks();
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, triggerFetchFlag]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === id ? response.data : t)));
      addToast(`Task moved to ${newStatus}`, 'success');
      setTriggerFetchFlag((prev) => !prev);
    } catch (err) {
      addToast('Failed to modify task status.', 'error');
    }
  };

  const handleDeleteTrigger = (id) => {
    setTaskToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDeleteId) return;
    try {
      await api.delete(`/tasks/${taskToDeleteId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDeleteId));
      addToast('Task deleted successfully', 'success');
      setTriggerFetchFlag((prev) => !prev);
    } catch (err) {
      addToast('Failed to delete task', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDeleteId(null);
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleModalSubmit = async (taskData) => {
    try {
      if (taskToEdit) {
        const response = await api.put(`/tasks/${taskToEdit._id}`, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === taskToEdit._id ? response.data : t))
        );
        addToast('Task updated successfully', 'success');
      } else {
        const response = await api.post('/tasks', taskData);
        setTasks((prev) => [response.data, ...prev]);
        addToast('Task created successfully', 'success');
      }
      setTriggerFetchFlag((prev) => !prev);
    } catch (err) {
      addToast('Failed to save task details.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filters Bar */}
      <div className="rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 space-y-4">
        
        {/* Search Input synchronized with global search */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={globalSearch || ''}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search tasks by title or details..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-950 transition-all duration-200"
            />
          </div>
        </div>

        {/* Pickers & Sorters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/40">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
            <SlidersHorizontal size={14} />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-355 dark:focus:border-indigo-400 transition-all"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-355 dark:focus:border-indigo-400 transition-all"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Sort By options */}
          <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-355 dark:focus:border-indigo-400 transition-all"
            >
              <option value="createdAt:desc">Created: Newest</option>
              <option value="createdAt:asc">Created: Oldest</option>
              <option value="dueDate:asc">Due Date: Closest</option>
              <option value="dueDate:desc">Due Date: Furthest</option>
              <option value="priority:desc">Priority: High to Low</option>
              <option value="priority:asc">Priority: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Results list */}
      {loading ? (
        <ListSkeleton />
      ) : tasks.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            No matching task records found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDeleteTrigger}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Universal Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleModalSubmit}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default Tasks;
