import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Languages, PenTool, Plus, TrendingUp, Flame, Check, BarChart3, Target } from 'lucide-react';

const HabitTracker = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Daily Journal', icon: 'PenTool', color: 'from-purple-400 to-pink-400', streak: 0, completedDates: [] },
    { id: 2, name: 'Reading Books', icon: 'BookOpen', color: 'from-blue-400 to-cyan-400', streak: 0, completedDates: [] },
    { id: 3, name: 'Learn Japanese', icon: 'Languages', color: 'from-orange-400 to-red-400', streak: 0, completedDates: [] },
    { id: 4, name: 'Learn Spanish', icon: 'Languages', color: 'from-green-400 to-emerald-400', streak: 0, completedDates: [] },
  ]);
  
  const [activeTab, setActiveTab] = useState('habits');

  const today = new Date().toDateString();

  const iconMap = {
    PenTool: PenTool,
    BookOpen: BookOpen,
    Languages: Languages,
    Calendar: Calendar,
  };

  const toggleHabit = (habitId) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completedDates.includes(today);
        const newCompletedDates = isCompletedToday 
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        
        const newStreak = isCompletedToday ? Math.max(0, habit.streak - 1) : habit.streak + 1;
        
        return { ...habit, completedDates: newCompletedDates, streak: newStreak };
      }
      return habit;
    }));
  };

  const isCompletedToday = (habit) => {
    return habit.completedDates.includes(today);
  };

  const getTotalCompleted = () => {
    return habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  };

  const getCompletionRate = () => {
    const total = habits.length;
    const completed = habits.filter(h => isCompletedToday(h)).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const HabitCard = ({ habit }) => {
    const Icon = iconMap[habit.icon];
    const completed = isCompletedToday(habit);

    return (
      <div 
        onClick={() => toggleHabit(habit.id)}
        className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          completed ? 'ring-2 ring-white ring-opacity-50' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${completed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'})`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${habit.color} opacity-20`}></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${habit.color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {completed && (
              <div className="bg-green-500 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">{habit.name}</h3>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-orange-300">
              <Flame className="w-4 h-4" />
              <span className="font-bold">{habit.streak}</span>
            </div>
            <div className="text-gray-300">
              {habit.completedDates.length} total
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProgressTab = () => {
    return (
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-gray-300 text-sm">Today's Progress</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{getCompletionRate()}%</div>
            <div className="text-gray-400 text-sm">
              {habits.filter(h => isCompletedToday(h)).length} of {habits.length} completed
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-gray-300 text-sm">Best Streak</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {Math.max(...habits.map(h => h.streak), 0)} days
            </div>
            <div className="text-gray-400 text-sm">Keep the fire burning! 🔥</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-6 h-6 text-blue-400" />
              <span className="text-gray-300 text-sm">Total Check-ins</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{getTotalCompleted()}</div>
            <div className="text-gray-400 text-sm">All time completions</div>
          </div>
        </div>

        {/* Individual Habit Stats */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Habit Breakdown
          </h2>
          
          <div className="space-y-6">
            {habits.map(habit => {
              const Icon = iconMap[habit.icon];
              const completionRate = habit.completedDates.length > 0 
                ? Math.round((habit.streak / habit.completedDates.length) * 100) 
                : 0;
              
              return (
                <div key={habit.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${habit.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{habit.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {habit.completedDates.length} completions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-orange-300">
                        <Flame className="w-5 h-5" />
                        <span className="text-2xl font-bold">{habit.streak}</span>
                      </div>
                      <p className="text-gray-400 text-sm">day streak</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${habit.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.min(habit.streak * 10, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Box */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-white" />
            <h3 className="text-white font-bold text-lg">Keep Going!</h3>
          </div>
          <p className="text-white text-opacity-90">
            You're building amazing habits! Remember, consistency is the key to success. Every day you show up, you're one step closer to your goals. 🚀
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            2026 Life Tracker
          </h1>
          <p className="text-gray-300 text-lg">Build consistency, one day at a time</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-2 border border-white border-opacity-20">
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'habits'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Habits
            </div>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'progress'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progress & Streaks
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'habits' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {habits.map(habit => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-center">
              <p className="text-white text-lg font-medium">
                💡 Tip: Click on any habit card to mark it complete for today!
              </p>
            </div>
          </>
        ) : (
          <ProgressTab />
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
