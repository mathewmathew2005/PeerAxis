import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMockData } from '../hooks/useMockData';
import { Calendar, Clock, MapPin, Video, Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SessionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions } = useMockData(user);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  const session = sessions.find(s => s.id === id);

  if (!session) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">Session not found</p>
          <Button className="mt-4" onClick={() => navigate('/sessions')}>Back to Sessions</Button>
        </CardContent>
      </Card>
    );
  }

  const handleSaveNotes = () => {
    toast.success('Notes saved successfully');
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    toast.success('Feedback submitted successfully');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <Button variant="outline" onClick={() => navigate('/sessions')}>← Back to Sessions</Button>

      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.mentorName}`} />
                <AvatarFallback>{session.mentorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl mb-1">{session.topic}</CardTitle>
                <p className="text-muted-foreground">
                  With {user.role === 'mentor' ? session.menteeName : session.mentorName}
                </p>
              </div>
            </div>
            <Badge variant={session.status === 'upcoming' ? 'default' : 'secondary'}>
              {session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(session.date), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{format(new Date(session.date), 'h:mm a')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  {session.mode === 'online' ? <Video className="w-5 h-5 text-accent" /> : <MapPin className="w-5 h-5 text-accent" />}
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  {session.mode === 'online' ? (
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      Join Meeting
                    </a>
                  ) : (
                    <p className="font-medium">{session.location}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{session.duration} minutes</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="agenda" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agenda">Agenda & Topics</TabsTrigger>
          <TabsTrigger value="notes">Notes & Action Items</TabsTrigger>
          {session.status === 'completed' && <TabsTrigger value="feedback">Feedback</TabsTrigger>}
        </TabsList>

        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <CardTitle>Session Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Discussion Topics</h4>
                  <p className="text-muted-foreground">{session.agenda || 'No agenda set yet'}</p>
                </div>
                {session.status === 'upcoming' && (
                  <Button variant="outline">
                    <Edit className="mr-2 w-4 h-4" />
                    Edit Agenda
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write your notes here..."
                rows={10}
                value={notes || session.notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {session.status === 'completed' && (
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Session Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {session.rating ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${star <= session.rating ? 'text-accent fill-accent' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rate this session</p>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transition-smooth"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= rating ? 'text-accent fill-accent' : 'text-muted hover:text-accent'}`}
                          />
                        </button>
                      ))}
                    </div>
                    <Button className="mt-4" onClick={handleSubmitFeedback}>Submit Feedback</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SessionDetailsPage;