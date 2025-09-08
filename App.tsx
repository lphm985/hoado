import { supabase } from './supabase'

import React, { useEffect, useState } from "react"
import {
  loadGameData,
  loadPlayer,
  savePlayer,
  loadChat,
  sendChat,
} from "./api"

interface Player {
  name: string
  level: number
  exp: number
  items: any[]
}

export default function App() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [game, setGame] = useState<any>(null)
  const [chat, setChat] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [token, setToken] = useState<string | null>(null)

  // Lấy token từ Supabase Auth
  useEffect(() => {
    async function fetchToken() {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || null
      setToken(accessToken)
    }
    fetchToken()
  }, [])

  // load game data
  useEffect(() => {
    if (!token) return

    async function fetchGame() {
      try {
        const res = await loadGameData(token)
        setGame(res.data)
      } catch (err) {
        console.error("Load game failed", err)
      }
    }

    fetchGame()
  }, [token])

  // load player
  useEffect(() => {
    if (!token) return

    async function fetchPlayer() {
      try {
        const res = await loadPlayer(token)
        setPlayer(res.player)
      } catch (err) {
        console.error("Load player failed", err)
      }
    }

    fetchPlayer()
  }, [token])

  // load chat
  useEffect(() => {
    if (!token) return

    async function fetchChat() {
      try {
        const res = await loadChat(token)
        setChat(res.messages)
      } catch (err) {
        console.error("Load chat failed", err)
      }
    }

    fetchChat()
  }, [token])

  // save player (ví dụ khi nhấn nút)
  async function handleSave() {
    if (!token || !player) return
    try {
      const res = await savePlayer(token, player)
      console.log("Saved:", res)
    } catch (err) {
      console.error("Save failed", err)
    }
  }

  // send chat
  async function handleSendChat() {
    if (!token) return
    try {
      const res = await sendChat(token, player?.name || "Unknown", message)
      setChat([...chat, ...res.created])
      setMessage("")
    } catch (err) {
      console.error("Chat failed", err)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Tu Tiên Ký</h1>

      <section>
        <h2>Player</h2>
        {player ? (
          <div>
            <p>Tên: {player.name}</p>
            <p>Level: {player.level}</p>
            <p>Kinh nghiệm: {player.exp}</p>
            <button onClick={handleSave}>Lưu</button>
          </div>
        ) : (
          <p>Chưa có dữ liệu người chơi</p>
        )}
      </section>

      <section>
        <h2>Game Data</h2>
        <pre>{JSON.stringify(game, null, 2)}</pre>
      </section>

      <section>
        <h2>Chat</h2>
        <div style={{ border: "1px solid #ccc", padding: 10, maxHeight: 200, overflowY: "auto" }}>
          {chat.map((c, i) => (
            <p key={i}>
              <b>{c.username}</b>: {c.message}
            </p>
          ))}
        </div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSendChat}>Gửi</button>
      </section>
    </div>
  )
}
