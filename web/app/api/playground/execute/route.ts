import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Kita ganti kredensial dari DATABASE_URL admin ke kredensial terisolasi
function getPlaygroundConnectionString() {
  const adminUrl = process.env.DATABASE_URL || '';
  if (!adminUrl) return 'postgresql://playground_user:playground_pass@localhost:5432/trusmi_db';
  
  try {
    const url = new URL(adminUrl);
    url.username = 'playground_user';
    url.password = 'playground_pass';
    return url.toString();
  } catch(e) {
    return 'postgresql://playground_user:playground_pass@localhost:5432/trusmi_db';
  }
}

// Separate pool restricted to playground user
const pool = new Pool({
  connectionString: getPlaygroundConnectionString(),
  max: 5, // Strict connection limit
  idleTimeoutMillis: 10000,
});

// Simple in-memory rate limiter untuk demo
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (Mencegah DDoS Koneksi)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip) || { count: 0, resetAt: now + 60000 };
    
    if (now > rateLimit.resetAt) {
      rateLimit.count = 1;
      rateLimit.resetAt = now + 60000;
    } else {
      rateLimit.count++;
      if (rateLimit.count > 30) { // Max 30 queries per minute per IP
        return NextResponse.json({ error: 'Terlalu banyak request. Silakan tunggu 1 menit.' }, { status: 429 });
      }
    }
    rateLimitMap.set(ip, rateLimit);

    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query tidak valid.' }, { status: 400 });
    }

    // 2. Proteksi OOM (Out Of Memory)
    // Jika query diawali dengan SELECT atau WITH, kita bungkus paksa dengan LIMIT 500
    // Supaya user tidak bisa mengirimkan jutaan baris data yang bisa bikin Node.js crash.
    let finalQuery = query;
    const isSelect = /^\s*(SELECT|WITH)\b/i.test(query);
    if (isSelect) {
      finalQuery = `SELECT * FROM (\n${query}\n) AS user_query LIMIT 500`;
    }

    const client = await pool.connect();
    try {
      // 3. Batasi waktu eksekusi statement maksimal 3 detik (Proteksi query menggantung)
      await client.query("SET statement_timeout = '3000'");
      
      const result = await client.query(finalQuery);
      return NextResponse.json({
        success: true,
        data: result.rows,
        rowCount: result.rowCount,
        fields: result.fields.map(f => f.name)
      });
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    // Mengembalikan pesan error asli dari PostgreSQL agar reviewer bisa debug
    return NextResponse.json({ 
      error: error.message || 'Terjadi kesalahan eksekusi pada database.'
    }, { status: 400 });
  }
}
