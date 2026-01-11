'use client';

import { Column as ColumnType } from '@/types';
import { TaskCard } from './TaskCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { Plus, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { addTask, deleteColumn, updateColumn } from '../redux/boardSlice';

interface ColumnProps {
  column: ColumnType;
  index: number;
}

export function Column({ column, index }: ColumnProps) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.board.tasks);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    description: '',
    priority: 'medium',
  });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      dispatch(addTask({ columnId: column.id, task: newTask }));
      setNewTask({ title: '', description: '', priority: 'medium' });
      setIsAddingTask(false);
    }
  };

  const handleDeleteColumn = () => {
    if (window.confirm(`Delete "${column.title}" and all its tasks?`)) {
      dispatch(deleteColumn(column.id));
    }
    setShowMenu(false);
  };

  const handleUpdateTitle = () => {
    if (editedTitle.trim()) {
      dispatch(updateColumn({ columnId: column.id, title: editedTitle }));
    } else {
      setEditedTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const columnColors = [
    'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200',
    'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
    'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
    'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
  ];

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${
            columnColors[index % columnColors.length]
          } rounded-xl p-4 border-2
            min-w-[280px] w-[280px]
            sm:min-w-[320px] sm:w-[320px]
            md:min-w-[360px] md:w-[360px]
            flex flex-col shadow-md hover:shadow-lg transition-shadow shrink-0 snap-start`}
        >
          <div {...provided.dragHandleProps} className="mb-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdateTitle();
                    if (e.key === 'Escape') {
                      setEditedTitle(column.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base font-bold text-slate-800"
                  autoFocus
                />
              ) : (
                <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2 flex-1 min-w-0">
                  <span className="truncate">{column.title}</span>
                  <span className="px-2 py-1 bg-white/60 rounded-full text-xs font-semibold text-slate-600 flex-shrink-0">
                    {column.taskIds.length}
                  </span>
                </h2>
              )}

              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  aria-label="Column menu"
                >
                  <MoreVertical className="w-5 h-5 text-slate-600" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[160px] animate-slide-down">
                      <button
                        onClick={() => {
                          setIsEditingTitle(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Title
                      </button>
                      <button
                        onClick={handleDeleteColumn}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Column
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 space-y-3 min-h-[200px] rounded-lg p-2 transition-colors ${
                  snapshot.isDraggingOver ? 'bg-white/40' : ''
                }`}
              >
                {column.taskIds.map((taskId, index) => {
                  const task = tasks[taskId];
                  if (!task) return null;

                  return (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${
                            snapshot.isDragging ? 'opacity-50 rotate-2' : ''
                          } transition-all`}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {isAddingTask ? (
            <div className="mt-3 bg-white rounded-lg p-3 shadow-sm border border-slate-200 space-y-3 animate-slide-down">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Task title"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                autoFocus
              />
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Task description"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                rows={3}
              />
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTask({
                      title: '',
                      description: '',
                      priority: 'medium',
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="mt-3 w-full px-3 py-2.5 bg-white/60 hover:bg-white/80 text-slate-700 rounded-lg transition-all flex items-center justify-center gap-2 font-medium text-sm border-2 border-dashed border-slate-300 hover:border-slate-400"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}
