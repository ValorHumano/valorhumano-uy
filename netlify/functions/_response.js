const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store"
};

export function withCors(headers = {}) {
  return {
    ...corsHeaders,
    ...headers
  };
}

export function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: withCors({
      "Content-Type": "application/json; charset=utf-8"
    })
  });
}

export function empty(status = 204) {
  return new Response(null, {
    status,
    headers: withCors()
  });
}
