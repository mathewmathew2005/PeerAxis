import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { useAuth } from '../hooks/useAuth';
import { Search, Filter, Star, Clock, MapPin, Video } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DEPARTMENTS, SKILLS } from '../types';
import { toast } from 'sonner';

const FindMentorPage = () => {
  const { user } = useAuth();
  const { mentors } = useMockData(user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDepartment = selectedDepartment === 'all' || mentor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleRequestMentoring = () => {
    toast.success('Request sent!', {
      description: `Your mentoring request has been sent to ${selectedMentor.name}`
    });
    setSelectedMentor(null);
    setRequestMessage('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">Find Your Perfect Mentor</h2>
        <p className="text-muted-foreground">Connect with experienced seniors who can guide your learning journey</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full sm:w-64">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="hover:border-primary transition-smooth">
            <CardContent className="p-6">
              {/* Mentor Header */}
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={mentor.avatar} />
                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-lg truncate">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.department}</p>
                  <p className="text-xs text-muted-foreground">Year {mentor.year}</p>
                </div>
              </div>

              {/* Rating and Sessions */}
              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{mentor.sessionsCompleted} sessions</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mentor.bio}</p>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Availability</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.availability.slice(0, 2).map((slot, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Dialog open={selectedMentor?.id === mentor.id} onOpenChange={(open) => !open && setSelectedMentor(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedMentor(mentor)}>
                    Request Mentoring
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Request Mentoring Session</DialogTitle>
                    <DialogDescription>
                      Send a request to {mentor.name} for a mentoring session
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{mentor.name}</p>
                        <p className="text-sm text-muted-foreground">{mentor.department}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">What would you like to learn?</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {mentor.skills.map(skill => (
                            <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell the mentor about your learning goals and preferred time..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRequestMentoring}>
                      Send Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMentors.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FindMentorPage;