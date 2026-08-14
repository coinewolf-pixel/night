import { useState, useCallback } from 'react'
import { listModules } from '../services/modules'
import { listCards, completeCard } from '../services/cards'
import { useAuth } from './useAuth'

// Drives the mode -> module -> card -> complete flow.
export function useGame() {
  const { setProfile } = useAuth()
  const [modules, setModules] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadModules = useCallback(async () => {
    setLoading(true); setError(null)
    try { setModules(await listModules()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  const loadCards = useCallback(async (moduleId) => {
    setLoading(true); setError(null)
    try { setCards(await listCards(moduleId)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  // Returns { profile, gainedNexo, gainedXp } after secure crediting.
  const finishCard = useCallback(async (card, result = 'completed') => {
    const updated = await completeCard(card.id, result)
    setProfile(updated)
    return {
      profile: updated,
      gainedNexo: result === 'completed' ? card.reward_nexo : 0,
      gainedXp: result === 'completed' ? card.reward_xp : 0,
    }
  }, [setProfile])

  return { modules, cards, loading, error, loadModules, loadCards, finishCard }
}
