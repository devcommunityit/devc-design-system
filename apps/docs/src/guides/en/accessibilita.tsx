import { Alert } from '@dev-community/ui';
import { DocSection, RefTable } from '../../components/Doc';

export default function Accessibilita() {
  return (
    <>
      <Alert tone="info" title="No conformance claim">
        The library is designed against the relevant WCAG 2.2 Level AA success criteria. Conformance, however, applies to a complete page or
        service, not to a library: it depends on the consumer's content, alternative text, heading order, and flows, and requires manual testing with
        assistive technologies. Automated tests catch only a subset of issues.
      </Alert>

      <DocSection title="Applied principles">
        <ul>
          <li>Native HTML before ARIA: semantic button, a, input, select, fieldset, table, and dialog elements.</li>
          <li>
            Complex widgets (Combobox, Select, Menu, Tabs, Calendar, Slider, Dialog) are built on React Aria, which implements the WAI-ARIA APG
            patterns with focus management, keyboard support, and announcements.
          </li>
          <li>Every control has an accessible name; label, description, and error are linked by id (aria-describedby / aria-errormessage).</li>
          <li>
            The visible focus indicator uses a ring with a minimum 3:1 contrast ratio. If your layout has a sticky header, set{' '}
            <code>scroll-padding-top</code> on the document so the focused element is not obscured (2.4.11).
          </li>
          <li>States and feedback combine color, icon, and text; no information is conveyed by color alone.</li>
          <li>Interactive targets are at least 24×24 CSS px, even in compact density; 40px or more in comfortable density.</li>
          <li>prefers-reduced-motion sets durations to zero; forced-colors uses system colors for borders and focus.</li>
          <li>Zoom is never blocked; fluid layouts with no page-level horizontal scrolling at 320 CSS px.</li>
        </ul>
      </DocSection>

      <DocSection title="Overlays">
        <RefTable
          label="Overlay behavior"
          columns={['Component', 'Initial focus', 'Containment', 'Escape', 'Restoration']}
          rows={[
            ['Dialog / Drawer', 'First focusable element or autoFocus', 'Yes', 'Closes', 'To the trigger'],
            ['AlertDialog', 'Cancel action', 'Yes', 'Closes (unless isKeyboardDismissDisabled or a confirmation is pending); the backdrop does not close it', 'To the trigger'],
            ['Popover / Menu', 'Content or first item', 'Managed by React Aria (Tab closes the Menu)', 'Closes', 'To the trigger'],
            ['Tooltip', 'None', 'No', 'Closes', '—'],
            ['Toast', 'None (announced via a live region)', 'No', '—', 'Reachable with Tab; no F6 shortcut'],
          ]}
        />
        <p>
          Modal overlays lock document scrolling and make the rest of the page inert; with nested overlays (e.g. a Select inside a Dialog), Escape
          closes only the topmost layer.
        </p>
      </DocSection>

      <DocSection title="What is tested">
        <RefTable
          label="Tests"
          columns={['Type', 'Tool', 'Coverage']}
          rows={[
            ['Unit and interaction', 'Vitest + Testing Library + user-event', 'Keyboard, focus, controlled/uncontrolled, validation for every component'],
            ['Automated rules', 'axe-core in component tests', 'Accessible names, roles, valid ARIA attributes'],
            ['Browser', 'Playwright + @axe-core/playwright (e2e/ folder)', 'Real pages at 320–1440 px, dark theme, RTL, overlays, and keyboard flows'],
            ['axe rules in the browser', 'e2e/a11y.spec.ts', 'All component, guide, and showcase pages, in light and dark themes (WCAG 2.0/2.1/2.2 A and AA tags)'],
            ['Reflow and zoom', 'e2e/responsive.spec.ts', '320, 375, 768, 1024, 1440 px; simulated 200% zoom (640 and 320 viewports with deviceScaleFactor 2); 200% text at 375 px'],
            ['Contrast', 'Token generator', 'Text/background pairs of every preset in light and dark (the build fails below threshold)'],
          ]}
        />
        <p>
          Browser zoom is simulated by shrinking the CSS viewport and doubling the device scale factor: the resulting layout is the one the browser
          computes at 200% and 400% on 1280 px screens. Text-only enlargement is simulated by setting <code>font-size: 200%</code>{' '}
          on the root element.
        </p>
        <p>Browser tests exclude only two classes of findings, justified and scoped in <code>e2e/fixtures.ts</code>:</p>
        <ul>
          <li>
            <code>color-contrast</code> on disabled controls: WCAG 1.4.3 exempts inactive components.
          </li>
          <li>
            <code>label-content-name-mismatch</code> on list options with a description: the accessible name matches the visible label and the
            description is linked via <code>aria-describedby</code>; the (experimental) rule compares the entire visible text instead.
          </li>
        </ul>
        <p>
          Manual testing is still required on your portal's flows with screen readers (NVDA, JAWS, VoiceOver, TalkBack), text enlargement, and the
          system's high contrast mode. These manual checks have not been performed on this release.
        </p>
      </DocSection>

      <DocSection title="Consumer responsibilities">
        <ul>
          <li>Set <code>lang</code> and <code>dir</code> on the document, plus a meaningful page title.</li>
          <li>Keep a consistent heading hierarchy and unique landmarks (a single main).</li>
          <li>Provide a label for every control, alternative text for images, and understandable error messages.</li>
          <li>Check the contrast of custom themes (the Theme Builder flags insufficient pairs).</li>
          <li>Don't convey critical information through Toasts alone: use a persistent Alert or Banner.</li>
        </ul>
      </DocSection>
    </>
  );
}
