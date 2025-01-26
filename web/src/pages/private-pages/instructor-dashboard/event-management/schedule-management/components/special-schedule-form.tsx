import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';

interface SpecialScheduleFormProps {
  recurringOccurrences: { scheduleId: string; date: string; displayText: string }[];
  onSubmit: (data: {
    date: string;
    startTime: string;
    endTime: string;
    status: 'extra' | 'cancelled' | 'rescheduled';
    note?: string;
    replacedScheduleId?: string;
    replacedScheduleDate?: string;
  }) => void;
  isCreating: boolean;
}

export function SpecialScheduleForm({ recurringOccurrences, onSubmit, isCreating }: SpecialScheduleFormProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<'extra' | 'cancelled' | 'rescheduled'>('extra');
  const [note, setNote] = useState('');
  const [selectedOccurrence, setSelectedOccurrence] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [scheduleId, occurrenceDate] = selectedOccurrence.split('|');
    
    onSubmit({
      date,
      startTime,
      endTime,
      status,
      note: note || undefined,
      replacedScheduleId: status === 'rescheduled' ? scheduleId : undefined,
      replacedScheduleDate: status === 'rescheduled' ? occurrenceDate : undefined,
    });

    // Reset form
    setDate('');
    setStartTime('');
    setEndTime('');
    setStatus('extra');
    setNote('');
    setSelectedOccurrence('');
  };

  const showTimeInputs = status === 'extra' || status === 'rescheduled';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Special Session</CardTitle>
        <CardDescription>
          Schedule an extra class, cancel a session, or reschedule a regular class
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Session Type</Label>
              <Select
                value={status}
                onValueChange={(value: 'extra' | 'cancelled' | 'rescheduled') => setStatus(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extra">Extra Session</SelectItem>
                  <SelectItem value="cancelled">Cancelled Session</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showTimeInputs && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required={showTimeInputs}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required={showTimeInputs}
                />
              </div>
            </div>
          )}

          {status === 'rescheduled' && (
            <div className="space-y-2">
              <Label htmlFor="replacedSchedule">Class to Replace</Label>
              <Select
                value={selectedOccurrence}
                onValueChange={setSelectedOccurrence}
              >
                <SelectTrigger id="replacedSchedule">
                  <SelectValue placeholder="Select class occurrence" />
                </SelectTrigger>
                <SelectContent>
                  {recurringOccurrences?.map((occurrence) => (
                    <SelectItem 
                      key={`${occurrence.scheduleId}|${occurrence.date}`} 
                      value={`${occurrence.scheduleId}|${occurrence.date}`}
                    >
                      {occurrence.displayText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional information about this session..."
            />
          </div>

          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Adding Special Session...' : 'Add Special Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 