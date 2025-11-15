// src/App.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.title.trim().length < 3) {
      alert('Title must be at least 3 characters');
      return;
    }
    
    if (formData.description.trim().length < 5) {
      alert('Description must be at least 5 characters');
      return;
    }

    if (editingId) {
      setTasks(tasks.map(task => 
        task.id === editingId 
          ? { ...task, ...formData }
          : task
      ));
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        created: new Date().toISOString()
      };
      setTasks([newTask, ...tasks]);
    }

    setFormData({ title: '', description: '', priority: 'low' });
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', priority: 'low' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">TaskManager</h1>
            <div className="flex gap-4">
              <button className="text-gray-600 hover:text-gray-900">Home</button>
              <button className="text-gray-600 hover:text-gray-900">Create</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? 'Edit Task' : 'Create Task'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Enter task title"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">All Tasks</h2>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              >
                <Plus size={20} />
                New Task
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="mb-4 text-sm text-gray-600">
              Total: {filteredTasks.length}
            </div>

            {currentTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No tasks found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Created
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentTasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{task.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(task.created).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(task)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(task.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-6 text-sm">
                  <div className="text-gray-600">
                    Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, filteredTasks.length)} of {filteredTasks.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Prev
                    </button>
                    <div className="px-4 py-2">
                      Page {currentPage} / {totalPages || 1}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="text-center mt-8 text-gray-600 text-sm">
          Made with ❤️ — TaskManager
        </div>
      </div>
    </div>
  );
}