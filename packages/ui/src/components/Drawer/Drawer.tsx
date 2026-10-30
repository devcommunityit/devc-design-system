import { forwardRef } from 'react';
import { OverlayPanel, type DialogProps, type DrawerPlacement } from '../Dialog/Dialog';

export interface DrawerProps extends Omit<DialogProps, 'size'> {
  /**
   * Edge the panel slides from. `start`/`end` are logical (they flip in RTL); `bottom` is a mobile-style sheet.
   * @default 'end'
   */
  placement?: DrawerPlacement;
}

/** Modal side panel or bottom sheet with the same behavior and anatomy as Dialog. */
export const Drawer = forwardRef<HTMLElement, DrawerProps>(function Drawer({ placement = 'end', ...rest }, ref) {
  return <OverlayPanel ref={ref} kind="drawer" placement={placement} {...rest} />;
});
