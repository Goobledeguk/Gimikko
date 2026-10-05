import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  Search,
  X,
  Smartphone,
  Code,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Sun,
  Moon,
  FileCode,
  Calendar,
  CheckSquare,
  ChevronRight,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Work', label: 'Work', icon: '💼', badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { id: 'Personal', label: 'Personal', icon: '🏠', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { id: 'Health', label: 'Health', icon: '🏋️', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'Shopping', label: 'Shopping', icon: '🛒', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
];

const PRIORITIES = [
  { id: 'low', label: 'Low', badge: '🟢', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' },
  { id: 'medium', label: 'Med', badge: '🟡', color: 'text-amber-400 bg-amber-950/40 border-amber-800/50' },
  { id: 'high', label: 'High', badge: '🔴', color: 'text-rose-400 bg-rose-950/40 border-rose-800/50' }
];

const INITIAL_TASKS = [
  { id: '1', title: 'Implement React Native FlatList optimizations', completed: false, priority: 'high', category: 'Work', time: '10:00 AM' },
  { id: '2', title: 'Pick up weekly groceries and snacks', completed: true, priority: 'medium', category: 'Shopping', time: '11:30 AM' },
  { id: '3', title: '30-minute cardio session at gym', completed: false, priority: 'low', category: 'Health', time: '05:00 PM' }
];

const SOURCE_FILES = {
  'App.js': `import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native';
import TaskItem from './TaskItem';
import { styles } from './styles';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Learn React Native state hooks', completed: false, priority: 'high' },
    { id: '2', title: 'Build custom TouchableOpacity buttons', completed: true, priority: 'medium' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleAddTask = () => {
    if (!inputText.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: inputText.trim(),
      completed: false,
      priority: 'medium'
    };
    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>{tasks.filter(t => !t.completed).length} items remaining</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a new task..."
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found. Add one above!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}`,

  'TaskItem.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default function TaskItem({ item, onToggle, onDelete }) {
  return (
    <View style={styles.taskCard}>
      <TouchableOpacity 
        style={styles.taskTouchArea} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.checkIcon}>
          {item.completed ? '✓' : '○'}
        </Text>
        <Text style={[styles.taskTitle, item.completed && styles.completedTitle]}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}`,

  'styles.js': `import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#818cf8',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 15,
    height: 48,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addButton: {
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 10,
    height: 48,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  taskCard: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  taskTouchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 18,
    color: '#6366f1',
    marginRight: 12,
    fontWeight: 'bold',
  },
  taskTitle: {
    color: '#f8fafc',
    fontSize: 15,
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: '#f43f5e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
});`
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [inputText, setInputText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Simulator UI Shell states
  const [viewMode, setViewMode] = useState('simulator'); // 'simulator' | 'code'
  const [activeCodeFile, setActiveCodeFile] = useState('App.js');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddTask = () => {
    if (!inputText.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: inputText.trim(),
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
      time: 'Just now'
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
    showToast('Task added to FlatList!');
  };

  const handleToggleTask = (id) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextState = !task.completed;
          showToast(nextState ? 'Marked as completed' : 'Marked as pending');
          return { ...task, completed: nextState };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed from list');
  };

  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    showToast('Reset to sample tasks');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'pending'
          ? !task.completed
          : task.completed;

      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  const remainingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const copyCode = () => {
    const textToCopy = SOURCE_FILES[activeCodeFile];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans">
      
      {/* Top Application Header */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              TaskFlow <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">React Native App</span>
            </h1>
            <p className="text-xs text-slate-400">Mobile Component & Dynamic List Interactive Simulator</p>
          </div>
        </div>

        {/* Simulator / Source Code View Toggle */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-800">
            <button
              onClick={() => setViewMode('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              App Simulator
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Source Code
            </button>
          </div>

          {viewMode === 'simulator' && (
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white text-xs transition-colors"
              title="Toggle Phone Screen Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Content */}
      <main className="w-full max-w-4xl flex items-center justify-center flex-1">
        {viewMode === 'code' ? (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Code Tabs Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {Object.keys(SOURCE_FILES).map(fileName => (
                  <button
                    key={fileName}
                    onClick={() => setActiveCodeFile(fileName)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeCodeFile === fileName
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    {fileName}
                  </button>
                ))}
              </div>

              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Code!' : 'Copy File'}
              </button>
            </div>

            {/* Code Viewer Panel */}
            <div className="p-4 bg-slate-950 overflow-x-auto max-h-[620px]">
              <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                <code>{SOURCE_FILES[activeCodeFile]}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[400px] rounded-[48px] border-[10px] border-slate-800 bg-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-2 relative">
            
            {/* Simulated iPhone Camera Island / Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-end px-2 gap-1 border border-slate-800">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-900/40"></div>
            </div>

            {/* Phone Screen Frame */}
            <div
              className={`w-full h-[720px] rounded-[38px] overflow-hidden flex flex-col transition-colors duration-300 relative ${
                isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
              }`}
            >
              {/* Toast Banner Notification */}
              {toastMessage && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg font-semibold animate-bounce flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  {toastMessage}
                </div>
              )}

              {/* Status Bar Header */}
              <div className={`px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold select-none ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
                    <div className="h-full w-3/4 bg-current rounded-xs"></div>
                  </div>
                </div>
              </div>

              {/* React Native Application Layout Inside Mobile Screen */}
              <div className="flex-1 flex flex-col overflow-hidden px-4 pt-1 pb-4">
                
                {/* Header Title & Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight">TaskFlow</h2>
                      <p className={`text-xs ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {remainingCount} item{remainingCount === 1 ? '' : 's'} remaining
                      </p>
                    </div>

                    {/* Completion Ring Badge */}
                    <div className="flex items-center gap-2 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      <span className="text-xs font-bold text-indigo-400">{completionPercent}%</span>
                    </div>
                  </div>
                </div>

                {}
                {/* Input Card Container (<TextInput> & <TouchableOpacity> simulation) */}
                <div className={`p-3 rounded-2xl border mb-3 transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                      placeholder="Type a new task..."
                      className={`flex-1 text-xs rounded-xl px-3 py-2.5 outline-none transition-all ${
                        isDarkMode
                          ? 'bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:border-indigo-500'
                          : 'bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                    <button
                      onClick={handleAddTask}
                      disabled={!inputText.trim()}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
                        inputText.trim()
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Priority and Category selection */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPriority(p.id)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                            selectedPriority === p.id
                              ? `${p.color} font-bold ring-1 ring-current`
                              : isDarkMode
                              ? 'bg-slate-950 text-slate-400 border-slate-800'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {p.badge} {p.label}
                        </button>
                      ))}
                    </div>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`text-[10px] py-1 px-1.5 rounded-md border outline-none cursor-pointer ${
                        isDarkMode
                          ? 'bg-slate-950 text-slate-300 border-slate-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {}
                {/* Search & Filter Bar */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`flex p-0.5 rounded-xl border flex-1 ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300'
                    }`}>
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'pending', label: 'Pending' },
                        { id: 'completed', label: 'Done' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setFilter(tab.id)}
                          className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            filter === tab.id
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-28">
                      <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-6 pr-2 py-1 text-[11px] rounded-xl border outline-none ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {}
                {/* Simulated FlatList Scrollable Area */}
                <div className="flex-1 overflow-y-auto pr-0.5 space-y-2">
                  {filteredTasks.length === 0 ? (
                    /* Empty State View */
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-300">No tasks found</h3>
                      <p className="text-[11px] text-slate-500 max-w-[180px]">
                        {searchQuery ? `No matches for "${searchQuery}"` : 'Your task list is completely clear!'}
                      </p>
                      {tasks.length === 0 && (
                        <button
                          onClick={handleResetData}
                          className="mt-2 text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reload Sample Data
                        </button>
                      )}
                    </div>
                  ) : (
                    /* FlatList Item Rows */
                    filteredTasks.map((item) => {
                      const categoryObj = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[0];
                      const priorityObj = PRIORITIES.find(p => p.id === item.priority) || PRIORITIES[1];

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                            item.completed
                              ? isDarkMode
                                ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                                : 'bg-slate-100 border-slate-200 opacity-65'
                              : isDarkMode
                              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                          }`}
                        >
                          {/* Complete Checkbox Touchable */}
                          <button
                            onClick={() => handleToggleTask(item.id)}
                            className="text-indigo-500 hover:scale-110 active:scale-95 transition-transform"
                            title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                            ) : (
                              <Circle className={`w-5 h-5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                            )}
                          </button>

                          {/* Item Content */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium break-words leading-tight ${
                                item.completed
                                  ? 'line-through text-slate-500'
                                  : isDarkMode
                                  ? 'text-slate-100'
                                  : 'text-slate-800'
                              }`}
                            >
                              {item.title}
                            </p>

                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`text-[8px] px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${categoryObj.badgeColor}`}>
                                <span>{categoryObj.icon}</span>
                                <span>{categoryObj.label}</span>
                              </span>
                              <span className={`text-[8px] px-1.5 py-0.2 rounded border ${priorityObj.color}`}>
                                {priorityObj.badge} {priorityObj.label}
                              </span>
                            </div>
                          </div>

                          {/* Delete Touchable */}
                          <button
                            onClick={() => handleDeleteTask(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Bar */}
                <div className="pt-2 mt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-500">
                  <button
                    onClick={handleResetData}
                    className="hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset List
                  </button>
                  <span>React Native FlatList Demo</span>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-slate-500">
        TaskFlow Simulator &bull; Powered by React Native Component Architecture
      </footer>
    </div>
  );
}