import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "../../../test/axe";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { CommunityEventOperations } from "./CommunityEventOperations";

const now = "2026-10-31T08:00:00+01:00";

describe("CommunityEventOperations", () => {
  it("shows ticket availability, controlled quantities, waitlist, pass and deadline countdown", async () => {
    const onQuantityChange = vi.fn();
    const onJoin = vi.fn();
    const onRegister = vi.fn();
    const { baseElement } = render(
      <ThemeProvider>
        <CommunityEventOperations
          title="Community Summit"
          startsAt="2026-11-12T09:00:00+01:00"
          now={now}
          registrationDeadline="2026-11-01T08:00:00+01:00"
          tickets={{
            tiers: [
              {
                id: "standard",
                name: "Standard",
                priceLabel: "€20",
                available: 5,
              },
              {
                id: "sold-out",
                name: "Student",
                priceLabel: "Free",
                available: 0,
              },
            ],
            quantities: { standard: 1, "sold-out": 0 },
            onQuantityChange,
            onRegister,
            waitlist: { status: "available", onJoin },
          }}
          pass={{
            status: "ready",
            qrCode: <div>Supplied pass graphic</div>,
            passId: "A-102",
          }}
          venue={{
            name: "Community Hall",
            accessibility: ["Step-free entrance"],
          }}
          calendarHref="/event.ics"
          certificateHref="/certificate"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("5 remaining")).toBeInTheDocument();
    expect(screen.getByText("Sold out")).toBeInTheDocument();
    expect(baseElement.querySelector("input")).toHaveValue("1");
    expect(screen.getByText("Starts in 12d 1h")).toBeInTheDocument();
    expect(screen.getByText("Supplied pass graphic")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add to calendar" }),
    ).toHaveAttribute("href", "/event.ics");
    expect(
      screen.getByRole("link", { name: "View attendance certificate" }),
    ).toHaveAttribute("href", "/certificate");
    expect(screen.getAllByText("1d")).toHaveLength(1);
    expect(await axe(baseElement)).toHaveNoViolations();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Join waitlist" }));
    await user.click(
      screen.getByRole("button", { name: "Continue registration" }),
    );
    expect(onJoin).toHaveBeenCalledOnce();
    expect(onRegister).toHaveBeenCalledOnce();
    expect(onQuantityChange).not.toHaveBeenCalled();
  });

  it("exposes externally supplied check-in, CFP, refund, and multi-track statuses", async () => {
    const onCheckIn = vi.fn();
    const { baseElement } = render(
      <ThemeProvider>
        <CommunityEventOperations
          title="Summit"
          startsAt="2026-11-12T09:00:00+01:00"
          now={now}
          checkIn={{ status: "not-checked-in", onCheckIn }}
          cfp={{
            status: "under-review",
            detail: "Committee review",
            reviews: [
              {
                id: "review-1",
                reviewer: "Alex Morgan",
                score: 4,
                maxScore: 5,
                conflictOfInterest: true,
              },
            ],
          }}
          cancellation={{ status: "refunded" }}
          tracks={[
            {
              id: "one",
              name: "Track One",
              sessions: [
                {
                  id: "s1",
                  title: "Opening talk",
                  startsAt: "2026-11-12T09:00:00+01:00",
                  speaker: "A. Speaker",
                },
              ],
            },
            {
              id: "two",
              name: "Track Two",
              sessions: [
                {
                  id: "s2",
                  title: "Design systems",
                  startsAt: "2026-11-12T10:00:00+01:00",
                },
              ],
            },
          ]}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Not checked in")).toBeInTheDocument();
    expect(screen.getByText("Under review")).toBeInTheDocument();
    expect(screen.getByText("Review scorecard")).toBeInTheDocument();
    expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByText("Conflict of interest declared")).toBeInTheDocument();
    expect(screen.getByText("Refunded")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Track One" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Track Two" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mark as checked in" }),
    ).toBeEnabled();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Mark as checked in" }));
    expect(onCheckIn).toHaveBeenCalledOnce();
    await expect(axe(baseElement)).resolves.toHaveNoViolations();
  });
});
