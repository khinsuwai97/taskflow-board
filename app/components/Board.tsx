// src/components/Board.tsx

'use client';

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { moveTask, reorderTask, addColumn } from '../redux/boardSlice';
import { Column } from './Column';
import { Plus, Layers, Menu } from 'lucide-react';
import { useState } from 'react';

export function Board() {
    const dispatch = useAppDispatch();
    const { columns, columnOrder, tasks } = useAppSelector((state) => state.board);
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [showStats, setShowStats] = useState(false);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === 'task') {
            if (source.droppableId === destination.droppableId) {
                dispatch(
                    reorderTask({
                        columnId: source.droppableId,
                        sourceIndex: source.index,
                        destIndex: destination.index,
                    })
                );
            } else {
                dispatch(
                    moveTask({
                        taskId: draggableId,
                        sourceColumnId: source.droppableId,
                        destColumnId: destination.droppableId,
                        sourceIndex: source.index,
                        destIndex: destination.index,
                    })
                );
            }
        }
    };

    const handleAddColumn = () => {
        if (newColumnTitle.trim()) {
            dispatch(addColumn(newColumnTitle));
            setNewColumnTitle('');
            setIsAddingColumn(false);
        }
    };

    const totalTasks = Object.keys(tasks).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto max-w-480 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-4 sm:py-5 md:py-6 ">
                    <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-6">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg md:rounded-xl shadow-md flex-shrink-0">
                                <Layers className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                                    TaskFlow Board
                                </h1>
                                <p className="text-xs sm:text-sm md:text-base text-slate-600 hidden sm:block">Organize your workflow efficiently</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
                            {/* Mobile stats toggle */}
                            <button
                                onClick={() => setShowStats(!showStats)}
                                className="sm:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Menu className="w-5 h-5 text-slate-600" />
                            </button>

                            {/* Desktop stats */}
                            <div className="hidden sm:flex items-center gap-2 md:gap-3 lg:gap-4">
                                <div className="px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 bg-indigo-50 rounded-lg md:rounded-xl border border-indigo-200">
                                    <p className="text-xs md:text-sm lg:text-base font-medium text-indigo-900 whitespace-nowrap">
                                        {columnOrder.length} {columnOrder.length === 1 ? 'Column' : 'Columns'}
                                    </p>
                                </div>
                                <div className="px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 bg-purple-50 rounded-lg md:rounded-xl border border-purple-200">
                                    <p className="text-xs md:text-sm lg:text-base font-medium text-purple-900 whitespace-nowrap">
                                        {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile stats dropdown */}
                    {showStats && (
                        <div className="sm:hidden mt-3 md:mt-4 flex gap-2 md:gap-3 animate-slide-down">
                            <div className="flex-1 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="text-xs font-medium text-indigo-900 text-center">
                                    {columnOrder.length} {columnOrder.length === 1 ? 'Column' : 'Columns'}
                                </p>
                            </div>
                            <div className="flex-1 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-xs font-medium text-purple-900 text-center">
                                    {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Board */}
            <div className="container mx-auto max-w-480 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-columns" direction="horizontal" type="column">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-8 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                            >
                                {columnOrder.map((columnId, index) => {
                                    const column = columns[columnId];
                                    return <Column key={column.id} column={column} index={index} />;
                                })}
                                {provided.placeholder}

                                {/* Add Column Button */}
                                {isAddingColumn ? (
                                    <div className="min-w-70 sm:min-w-[320px] md:min-w-85 lg:min-w-90 max-w-90 bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-slate-200 shadow-sm animate-slide-down flex-shrink-0">
                                        <input
                                            type="text"
                                            value={newColumnTitle}
                                            onChange={(e) => setNewColumnTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddColumn();
                                                if (e.key === 'Escape') {
                                                    setIsAddingColumn(false);
                                                    setNewColumnTitle('');
                                                }
                                            }}
                                            placeholder="Column title"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base mb-4"
                                            autoFocus
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                            <button
                                                onClick={handleAddColumn}
                                                className="flex-1 px-4 py-2.5 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base font-medium"
                                            >
                                                Add Column
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAddingColumn(false);
                                                    setNewColumnTitle('');
                                                }}
                                                className="flex-1 px-4 py-2.5 md:py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm sm:text-base font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingColumn(true)}
                                        className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] lg:min-w-[360px] max-w-[360px] h-[120px] sm:h-[140px] md:h-[160px] bg-white/60 hover:bg-white/80 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl md:rounded-2xl transition-all flex flex-col items-center justify-center gap-3 md:gap-4 text-slate-600 hover:text-indigo-600 group flex-shrink-0"
                                    >
                                        <div className="p-3 md:p-4 bg-slate-100 group-hover:bg-indigo-100 rounded-lg md:rounded-xl transition-colors">
                                            <Plus className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                                        </div>
                                        <span className="font-medium text-sm sm:text-base md:text-lg">Add Column</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}