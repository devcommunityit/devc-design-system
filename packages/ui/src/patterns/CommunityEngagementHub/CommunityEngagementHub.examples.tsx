import { useState } from 'react';
import { Button } from '@devcommunityit/ui';
import { CommunityEngagementHub, type CommunityPoll, type CommunityQuestion } from '@devcommunityit/ui/patterns';

const polls: CommunityPoll[] = [
  {
    id: 'next-topic',
    question: 'What should we explore at the next meetup?',
    options: [
      { id: 'accessibility', label: 'Accessible design', votes: 18 },
      { id: 'ai', label: 'AI in product teams', votes: 12 },
    ],
  },
];

const questions: CommunityQuestion[] = [
  { id: 'mentor', question: 'How do I find a mentor in the community?', author: 'Mina', votes: 14, answers: 3 },
];

export function CommunityOverview() {
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [selectedShift, setSelectedShift] = useState<string>();
  return (
    <CommunityEngagementHub
      title="Make more of your community"
      description="Meet members, share ideas and find ways to contribute."
      members={[
        { id: 'mina', name: 'Mina Patel', role: 'Product designer', summary: 'Design systems and accessibility', tags: ['Mentor', 'Design'] },
      ]}
      sponsors={[{ id: 'northstar', name: 'Northstar', tier: 'Community partner' }]}
      testimonials={[{ id: 'story-1', quote: 'I found collaborators for my first open-source project.', author: 'Jordan Lee', role: 'Member since 2023' }]}
      polls={polls.map((poll) => ({ ...poll, selectedOptionId }))}
      onPollVote={(_pollId, optionId) => setSelectedOptionId(optionId)}
      nps={{ question: 'How likely are you to recommend this community?', selectedScore: 9 }}
      onNpsRate={(score) => console.info('NPS response requested:', score)}
      questions={questions}
      onQuestionVote={(id) => console.info('Vote requested for', id)}
      onQuestionReact={(id) => console.info('Reaction requested for', id)}
      invite={{ url: 'https://community.example/invite', referralCode: 'JOIN-42' }}
      onInviteShare={(url) => console.info('Share requested for', url)}
      volunteerShifts={[
        { id: 'welcome', title: 'Welcome desk', date: '2025-06-12', time: '09:00–11:00', spotsRemaining: 2, selected: selectedShift === 'welcome' },
      ]}
      onShiftSelect={setSelectedShift}
      jobs={[
        { id: 'designer', title: 'Senior product designer', company: 'Northstar', location: 'Remote', type: 'Full time', href: '/jobs/designer' },
      ]}
      badges={[
        { id: 'helper', title: 'Helpful voice', description: 'Answer five member questions', progress: 3, goal: 5 },
        { id: 'host', title: 'Community host', earned: true },
      ]}
      streakDays={7}
      raffle={{
        title: 'June meetup raffle',
        entries: [{ id: 'entry-1', label: 'Jordan Lee' }, { id: 'entry-2', label: 'Mina Patel' }],
        winner: { name: 'Mina Patel', entryLabel: 'entry-2' },
      }}
      onRaffleEnter={() => console.info('Raffle entry requested')}
    />
  );
}

export function InviteAction() {
  return <Button onPress={() => console.info('Parent handles invite sharing')}>Share your invite</Button>;
}
