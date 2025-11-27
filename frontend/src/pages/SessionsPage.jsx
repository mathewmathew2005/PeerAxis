import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMockData } from '../hooks/useMockData';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Plus } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { format } from 'date-fns';

const SessionsPage = () => {
  const { user } = useAuth();
  const { sessions } = useMockData(user);
  const navigate = useNavigate();
  const [view, setView] = useState('list');

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');

  const SessionCard = ({ session }) => (
    <Card
      className="hover:border-primary transition-smooth cursor-pointer"
      onClick={() => navigate(`/sessions/${session.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.mentorName}`} />
              <AvatarFallback>{session.mentorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {user.role === 'mentor' ? session.menteeName : session.mentorName}
              </h3>
              <p className="text-sm text-muted-foreground">{session.topic}</p>
            </div>
          </div>
          <Badge variant={session.status === 'upcoming' ? 'default' : session.status === 'completed' ? 'secondary' : 'destructive'}>
            {session.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{format(new Date(session.date), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(session.date), 'h:mm a')}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            {session.mode === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            <span>{session.mode === 'online' ? 'Online' : session.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{session.duration} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">Sessions</h2>
          <p className="text-muted-foreground">Manage your mentoring sessions</p>
        </div>
        <Button onClick={() => navigate('/find-mentor')}>
          <Plus className="mr-2 w-4 h-4" />
          Schedule Session
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedSessions.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming sessions</p>
                <Button className="mt-4" onClick={() => navigate('/find-mentor')}>
                  Schedule a Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map(session => <SessionCard key={session.id} session={session} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSessions.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">No completed sessions yet</p>
              </CardContent>
            </Card>
          ) : (
            completedSessions.map(session => <SessionCard key={session.id} session={session} />)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledSessions.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">No cancelled sessions</p>
              </CardContent>
            </Card>
          ) : (
            cancelledSessions.map(session => <SessionCard key={session.id} session={session} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionsPage;