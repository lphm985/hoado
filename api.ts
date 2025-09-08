import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || "https://hoado-backend.onrender.com"

export async function loadGameData(token: string) {
  const res = await fetch(`${API_URL}/game`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to load game data")
  return res.json()
}


export async function loadPlayer(token: string) {
  const res = await fetch(`${API_URL}/player`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to load player data")
  return res.json()
}

export async function savePlayer(token: string, data: any) {
  const res = await fetch(`${API_URL}/player`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  })
  if (!res.ok) throw new Error("Failed to save player data")
  return res.json()
}

export async function loadChat(token: string) {
  const res = await fetch(`${API_URL}/chat`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to load chat")
  return res.json()
}

export async function sendChat(token: string, username: string, message: string) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, message }),
  })
  if (!res.ok) throw new Error("Failed to send chat")
  return res.json()
}
