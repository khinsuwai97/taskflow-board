// src/components/Column.tsx

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
                    className={`${columnColors[index % columnColors.length]
                        } rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 min-w-[280px] sm:min-w-[320px] w-full sm:max-w-[320px] flex flex-col shadow-sm flex-shrink-0`}
                >
                    <div {...provided.dragHandleProps} className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between mb-1">
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
                                    className="flex-1 px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg font-bold text-slate-800"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                                    <span className="break-words">{column.title}</span>
                                    <span className="px-1.5 sm:px-2 py-0.5 bg-white/60 rounded-full text-xs font-semibold text-slate-600">
                                        {column.taskIds.length}
                                    </span>
                                </h2>
                            )}

                            <div className="relative ml-2">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-1 sm:p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4 text-slate-600" />
                                </button>

                                {showMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowMenu(false)}
                                        />
                                        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[140px] animate-slide-down">
                                            <button
                                                onClick={() => {
                                                    setIsEditingTitle(true);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                            >
                                                <Edit className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                                Edit Title
                                            </button>
                                            <button
                                                onClick={handleDeleteColumn}
                                                className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                                            >
                                                <Trash2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
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
                                className={`flex-1 space-y-2 sm:space-y-3 min-h-[150px] sm:min-h-[200px] rounded-lg sm:rounded-xl p-1 sm:p-2 transition-colors ${snapshot.isDraggingOver ? 'bg-white/40' : ''
                                    }`}
                            >
                                {column.taskIds.map((taskId, index) => {
                                    const task = tasks[taskId];
                                    if (!task) return null;

                                    return (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? 'opacity-50 rotate-2' : ''
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
                        <div className="mt-2 sm:mt-3 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border border-slate-200 space-y-2 animate-slide-down">
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Task title"
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                                autoFocus
                            />
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Task description"
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm resize-none"
                                rows={2}
                            />
                            <select
                                value={newTask.priority}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })
                                }
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={handleAddTask}
                                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium"
                                >
                                    Add Task
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingTask(false);
                                        setNewTask({ title: '', description: '', priority: 'medium' });
                                    }}
                                    className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-xs sm:text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingTask(true)}
                            className="mt-2 sm:mt-3 w-full px-3 py-2 sm:py-2.5 bg-white/60 hover:bg-white/80 text-slate-700 rounded-lg transition-all flex items-center justify-center gap-2 font-medium text-xs sm:text-sm border-2 border-dashed border-slate-300 hover:border-slate-400"
                        >
                            <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            Add Task
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );
}