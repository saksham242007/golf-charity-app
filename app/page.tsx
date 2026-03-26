'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [selectedCharity, setSelectedCharity] = useState('')
  const [selectedCharityName, setSelectedCharityName] = useState('')
  const [charities, setCharities] = useState<any[]>([])
  const [score, setScore] = useState('')
  const [scores, setScores] = useState<any[]>([])

  useEffect(() => {
    fetchCharities()
    fetchScores()
  }, [])

  const addScore = async () => {
    console.log('selectedCharity:', selectedCharity)
    console.log('score:', score)

    if (!selectedCharity) {
      alert('Please select a charity')
      return
    }
    if (!score || Number(score) <= 0) {
      alert('Please enter a valid score')
      return
    }

    const { data, error } = await supabase
      .from('scores')
      .insert([{ score: Number(score), charity_id: selectedCharity }])
      .select()

    console.log('INSERT RESULT:', data, error)

    if (error) {
      alert(error.message)
      return
    }

    alert('Score added successfully!')
    setScore('')
    setSelectedCharity('')
    setSelectedCharityName('')
    fetchScores()
  }

  const fetchScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select(`id, score, charities(name)`)
    setScores(data || [])
  }

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*')
    setCharities(data || [])
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Charities</h1>
      {charities.map((c) => <p key={c.id}>{c.name}</p>)}

      <hr />

      <h2>Add Score</h2>

      <p>Selected: <strong>{selectedCharityName || 'None'}</strong></p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {charities.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              console.log('CHARITY CLICKED:', c.id, c.name)
              setSelectedCharity(c.id)
              setSelectedCharityName(c.name)
            }}
            style={{
              padding: '8px 12px',
              background: selectedCharity === c.id ? 'green' : '#333',
              color: 'white',
              border: '1px solid #555',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Enter score"
        style={{ marginRight: 8, padding: '6px 10px' }}
      />

      <button
        onClick={addScore}
        style={{
          padding: '6px 16px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer'
        }}
      >
        Add
      </button>

      <h2>Your Scores</h2>
      {scores.length === 0 && <p>No scores yet</p>}
      {scores.map((s) => (
        <p key={s.id}>{s.score} - {s.charities?.name}</p>
      ))}
    </div>
  )
}