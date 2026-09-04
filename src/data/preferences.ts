/**
 * Notification and privacy preferences.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  Preference,
} from '../domain/types'

export const PREFERENCES: Preference[] = [
  { key: 'email', label: 'Email notifications', description: 'Approvals, rejections, new challenges' },
  { key: 'digest', label: 'Weekly digest', description: 'Leaderboard movement every Monday' },
  { key: 'dm', label: 'Allow DMs from ambassadors', description: 'Shown as contact in the directory' },
  { key: 'public', label: 'Public profile', description: 'Visible in the directory' },
  {
    key: 'calendar',
    label: 'Sync to Google Calendar',
    description: 'Approved events appear on your calendar',
  },
]

export const INITIAL_PREFERENCES = {
  email: true,
  digest: false,
  dm: true,
  public: true,
  calendar: false,
} as const
