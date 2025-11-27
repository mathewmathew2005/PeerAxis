import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMockData } from '../../hooks/useMockData';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Star, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { format } from 'date-fns';

const MentorDashboard = () => {
  const { user } = useAuth();
  const { sessions } = useMockData(user);
  const navigate = useNavigate();

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming').slice(0, 3);
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const avgRating = completedSessions.reduce((acc, s) => acc + (s.rating || 0), 0) / completedSessions.length || 0;
  
  // Mock mentee count
  const totalMentees = 5;
  const points = 450;

  const stats = [
    { label: 'Total Mentees', value: totalMentees, icon: Users, color: 'text-primary' },
    { label: 'Sessions Completed', value: completedSessions.length, icon: Clock, color: 'text-secondary' },
    { label: 'Average Rating', value: avgRating.toFixed(1), icon: Star, color: 'text-accent' },
    { label: 'Points Earned', value: points, icon: Trophy, color: 'text-success' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">Welcome back, {user.name}! 🚀</h2>
        <p className="text-muted-foreground">Your mentoring impact dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-display font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted transition-smooth cursor-pointer"
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.menteeName}`} />
                          <AvatarFallback>{session.menteeName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{session.menteeName}</p>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                        </div>
                      </div>
                      <Badge>{session.mode}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(session.date), 'MMM dd, h:mm a')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/sessions')}>
              View All Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Recent Mentees */}
        <Card>
          <CardHeader>
            <CardTitle>Your Mentees</CardTitle>
            <CardDescription>Students you're currently mentoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Student A', 'Student B', 'Student C'].map((mentee, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentee}`} />
                        <AvatarFallback>{mentee.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{mentee}</p>
                        <p className="text-xs text-muted-foreground">2 active goals</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/messages')}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/messages')}>
              Message All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Impact This Month</CardTitle>
          <CardDescription>Track your mentoring contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-display font-bold text-primary mb-1">{completedSessions.length}</div>
              <p className="text-sm text-muted-foreground">Sessions Conducted</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-display font-bold text-secondary mb-1">{Math.round(completedSessions.length * 1.5)}</div>
              <p className="text-sm text-muted-foreground">Hours Contributed</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-display font-bold text-accent mb-1">{points}</div>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-smooth" onClick={() => navigate('/sessions')}>
          <CardContent className="p-6">
            <Calendar className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Schedule Session</h3>
            <p className="text-sm text-muted-foreground">Plan your next mentoring session</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-secondary transition-smooth" onClick={() => navigate('/messages')}>
          <CardContent className="p-6">
            <MessageSquare className="w-10 h-10 text-secondary mb-3" />
            <h3 className="font-semibold mb-1">Message Mentees</h3>
            <p className="text-sm text-muted-foreground">Stay connected with students</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent transition-smooth" onClick={() => navigate('/leaderboard')}>
          <CardContent className="p-6">
            <Trophy className="w-10 h-10 text-accent mb-3" />
            <h3 className="font-semibold mb-1">View Leaderboard</h3>
            <p className="text-sm text-muted-foreground">See your ranking</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;