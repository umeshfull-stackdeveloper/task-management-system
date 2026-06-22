import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { KanbanSkeleton } from '../components/LoadingSkeletons';
import { useToast } from '../context/ToastContext';
import { Plus, Columns, Sparkles } from 'lucide-react';

const Kanban = ({
  triggerFetchFlag,
  setTriggerFetchFlag,
  taskToEdit,
  setTaskToEdit,
  isTaskModalOpen,
  setIsTaskModalOpen,
  globalSearch,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Deletion confirm modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const { addToast } = useToast();

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      addToast('Failed to fetch tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [triggerFetchFlag]);

  // Filtering based on navbar search
  const filteredTasks = tasks.filter((t) => {
    if (!globalSearch) return true;
    const term = globalSearch.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term))
    );
  });

  const handleDragStart = (e, task) => {
    setDraggingTaskId(task._id);
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    setDragOverColumn(null);
    
    if (!taskId) return;

    const targetTask = tasks.find((t) => t._id === taskId);
    if (!targetTask || targetTask.status === targetStatus) return;

    try {
      const response = await api.put(`/tasks/${taskId}`, { status: targetStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? response.data : t))
      );
      addToast(`Moved "${response.data.title}" to ${targetStatus}`, 'success');
      setTriggerFetchFlag((prev) => !prev);
    } catch (err) {
      addToast('Failed to update task status.', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === id ? response.data : t)));
      addToast(`Updated task status to ${newStatus}`, 'success');
      setTriggerFetchFlag((prev) => !prev);
    } catch (err) {
      addToast('Failed to change status.', 'error');
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

  if (loading) {
    return <KanbanSkeleton />;
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Board Header options */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Columns size={18} className="text-indigo-500" />
            <span>Interactive Kanban Workspace</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Drag cards between columns to transition lifecycle stages instantly
          </p>
        </div>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow shadow-indigo-600/10 hover:brightness-110 active:scale-95 transition-all duration-150"
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Board Columns workspace */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {['Pending', 'In Progress', 'Completed'].map((colStatus) => {
          const columnTasks = filteredTasks.filter((t) => t.status === colStatus);
          const columnColors = {
            Pending: 'border-t-slate-400/80',
            'In Progress': 'border-t-indigo-500',
            Completed: 'border-t-emerald-500',
          };

          const isOver = dragOverColumn === colStatus;

          return (
            <div
              key={colStatus}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverColumn !== colStatus) setDragOverColumn(colStatus);
              }}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, colStatus)}
              className={`flex flex-col rounded-3xl p-5 border-t-4 transition-all duration-200 ${
                columnColors[colStatus]
              } ${
                isOver
                  ? 'bg-indigo-50/20 border-indigo-300 dark:bg-indigo-950/15 dark:border-indigo-900/50'
                  : 'bg-white shadow-sm border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-800/80'
              } border overflow-hidden`}
            >
              {/* Column Title banner */}
              <div className="flex items-center justify-between mb-4 shrink-0">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {colStatus}
                </span>
                <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 dark:bg-slate-850 dark:text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              {/* Cards Container stack scrollable */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 pb-4 scroll-thin">
                {columnTasks.length === 0 ? (
                  <div className="flex h-full min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/40 p-6 text-center dark:border-slate-800/45">
                    <Sparkles className="text-slate-350 dark:text-slate-700 mb-2" size={24} />
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Stage is Empty
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5 leading-relaxed">
                      Drag cards here to update status
                    </p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteTrigger}
                      onStatusChange={handleStatusChange}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal Editor */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleModalSubmit}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation prompt */}
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

export default Kanban;
