const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*hint/i.test(m.quoted.contentText)) return !0
  conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
  if (!(id in conn.tebakgambar)) return m.reply('Soal itu telah berakhir')
  // if (m.quoted.id == conn.tebakgambar[id][0].id) { // undefined T_T
  let json = JSON.parse(JSON.stringify(conn.tebakgambar[id][1]))
  if (/^.*hint$/i.test(m.text)) return !0
  if (m.text.toLowerCase() == json.result.jawaban.toLowerCase()) {
    global.db.data.users[m.sender].exp += conn.tebakgambar[id][2]
    m.reply(`*Benar!*\n+${conn.tebakgambar[id][2]} XP`)
    clearTimeout(conn.tebakgambar[id][3])
    delete conn.tebakgambar[id]
  } else if (similarity(m.text.toLowerCase(), json.result.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
  else m.reply(`*Salah!*`)
  // }
  return !0
}
handler.exp = 0

module.exports = handler
