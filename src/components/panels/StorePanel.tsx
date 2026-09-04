/**
 * Store — redeeming points, and the referral programme that earns them.
 *
 * An item's button reports the single reason you can't have it yet: locked by
 * tier, or unlocked but unaffordable. Those are different problems and the
 * design distinguishes them rather than greying everything out alike.
 */
import { border, color, font, kicker } from '../../design/tokens'
import { STORE_ITEMS, VIEWER } from '../../data'
import { PANEL_TABS, type TabOf } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody } from '../shell/Panel'
import { Button, EmptyState, PanelHeading, Stat, Unit } from '../ui'
import { PanelTabs, TabPanel } from '../shell/PanelTabs'

/** Tier the viewer has reached; items above it are locked. */
const VIEWER_TIER = 'Rookie'

export function StorePanel({ program }: { program: ProgramState }) {
  const tabs = PANEL_TABS.Store
  const active: TabOf<'Store'> = program.tabs.Store ?? tabs[0]
  const orders = Object.values(program.orders)

  return (
    <>
      <PanelTabs
        tabs={tabs}
        active={active}
        onSelect={(tab) => program.selectTab('Store', tab)}
        label="Store views"
      />

      <TabPanel active={active === 'Redeem'}>
        <PanelHeading
          index={6}
          section="PROGRAM"
          title="Store"
          description="Redeem points. Tiers unlock with rank; orders are approved by an admin."
          underTabs
          aside={
            <div style={{ textAlign: 'right' }}>
              <Stat
                label="SPENDABLE"
                size="hero"
                accent
                value={
                  <>
                    {VIEWER.points} <Unit size={16}>PTS</Unit>
                  </>
                }
              />
            </div>
          }
        />

        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 12,
              alignItems: 'start',
            }}
          >
            {STORE_ITEMS.map((item, i) => {
              const unlocked = item.unlocksAt === VIEWER_TIER
              const affordable = unlocked && VIEWER.points >= item.cost
              const ordered = Boolean(program.orders[i])
              const actionable = affordable && !ordered

              const label = ordered
                ? 'Requested'
                : !unlocked
                  ? `Unlocks at ${item.unlocksAt}`
                  : affordable
                    ? 'Redeem'
                    : 'Need more pts'

              return (
                <div
                  key={item.name}
                  style={{
                    padding: '20px 22px',
                    borderRadius: 12,
                    border: `1px solid ${unlocked ? border.strong : border.subtle}`,
                    background: color.inset,
                    opacity: unlocked ? 1 : 0.55,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    minHeight: 200,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ font: `600 12px/1 ${font.mono}`, color: color.accent }}>
                      {item.shelf}
                    </span>
                    <span
                      style={{
                        font: `500 9.5px/1 ${font.mono}`,
                        letterSpacing: '.16em',
                        color: color.textFaint,
                      }}
                    >
                      {item.limit}
                    </span>
                  </div>
                  <div style={{ font: `600 18px/1.25 ${font.sans}`, color: color.text }}>
                    {item.name}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: color.textMuted, flex: 1 }}>
                    {item.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ font: `600 14px/1 ${font.mono}`, color: color.accentSoft }}>
                      {item.cost.toLocaleString()} PTS
                    </span>
                    <Button
                      small
                      onClick={() => program.redeem(i, { name: item.name, cost: item.cost })}
                      disabled={!actionable}
                      style={{ borderRadius: 6 }}
                    >
                      {label}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: `1px solid ${border.soft}`,
                paddingBottom: 12,
              }}
            >
              <h2 style={{ margin: 0, font: `600 24px/1 ${font.display}`, color: color.text }}>
                My orders
              </h2>
              <span style={{ fontSize: 12, color: color.textFaint }}>
                Points are held while an order awaits approval; rejected orders refund
                automatically.
              </span>
            </div>
            {orders.length === 0 ? (
              <EmptyState>No orders yet. Redeem something above.</EmptyState>
            ) : (
              orders.map((order) => (
                <div
                  key={order.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '14px 4px',
                    borderBottom: `1px solid ${border.subtle}`,
                    fontSize: 14,
                    color: color.text,
                  }}
                >
                  <span>{order.name}</span>
                  <span
                    style={{
                      font: `500 9.5px/1 ${font.mono}`,
                      letterSpacing: '.16em',
                      color: color.pending,
                      alignSelf: 'center',
                    }}
                  >
                    AWAITING APPROVAL · {order.cost.toLocaleString()} PTS HELD
                  </span>
                </div>
              ))
            )}
          </div>
        </PanelBody>
      </TabPanel>

      <TabPanel active={active === 'Referrals'}>
        <PanelHeading
          index={6}
          section="PROGRAM"
          title="Referrals"
          description="Share your link and log every referral here. Admins verify each one off-platform before points land."
          descriptionWidth={560}
          underTabs
          aside={<Button onClick={program.logReferral}>Log a referral</Button>}
        />

        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              padding: '22px 26px',
              borderRadius: 12,
              border: '1px solid rgba(77,155,255,.25)',
              background: 'rgba(30,124,242,.06)',
              boxShadow: 'inset 0 0 40px rgba(30,124,242,.08)',
            }}
          >
            <div style={kicker()}>YOUR REFERRAL LINK</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginTop: 12,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ font: `500 17px/1 ${font.mono}`, color: color.accentSoft }}>
                {VIEWER.referralLink}
              </span>
              <Button
                variant="secondary"
                small
                onClick={() => program.copyReferralLink(VIEWER.referralLink)}
                style={{ borderRadius: 6, background: 'rgba(8,11,16,.6)', minWidth: 82 }}
              >
                {program.copiedLink ? 'Copied ✓' : 'Copy'}
              </Button>
              <span
                style={{
                  font: `500 10px/1 ${font.mono}`,
                  letterSpacing: '.16em',
                  color: color.textFaint,
                }}
              >
                CODE: {VIEWER.referralCode}
              </span>
            </div>
            <p style={{ margin: '14px 0 0', fontSize: 12.5, lineHeight: 1.5, color: color.textDim }}>
              Signups through this link are attributed to you automatically. Enterprise intros must
              be logged here BEFORE first contact. No retroactive claims.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'SIGNUPS', value: program.referrals.length, accent: false },
              { label: 'VERIFIED', value: 0, accent: false },
              { label: 'POINTS PENDING', value: program.referrals.length * 100, accent: true },
            ].map((stat) => (
              <Stat key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} boxed />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {program.referrals.length === 0 ? (
              <EmptyState outlined>
                No referrals logged yet. Share your link and log your first one.
              </EmptyState>
            ) : (
              program.referrals.map((referral) => (
                <div
                  key={referral.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: 18,
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: 8,
                    border: `1px solid ${border.soft}`,
                    background: color.inset,
                  }}
                >
                  <span style={{ font: `500 14px/1 ${font.sans}`, color: color.text }}>
                    {referral.name}
                  </span>
                  <span style={{ fontSize: 12, color: color.textFaint }}>{referral.date}</span>
                  <span
                    style={{
                      font: `500 9.5px/1 ${font.mono}`,
                      letterSpacing: '.16em',
                      color: color.pending,
                    }}
                  >
                    PENDING
                  </span>
                </div>
              ))
            )}
          </div>
        </PanelBody>
      </TabPanel>
    </>
  )
}
