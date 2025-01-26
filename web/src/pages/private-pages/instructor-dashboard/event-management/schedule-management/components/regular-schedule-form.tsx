import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { DAYS_OF_WEEK } from '../../../lib/api/schedules';

interface RegularScheduleFormProps {
  isCreatingRecurring: boolean;
  onSubmit: (data: {
    day_of_week: number;
    start_time: string;
    end_time: string;
  }) => Promise<void>;
}

export function RegularScheduleForm({ isCreatingRecurring, onSubmit }: RegularScheduleFormProps) {
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      day_of_week: parseInt(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
    });

    // Reset form
    setDayOfWeek('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Regular Schedule</CardTitle>
        <CardDescription>Set up recurring weekly classes</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="day_of_week">Day of Week</Label>
            <Select
              value={dayOfWeek}
              onValueChange={setDayOfWeek}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day, index) => (
                  <SelectItem key={day} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isCreatingRecurring}
          >
            {isCreatingRecurring ? 'Adding...' : 'Add Regular Schedule'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 