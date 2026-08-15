import { useState, useEffect } from 'react'
import { getModules, getCards, getDailyMissions, getPlayerMissions } from '../services/games'

export const useGame = (playerId) => {
  const [modules, setModules] = useState([])
  const [cards, setCards] = useState([])
  const [missions, setMissions] = useState([])
  const [playerMissions, setPlayerMissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: mods }, { data: cds }, { data: miss }, { data: pMiss }] = await Promise.all([
        getModules(),
        getCards(),
        getDailyMissions(),
        playerId ? getPlayerMissions(playerId) : Promise.resolve({ data: [] })
      ])
      setModules(mods || [])
      setCards(cds || [])
      setMissions(miss || [])
      setPlayerMissions(pMiss || [])
      setLoading(false)
    }
    fetchData()
  }, [playerId])

  return { modules, cards, missions, playerMissions, loading }
}
