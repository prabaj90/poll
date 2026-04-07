import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  // Load persisted vote counts from localStorage so refresh keeps the current totals.
  const [yesVotes, setYesVotesState] = useState(() => {
    try {
      return Math.max(0, parseInt(localStorage.getItem('yesVotes')) || 0)
    } catch {
      return 0
    }
  })
  const [noVotes, setNoVotesState] = useState(() => {
    try {
      return Math.max(0, parseInt(localStorage.getItem('noVotes')) || 0)
    } catch {
      return 0
    }
  })

  // Parse storage values safely and normalize invalid numbers to zero.
  const safeParseInt = useCallback((value, defaultValue = 0) => {
    try {
      const parsed = parseInt(value)
      return isNaN(parsed) ? defaultValue : Math.max(0, parsed)
    } catch {
      return defaultValue
    }
  }, [])

  const setYesVotes = useCallback((val) => {
    const safeVal = Math.max(0, val)
    setYesVotesState(safeVal)
    try {
      localStorage.setItem('yesVotes', safeVal.toString())
    } catch (error) {
      console.warn('Failed to save yes votes:', error)
    }
  }, [])

  const setNoVotes = useCallback((val) => {
    const safeVal = Math.max(0, val)
    setNoVotesState(safeVal)
    try {
      localStorage.setItem('noVotes', safeVal.toString())
    } catch (error) {
      console.warn('Failed to save no votes:', error)
    }
  }, [])

  useEffect(() => {
    // Sync vote totals across open tabs/windows using storage events.
    const handleStorage = (e) => {
      if (e.key === 'yesVotes') {
        try {
          setYesVotesState(safeParseInt(e.newValue, 0))
        } catch (error) {
          console.warn('Failed to update yes votes from storage:', error)
        }
      } else if (e.key === 'noVotes') {
        try {
          setNoVotesState(safeParseInt(e.newValue, 0))
        } catch (error) {
          console.warn('Failed to update no votes from storage:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [safeParseInt])

  const totalPolled = yesVotes + noVotes

  const leadingOption = yesVotes > noVotes ? 'Yes' : noVotes > yesVotes ? 'No' : totalPolled === 0 ? 'No votes yet' : 'Tie'
  const leadingClass = yesVotes > noVotes ? 'yes-pill' : noVotes > yesVotes ? 'no-pill' : 'neutral-pill'

  // Track whether the current browser session has already cast a vote.
  const [hasVoted, setHasVoted] = useState(() => !!sessionStorage.getItem('voted'))

  const handleYes = () => {
    if (!hasVoted) {
      setYesVotes(yesVotes + 1)
      sessionStorage.setItem('voted', 'yes')
      setHasVoted(true)
    }
  }

  const handleNo = () => {
    if (!hasVoted) {
      setNoVotes(noVotes + 1)
      sessionStorage.setItem('voted', 'no')
      setHasVoted(true)
    }
  }

  const handleReset = () => {
    // Reset only this session's vote and allow the user to vote again.
    const votedChoice = sessionStorage.getItem('voted')
    if (votedChoice === 'yes') {
      setYesVotes(Math.max(0, yesVotes - 1))
    } else if (votedChoice === 'no') {
      setNoVotes(Math.max(0, noVotes - 1))
    }
    sessionStorage.removeItem('voted')
    setHasVoted(false)
  }

  return (
    <div className="app">
      <h1>Online Poll</h1>
      <div className="buttons">
        <button disabled={hasVoted} onClick={handleYes} className="yes-btn">Yes</button>
        <button disabled={hasVoted} onClick={handleNo} className="no-btn">No</button>
        <button onClick={handleReset} className="reset-btn">Reset</button>
      </div>
      {hasVoted && <p className="vote-status">You have already voted. Use reset to change your vote.</p>}
      <div className="counts">
        <p>Yes Votes: {yesVotes}</p>
        <p>No Votes: {noVotes}</p>
        <p>Polled Users: {totalPolled}</p>
        <p>
          Leading Option: <span className={`leading-pill ${leadingClass}`}>{leadingOption}</span>
        </p>
      </div>
    </div>
  )
}

export default App