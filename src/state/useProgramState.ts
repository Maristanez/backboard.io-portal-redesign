/**
 * Mutable program state for the session.
 *
 * Everything an ambassador can change from inside the portal lives here:
 * submissions they log, challenges they claim, orders they place, preferences
 * they set. Read-only content stays in `data/program`.
 *
 * Nothing persists — a real portal would post these to an API, and this hook is
 * the seam where that would happen.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  FEED_POOL,
  INITIAL_CHECKLIST_STATE,
  INITIAL_FEED,
  INITIAL_PREFERENCES,
  INITIAL_SUBMISSIONS,
  EARN_OPTIONS,
} from '../data/program'
import type {
  ChecklistStep,
  EarnCategory,
  FeedItem,
  PreferenceKey,
  StoreOrder,
  Referral,
  Submission,
  TabSelection,
  TabbedPanel,
  AnyTab,
} from '../domain/types'

/** How often a new line drops into the activity feed. */
const FEED_INTERVAL_MS = 7000
/** Lines kept in the feed before the oldest scroll off. */
const FEED_LENGTH = 8
/** How long a toast stays up. */
const TOAST_MS = 2400

export function useProgramState() {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS)
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED)
  const [checklist] = useState<Record<ChecklistStep, boolean>>(INITIAL_CHECKLIST_STATE)
  const [appliedChallenges, setAppliedChallenges] = useState<Record<number, boolean>>({})
  const [orders, setOrders] = useState<Record<number, StoreOrder>>({})
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [preferences, setPreferences] =
    useState<Record<PreferenceKey, boolean>>(INITIAL_PREFERENCES)
  const [tabs, setTabs] = useState<TabSelection>({})
  const [toast, setToast] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Submit form.
  const [category, setCategory] = useState<EarnCategory>('Content')
  const [optionIndex, setOptionIndex] = useState(0)
  const [proof, setProof] = useState('')
  const [notes, setNotes] = useState('')

  const toastTimer = useRef<number>()

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  // Rotate the activity feed, so the panel reads as live rather than static.
  useEffect(() => {
    let next = 0
    const id = window.setInterval(() => {
      const item = FEED_POOL[next++ % FEED_POOL.length]!
      setFeed((current) => [{ when: 'NOW', ...item }, ...current.slice(0, FEED_LENGTH - 1)])
    }, FEED_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [])

  const selectCategory = useCallback((next: EarnCategory) => {
    setCategory(next)
    // The option index belongs to the old category; it may not exist in the new.
    setOptionIndex(0)
  }, [])

  const submitWork = useCallback(() => {
    const option = EARN_OPTIONS[category][optionIndex]
    if (!option) return

    setSubmissions((current) => [
      {
        title: option.title,
        date: 'Sep 2',
        category,
        points: String(option.points),
        status: 'PENDING REVIEW',
      },
      ...current,
    ])
    setProof('')
    setNotes('')
    showToast('Submitted — a reviewer will verify off-platform.')
  }, [category, optionIndex, showToast])

  const applyToChallenge = useCallback(
    (index: number) => {
      setAppliedChallenges((current) => ({ ...current, [index]: true }))
      showToast('Application submitted — under review.')
    },
    [showToast],
  )

  const redeem = useCallback(
    (index: number, order: StoreOrder) => {
      setOrders((current) => ({ ...current, [index]: order }))
      showToast('Order requested — points held until an admin approves.')
    },
    [showToast],
  )

  const logReferral = useCallback(() => {
    setReferrals((current) => [
      {
        name: `Referral #${current.length + 1} — logged before first contact`,
        date: 'Sep 2, 2026',
      },
      ...current,
    ])
    showToast('Referral logged. An admin will verify it.')
  }, [showToast])

  const copyReferralLink = useCallback((link: string) => {
    navigator.clipboard?.writeText(link)
    setCopiedLink(true)
    window.setTimeout(() => setCopiedLink(false), 1800)
  }, [])

  const togglePreference = useCallback((key: PreferenceKey) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }, [])

  const selectTab = useCallback((panel: TabbedPanel, tab: AnyTab) => {
    setTabs((current) => ({ ...current, [panel]: tab }))
  }, [])

  return {
    submissions,
    feed,
    checklist,
    appliedChallenges,
    orders,
    referrals,
    preferences,
    tabs,
    toast,
    copiedLink,
    submitForm: { category, optionIndex, proof, notes },
    selectCategory,
    selectOption: setOptionIndex,
    setProof,
    setNotes,
    submitWork,
    applyToChallenge,
    redeem,
    logReferral,
    copyReferralLink,
    togglePreference,
    selectTab,
    showToast,
  }
}

export type ProgramState = ReturnType<typeof useProgramState>
