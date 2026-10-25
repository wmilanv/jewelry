import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy hacia Meshy AI (Image-to-3D API v1) y Tripo3D (Image-to-Model v2).
 * Permite usar una API Key configurada en variables de entorno (MESHY_API_KEY o TRIPO_API_KEY)
 * o una clave enviada desde el panel / cliente en la cabecera `x-ai-key`.
 */

const MESHY_BASE = 'https://api.meshy.ai/openapi/v1/image-to-3d';
const TRIPO_BASE = 'https://api.tripo3d.ai/v2/openapi/task';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider: 'meshy' | 'tripo' = body.provider || 'meshy';
    const imageUrl: string = body.imageUrl; // puede ser https://... o data:image/png;base64,...
    const headerKey = req.headers.get('x-ai-key')?.trim();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Falta la imagen (imageUrl).' }, { status: 400 });
    }

    if (provider === 'tripo') {
      const apiKey = headerKey || process.env.TRIPO_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Configura tu API Key de Tripo3D (o usa el modo Relieve 3D Instantáneo gratuito sin clave).' },
          { status: 401 },
        );
      }
      const res = await fetch(TRIPO_BASE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'image_to_model',
          file: { type: 'png', url: imageUrl },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data?.message || 'Error en Tripo3D API' }, { status: res.status });
      }
      return NextResponse.json({ taskId: data?.data?.task_id, provider: 'tripo' });
    }

    // Por defecto: Meshy AI Image-to-3D
    const apiKey = headerKey || process.env.MESHY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Ingresa tu API Key de Meshy AI (meshy.ai) o usa el modo "Relieve 3D Instantáneo" 100% gratuito sin API Key.' },
        { status: 401 },
      );
    }

    const res = await fetch(MESHY_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        enable_pbr: true,
        should_remesh: true,
        should_texture: true,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Error al crear tarea en Meshy AI' }, { status: res.status });
    }

    return NextResponse.json({ taskId: data.result, provider: 'meshy' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error interno en Image-to-3D' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    const provider = (searchParams.get('provider') || 'meshy') as 'meshy' | 'tripo';
    const headerKey = req.headers.get('x-ai-key')?.trim();

    if (!taskId) {
      return NextResponse.json({ error: 'Falta taskId' }, { status: 400 });
    }

    if (provider === 'tripo') {
      const apiKey = headerKey || process.env.TRIPO_API_KEY;
      const res = await fetch(`${TRIPO_BASE}/${encodeURIComponent(taskId)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await res.json();
      const st = data?.data?.status;
      return NextResponse.json({
        status: st === 'success' ? 'SUCCEEDED' : st === 'failed' ? 'FAILED' : 'IN_PROGRESS',
        progress: data?.data?.progress ?? 0,
        glbUrl: data?.data?.output?.model || null,
      });
    }

    const apiKey = headerKey || process.env.MESHY_API_KEY;
    const res = await fetch(`${MESHY_BASE}/${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Error consultando Meshy AI' }, { status: res.status });
    }

    return NextResponse.json({
      status: data.status, // PENDING | IN_PROGRESS | SUCCEEDED | FAILED
      progress: data.progress ?? 0,
      glbUrl: data?.model_urls?.glb || null,
      thumbnailUrl: data?.thumbnail_url || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error consultando tarea 3D' }, { status: 500 });
  }
}

