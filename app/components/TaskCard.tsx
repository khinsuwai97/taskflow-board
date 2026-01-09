// src/components/TaskCard.tsx

'use client';

import { Task } from '@/types';
import { Trash2, Edit, Clock } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { deleteTask, updateTask } from '../redux/boardSlice';

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedPriority, setEditedPriority] = useState(task.priority);

    const handleDelete = () => {
        if (window.confirm('Delete this task?')) {
            dispatch(deleteTask(task.id));
        }
    };

    const handleUpdate = () => {
        if (!editedTitle.trim()) return;

        dispatch(
            updateTask({
                taskId: task.id,
                updates: {
                    title: editedTitle,
                    description: editedDescription,
                    priority: editedPriority,
                },
            })
        );
        setIsEditing(false);
    };

    const priorityColors = {
        low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        medium: 'bg-amber-100 text-amber-800 border-amber-300',
        high: 'bg-rose-100 text-rose-800 border-rose-300',
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md border border-slate-200 space-y-3 md:space-y-4 animate-slide-down">
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-medium"
                    placeholder="Task title"
                    autoFocus
                />
                <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base resize-none"
                    rows={4}
                    placeholder="Task description"
                />
                <select
                    value={editedPriority}
                    onChange={(e) => setEditedPriority(e.target.value as Task['priority'])}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <button
                        onClick={handleUpdate}
                        className="flex-1 px-4 py-2.5 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base font-medium"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                            setEditedTitle(task.title);
                            setEditedDescription(task.description);
                            setEditedPriority(task.priority);
                            setIsEditing(false);
                        }}
                        className="flex-1 px-4 py-2.5 md:py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm sm:text-base font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing group">
            <div className="flex items-start justify-between mb-3 md:mb-4 gap-3">
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base md:text-lg leading-tight flex-1 break-words">
                    {task.title}
                </h3>
                <div className="flex gap-1.5 md:gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit task"
                    >
                        <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-slate-500" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 sm:p-2 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete task"
                    >
                        <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-rose-500" />
                    </button>
                </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-4 md:mb-5 line-clamp-3 break-words leading-relaxed">{task.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3">
                <span
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${priorityColors[task.priority]
                        }`}
                >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{new Date(task.createdAt).toLocaleDateString()}</span>
                    <span className="sm:hidden">{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
            </div>
        </div>
    );
}