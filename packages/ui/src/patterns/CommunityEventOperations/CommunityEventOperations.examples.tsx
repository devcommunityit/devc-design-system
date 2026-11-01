import { Badge } from "@devcommunityit/ui";
import {
  CommunityEventOperations,
  type CommunityEventOperationsProps,
} from "./CommunityEventOperations";

const now = "2026-10-31T08:00:00+01:00";

export function AttendeeOperations() {
  const props: CommunityEventOperationsProps = {
    title: "Community Summit",
    startsAt: "2026-11-12T09:00:00+01:00",
    endsAt: "2026-11-12T17:00:00+01:00",
    timeZone: "Europe/Rome",
    now,
    registrationDeadline: "2026-11-10T23:59:00+01:00",
    tickets: {
      tiers: [
        {
          id: "general",
          name: "General admission",
          priceLabel: "€25",
          available: 18,
          maxPerOrder: 4,
        },
        {
          id: "community",
          name: "Community ticket",
          description: "Limited allocation",
          priceLabel: "Free",
          available: 0,
        },
      ],
      quantities: { general: 1, community: 0 },
      onQuantityChange: (tierId, quantity) =>
        console.log("Update quantity", tierId, quantity),
      onRegister: () => console.log("Continue registration"),
      waitlist: {
        status: "available",
        onJoin: () => console.log("Join waitlist"),
      },
    },
    pass: {
      status: "ready",
      attendeeName: "Alex Morgan",
      ticketName: "General admission",
      passId: "PASS-2048",
      qrCode: (
        <div aria-label="Example QR placeholder">
          <Badge>Consumer-supplied QR</Badge>
        </div>
      ),
    },
    venue: {
      name: "Community Hall",
      address: "Via Example 12, Roma",
      details: "Doors open at 08:30.",
      mapHref: "https://maps.example.test/community-hall",
      accessibility: [
        "Step-free entrance",
        "Reserved wheelchair seating",
        "Quiet room available",
      ],
    },
    calendarHref: "https://events.example.test/community-summit.ics",
    certificateHref: "https://events.example.test/certificates/2048",
  };
  return <CommunityEventOperations {...props} />;
}

export function OrganizerOperations() {
  return (
    <CommunityEventOperations
      title="Community Summit"
      startsAt="2026-11-12T09:00:00+01:00"
      timeZone="Europe/Rome"
      now={now}
      checkIn={{
        status: "needs-review",
        detail: "Confirm attendee identity before updating the roster.",
        onCheckIn: () => console.log("Manual check-in"),
      }}
      cfp={{
        status: "under-review",
        deadline: "2026-09-30T23:59:00+02:00",
        detail: "Review is managed by the program committee.",
        reviews: [
          {
            id: "review-1",
            reviewer: "Alex Morgan",
            score: 4,
            maxScore: 5,
            feedback: "Clear proposal with a practical outline.",
          },
          {
            id: "review-2",
            reviewer: "Taylor Kim",
            score: 3,
            maxScore: 5,
            conflictOfInterest: true,
          },
        ],
      }}
      cancellation={{
        status: "refund-processing",
        detail: "Refund progress is provided by the event organizer.",
      }}
      tracks={[
        {
          id: "main",
          name: "Main stage",
          sessions: [
            {
              id: "opening",
              title: "Welcome and opening keynote",
              startsAt: "2026-11-12T09:00:00+01:00",
              endsAt: "2026-11-12T09:45:00+01:00",
              speaker: "Jordan Lee",
              location: "Auditorium",
            },
          ],
        },
        {
          id: "workshops",
          name: "Workshops",
          sessions: [
            {
              id: "agents",
              title: "Building reliable AI agents",
              startsAt: "2026-11-12T10:00:00+01:00",
              endsAt: "2026-11-12T11:00:00+01:00",
              speaker: "Taylor Kim",
              location: "Room 2",
            },
          ],
        },
      ]}
    />
  );
}
