import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { UserPlusIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export function InviteStudents() {
  const [open, setOpen] = React.useState(false)
  const [emails, setEmails] = React.useState('')
  const { toast } = useToast()

  const handleInvite = () => {
    // Split emails by commas, newlines, or spaces and filter out empty strings
    const emailList = emails
      .split(/[\n,\s]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0)

    // Basic email validation
    const invalidEmails = emailList.filter(email => !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))

    if (invalidEmails.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid email addresses',
        description: `The following emails are invalid: ${invalidEmails.join(', ')}`,
      })
      return
    }

    // TODO: Handle sending invites
    console.log('Sending invites to:', emailList)

    toast({
      title: 'Invites sent successfully',
      description: `Sent ${emailList.length} invitation${emailList.length === 1 ? '' : 's'}.`,
    })

    setEmails('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Invite Students
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Students</DialogTitle>
          <DialogDescription>
            Enter email addresses of students you want to invite. Separate multiple emails with
            commas, spaces, or new lines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="student1@example.com&#10;student2@example.com&#10;student3@example.com"
            value={emails}
            onChange={e => setEmails(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleInvite}>
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
