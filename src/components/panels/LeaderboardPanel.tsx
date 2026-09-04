/**
 * Leaderboard — individual ranking, and the campus teams behind it.
 *
 * Bars are scaled against the leader rather than a round number, so the shape
 * of the field reads at a glance even early in a semester.
 */
import { border, brandFill, color, font } from '../../design/tokens'
import { LEADERS, TEAMS, VIEWER } from '../../data'
import { PANEL_TABS, type TabOf } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { PanelBody } from '../shell/Panel'
import { Avatar, Button, Meter, PanelHeading, Unit } from '../ui'
import { PanelTabs, TabPanel } from '../shell/PanelTabs'

const TIER_COLOR: Record<string, string> = {
  Legend: color.pending,
  Captain: color.accentSoft,
  Rookie: color.textFaint,
}

export function LeaderboardPanel({ program }: { program: ProgramState }) {
  const tabs = PANEL_TABS.Leaderboard
  const active: TabOf<'Leaderboard'> = program.tabs.Leaderboard ?? tabs[0]
  const topScore = LEADERS[0]?.points ?? 1

  return (
    <>
      <PanelTabs
        tabs={tabs}
        active={active}
        onSelect={(tab) => program.selectTab('Leaderboard', tab)}
        label="Leaderboard views"
      />

      <TabPanel active={active === 'Ambassadors'}>
        <PanelHeading
          index={5}
          section="PROGRAM"
          title="Leaderboard"
          description="Fall semester · resets Jan 1."
          underTabs
          aside={
            <div
              style={{
                display: 'flex',
                gap: 4,
                padding: 4,
                border: `1px solid ${border.base}`,
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  padding: '8px 14px',
                  borderRadius: 5,
                  background: 'rgba(30,124,242,.2)',
                  color: color.accentSoft,
                  font: `500 12px/1 ${font.sans}`,
                }}
              >
                Semester
              </span>
              <span
                style={{ padding: '8px 14px', color: color.textDim, font: `500 12px/1 ${font.sans}` }}
              >
                All time
              </span>
            </div>
          }
        />

        <PanelBody
          style={{
            padding: '24px 44px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {LEADERS.map((leader, i) => {
            const isViewer = leader.name === VIEWER.name
            return (
              <div
                key={leader.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr 1fr auto',
                  alignItems: 'center',
                  gap: 18,
                  padding: '14px 18px',
                  borderRadius: 8,
                  border: `1px solid ${isViewer ? border.accentStrong : border.soft}`,
                  background: isViewer ? brandFill.faint : color.inset,
                }}
              >
                <span
                  style={{
                    font: `600 22px/1 ${font.display}`,
                    color: i < 3 ? color.accentSoft : color.textFaint,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={leader.name} />
                  <div>
                    <div style={{ font: `600 14px/1.2 ${font.sans}`, color: color.text }}>
                      {leader.name}
                    </div>
                    <div style={{ fontSize: 12, color: color.textFaint, marginTop: 3 }}>
                      {leader.school}
                    </div>
                  </div>
                </div>
                <Meter percent={Math.round((leader.points / topScore) * 100)} emphasis />
                <div style={{ textAlign: 'right' }}>
                  <span style={{ font: `600 18px/1 ${font.mono}`, color: color.text }}>
                    {leader.points.toLocaleString()}
                  </span>
                  <span
                    style={{
                      font: `500 10px/1 ${font.mono}`,
                      letterSpacing: '.14em',
                      color: TIER_COLOR[leader.tier],
                      marginLeft: 10,
                    }}
                  >
                    {leader.tier.toUpperCase()}
                  </span>
                </div>
              </div>
            )
          })}
        </PanelBody>
      </TabPanel>

      <TabPanel active={active === 'Campuses'}>
        <PanelHeading
          index={5}
          section="PROGRAM"
          title="Campus teams"
          description="Ambassadors grouped by school. Team points unlock campus budgets."
          underTabs
          aside={<Button variant="secondary">Request a team</Button>}
        />

        <PanelBody
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 14,
            alignContent: 'start',
          }}
        >
          {TEAMS.map((team) => (
            <div
              key={team.name}
              style={{
                padding: '22px 24px',
                borderRadius: 12,
                border: `1px solid ${team.isMine ? border.accentStrong : border.base}`,
                background: team.isMine ? brandFill.faint : color.inset,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ font: `600 20px/1.2 ${font.sans}`, color: color.text }}>
                  {team.name}
                </span>
                <span
                  style={{
                    font: `500 9.5px/1 ${font.mono}`,
                    letterSpacing: '.16em',
                    color: team.isMine ? color.accent : color.textFaint,
                  }}
                >
                  {team.isMine ? 'YOUR TEAM' : team.location}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {team.memberInitials.map((member) => (
                  <Avatar key={member} name={member} size={30} stacked />
                ))}
                <span style={{ marginLeft: 16, fontSize: 12, color: color.textFaint }}>
                  {team.memberCount} ambassadors
                </span>
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <span style={{ font: `600 30px/1 ${font.display}`, color: color.accentSoft }}>
                  {team.points.toLocaleString()} <Unit size={13}>PTS</Unit>
                </span>
                <span style={{ fontSize: 12, color: color.textDim }}>
                  {team.eventCount} events this term
                </span>
              </div>
            </div>
          ))}
        </PanelBody>
      </TabPanel>
    </>
  )
}
