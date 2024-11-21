import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  const fileUrl = new URL(url).searchParams.get('url');

  if (!fileUrl) {
    return new Response('URL no proporcionada', { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Error al obtener el archivo: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const fileName = fileUrl.split('/').pop() || 'archivo_descargado';

    // Devuelve el archivo con el tipo y nombre originales
    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    return new Response('Error al descargar el archivo remoto', { status: 500 });
  }
};
