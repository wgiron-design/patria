// api/mensajes.js — Vercel Serverless Function
// GET  /api/mensajes  → { mensajes: [...] }
// POST /api/mensajes  → { ok: true, id: N }
// NUNCA exponer credenciales en el frontend.
// Las credenciales se configuran en Vercel > Settings > Environment Variables.

import { neon } from '@neondatabase/serverless';

// DATABASE_URL se configura en Vercel como variable de entorno:
//   postgresql://neondb_owner:<password>@<pooler-host>/neondb?sslmode=require

function generateCode() {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS mensajes (
      id           SERIAL PRIMARY KEY,
      nombre       VARCHAR(120) NOT NULL,
      departamento VARCHAR(80)  NOT NULL DEFAULT '',
      mensaje      TEXT         NOT NULL,
      codigo       VARCHAR(5),
      created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS codigo VARCHAR(5)
  `;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'DATABASE_URL environment variable is missing' });
    }
    const sql = neon(process.env.DATABASE_URL);
    await ensureTable(sql);

    // ── GET ────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { codigo, search } = req.query || {};

      let rows;
      if (codigo) {
        rows = await sql`
          SELECT
            id,
            nombre,
            departamento,
            mensaje,
            codigo,
            TO_CHAR(created_at AT TIME ZONE 'America/Guatemala', 'HH24:MI') AS hora,
            created_at
          FROM mensajes
          WHERE UPPER(codigo) = UPPER(${codigo.trim()})
          ORDER BY created_at DESC
        `;
      } else {
        rows = await sql`
          SELECT
            id,
            nombre,
            departamento,
            mensaje,
            codigo,
            TO_CHAR(created_at AT TIME ZONE 'America/Guatemala', 'HH24:MI') AS hora,
            created_at
          FROM mensajes
          ORDER BY created_at DESC
          LIMIT 250
        `;
      }
      return res.status(200).json({ mensajes: rows });
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { nombre, departamento = '', mensaje } = req.body ?? {};

      if (!nombre?.trim() || !mensaje?.trim())
        return res.status(400).json({ error: 'nombre y mensaje son requeridos' });

      if (nombre.length > 120 || mensaje.length > 800)
        return res.status(400).json({ error: 'Texto demasiado largo' });

      const codigo = generateCode();

      const [row] = await sql`
        INSERT INTO mensajes (nombre, departamento, mensaje, codigo)
        VALUES (${nombre.trim()}, ${departamento.trim()}, ${mensaje.trim()}, ${codigo})
        RETURNING id, codigo, nombre, departamento, mensaje, created_at
      `;
      return res.status(201).json({
        ok: true,
        id: row.id,
        codigo: row.codigo,
        mensaje: row
      });
    }

    return res.status(405).json({ error: 'Metodo no permitido' });

  } catch (err) {
    console.error('Error /api/mensajes:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
