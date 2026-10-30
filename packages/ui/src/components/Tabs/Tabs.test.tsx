import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { Key } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

function Example(props: { onSelectionChange?: (key: Key) => void; manual?: boolean }) {
  return (
    <Tabs defaultSelectedKey="overview" onSelectionChange={props.onSelectionChange} keyboardActivation={props.manual ? 'manual' : 'automatic'}>
      <TabList aria-label="Project">
        <Tab id="overview">Overview</Tab>
        <Tab id="activity">Activity</Tab>
        <Tab id="settings" isDisabled>
          Settings
        </Tab>
        <Tab id="members">Members</Tab>
      </TabList>
      <TabPanel id="overview">Overview panel</TabPanel>
      <TabPanel id="activity">Activity panel</TabPanel>
      <TabPanel id="settings">Settings panel</TabPanel>
      <TabPanel id="members">Members panel</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders the APG tabs pattern and passes axe', async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Project' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('arrow keys move and activate tabs, skipping disabled ones', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Example onSelectionChange={onSelectionChange} />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Members' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    expect(onSelectionChange).toHaveBeenLastCalledWith('overview');
  });

  it('manual activation requires Enter/Space', async () => {
    const user = userEvent.setup();
    render(<Example manual />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('controlled selection', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [key, setKey] = useState<Key>('b');
      return (
        <>
          <Tabs selectedKey={key} onSelectionChange={setKey}>
            <TabList aria-label="Letters">
              <Tab id="a">A</Tab>
              <Tab id="b">B</Tab>
            </TabList>
            <TabPanel id="a">Panel A</TabPanel>
            <TabPanel id="b">Panel B</TabPanel>
          </Tabs>
          <button type="button" onClick={() => setKey('a')}>
            External
          </button>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
    await user.click(screen.getByRole('button', { name: 'External' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });
});