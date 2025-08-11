import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Target,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Plus,
  Bell,
  Mail,
  Smartphone,
  TrendingUp,
  BookOpen,
  Award,
  Zap,
  BarChart3,
  Star,
  Flag,
  Compass,
  Sun,
  Moon,
  Edit,
  Trash2,
  Send,
  User
} from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import { useLanguage } from '@/components/ui/language-provider';
import { LanguageSelector } from '@/components/ui/language-selector';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/lib/auth';

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  status: 'Active' | 'Completed' | 'Paused';
  habits: Habit[];
}

interface Habit {
  id: number;
  title: string;
  description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  streak: number;
  completedDates: string[];
  reminderEnabled: boolean;
  reminderTime: string;
  reminderMethod: 'Email' | 'SMS' | 'Both';
}

const SAMPLE_GOALS: Goal[] = [
  {
    id: 1,
    title: "Master React Development",
    description: "Become proficient in React, Redux, and modern frontend development practices",
    category: "Skill Development",
    deadline: "2024-06-30",
    priority: "High",
    progress: 65,
    status: "Active",
    habits: [
      {
        id: 1,
        title: "Code React for 2 hours daily",
        description: "Practice React development through projects and tutorials",
        frequency: "Daily",
        streak: 12,
        completedDates: ['2024-01-01', '2024-01-02', '2024-01-03'],
        reminderEnabled: true,
        reminderTime: "09:00",
        reminderMethod: "Email"
      },
      {
        id: 2,
        title: "Complete React course modules",
        description: "Finish weekly modules of advanced React course",
        frequency: "Weekly",
        streak: 3,
        completedDates: ['2024-01-01', '2024-01-08'],
        reminderEnabled: true,
        reminderTime: "19:00",
        reminderMethod: "Both"
      }
    ]
  },
  {
    id: 2,
    title: "Build Professional Portfolio",
    description: "Create a comprehensive portfolio showcasing my skills and projects",
    category: "Career Development",
    deadline: "2024-04-15",
    priority: "High",
    progress: 30,
    status: "Active",
    habits: [
      {
        id: 3,
        title: "Work on portfolio projects",
        description: "Dedicate time to building portfolio projects",
        frequency: "Daily",
        streak: 5,
        completedDates: ['2024-01-01', '2024-01-02'],
        reminderEnabled: true,
        reminderTime: "14:00",
        reminderMethod: "SMS"
      }
    ]
  }
];

export default function GoalTracker() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showNewHabitForm, setShowNewHabitForm] = useState<number | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency: 'Daily' as 'Daily' | 'Weekly' | 'Monthly',
    reminderEnabled: false,
    reminderTime: '09:00',
    reminderMethod: 'Email' as 'Email' | 'SMS' | 'Both'
  });

  const createGoal = () => {
    if (!newGoal.title || !newGoal.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      status: 'Active',
      habits: []
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: '',
      deadline: '',
      priority: 'Medium'
    });
    setShowNewGoalForm(false);
    
    toast({
      title: "Goal Created! 🎯",
      description: "Your new goal has been added successfully",
      duration: 3000,
    });
  };

  const createHabit = (goalId: number) => {
    if (!newHabit.title || !newHabit.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const habit: Habit = {
      id: Date.now(),
      ...newHabit,
      streak: 0,
      completedDates: []
    };

    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, habits: [...goal.habits, habit] }
        : goal
    ));

    setNewHabit({
      title: '',
      description: '',
      frequency: 'Daily',
      reminderEnabled: false,
      reminderTime: '09:00',
      reminderMethod: 'Email'
    });
    setShowNewHabitForm(null);
    
    toast({
      title: "Habit Added! ⚡",
      description: "New habit has been linked to your goal",
      duration: 3000,
    });
  };

  const completeHabit = (goalId: number, habitId: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            habits: goal.habits.map(habit => 
              habit.id === habitId
                ? {
                    ...habit,
                    streak: habit.streak + 1,
                    completedDates: [...habit.completedDates, today]
                  }
                : habit
            )
          }
        : goal
    ));

    toast({
      title: "Habit Completed! ✅",
      description: "Great job staying consistent with your habits",
      duration: 2000,
    });
  };

  const updateGoalProgress = (goalId: number, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress }
        : goal
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Paused': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  CareerCompass
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Goal & Habit Tracker</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/careers" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Explore Careers</Link>
              <Link to="/resume-analyzer" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Resume Analyzer</Link>
              <Link to="/tips" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Daily Tips</Link>
              <Link to="/chat" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">AI Assistant</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-9 px-0"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              {isLoggedIn && user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span>Profile</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      authService.signOut();
                      setUser(null);
                      setIsLoggedIn(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl backdrop-blur-sm shadow-xl">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <Target className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Goal Setting &
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent block">
              Habit Tracker
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Set learning goals, track habits, and get reminders to stay on track with your career development journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Flag className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {goals.filter(g => g.status === 'Active').length}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Active Goals</p>
          </Card>
          
          <Card className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {goals.filter(g => g.status === 'Completed').length}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Completed Goals</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {goals.reduce((total, goal) => total + goal.habits.length, 0)}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Active Habits</p>
          </Card>
          
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {Math.round(goals.reduce((total, goal) => total + goal.progress, 0) / goals.length) || 0}%
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Avg Progress</p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="goals" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>My Goals</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Habits</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your Goals</h2>
              <Button 
                onClick={() => setShowNewGoalForm(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </div>

            {showNewGoalForm && (
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Create New Goal</CardTitle>
                  <CardDescription>Set a new learning or career goal to track your progress</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-title">Goal Title</Label>
                      <Input
                        id="goal-title"
                        placeholder="e.g., Master React Development"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-category">Category</Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Skill Development">Skill Development</SelectItem>
                          <SelectItem value="Career Development">Career Development</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Networking">Networking</SelectItem>
                          <SelectItem value="Personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal-description">Description</Label>
                    <Textarea
                      id="goal-description"
                      placeholder="Describe your goal in detail..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-deadline">Deadline</Label>
                      <Input
                        id="goal-deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-priority">Priority</Label>
                      <Select value={newGoal.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewGoal({...newGoal, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button onClick={createGoal} className="bg-gradient-to-r from-rose-500 to-pink-600">
                      Create Goal
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewGoalForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <Card key={goal.id} className="overflow-hidden shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight mb-2">{goal.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {goal.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>{goal.habits.length} habits</span>
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Related Habits</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowNewHabitForm(goal.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Habit
                        </Button>
                      </div>
                      
                      {showNewHabitForm === goal.id && (
                        <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-3">
                          <Input
                            placeholder="Habit title"
                            value={newHabit.title}
                            onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                          />
                          <Textarea
                            placeholder="Habit description"
                            value={newHabit.description}
                            onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Select value={newHabit.frequency} onValueChange={(value: any) => setNewHabit({...newHabit, frequency: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={newHabit.reminderEnabled}
                                onCheckedChange={(checked) => setNewHabit({...newHabit, reminderEnabled: checked})}
                              />
                              <span className="text-sm">Reminders</span>
                            </div>
                          </div>
                          {newHabit.reminderEnabled && (
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                type="time"
                                value={newHabit.reminderTime}
                                onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                              />
                              <Select value={newHabit.reminderMethod} onValueChange={(value: any) => setNewHabit({...newHabit, reminderMethod: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Email">Email</SelectItem>
                                  <SelectItem value="SMS">SMS</SelectItem>
                                  <SelectItem value="Both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => createHabit(goal.id)}>
                              Add Habit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setShowNewHabitForm(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {goal.habits.map((habit) => (
                          <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => completeHabit(goal.id, habit.id)}
                                className="p-1"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <div>
                                <p className="font-medium text-sm">{habit.title}</p>
                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  <span>{habit.frequency}</span>
                                  <span>•</span>
                                  <span className="flex items-center space-x-1">
                                    <Star className="w-3 h-3" />
                                    <span>{habit.streak} day streak</span>
                                  </span>
                                  {habit.reminderEnabled && (
                                    <>
                                      <span>•</span>
                                      <Bell className="w-3 h-3" />
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Habits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.flatMap(goal => goal.habits).map((habit) => (
                <Card key={habit.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{habit.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{habit.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {habit.frequency}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{habit.streak} day streak</span>
                      </span>
                      {habit.reminderEnabled && (
                        <span className="flex items-center space-x-1 text-xs text-slate-500">
                          <Bell className="w-3 h-3" />
                          <span>{habit.reminderTime}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Button>
                      <Button size="sm" variant="ghost" className="px-2">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Progress Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">Goal Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{goal.title}</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">Habit Consistency</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-4">
                    {goals.flatMap(goal => goal.habits).slice(0, 5).map((habit) => (
                      <div key={habit.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{habit.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{habit.frequency}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{habit.streak} days</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">streak</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Developed and Designed by <span className="font-semibold text-rose-600 dark:text-rose-400">Sriram</span>
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
              © {new Date().getFullYear()} CareerCompass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
