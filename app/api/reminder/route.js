let clients = [];

export function GET() {
  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const send = (data) => {
          try {
            // <-- Use a template string here (backticks) so the `data:` line is valid SSE format
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch (err) {
            console.log("⚠ SSE client disconnected or enqueue failed, removing.");
            clients = clients.filter((c) => c !== send);
            try { controller.close(); } catch {}
          }
        };

        // Add this client's send function to the list
        clients.push(send);

        // Remove client on disconnect
        controller.signal?.addEventListener("abort", () => {
          console.log("❌ Client aborted SSE");
          clients = clients.filter((c) => c !== send);
          try { controller.close(); } catch {}
        });
      },
      cancel(reason) {
        // optional: handle stream cancel from server side
        console.log("SSE stream cancelled:", reason);
      }
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("🔔 API Trigger Received:", data);

    // iterate over a copy to avoid mutation issues while removing clients
    const snapshot = [...clients];
    snapshot.forEach((send) => {
      try {
        send(data);
      } catch (err) {
        console.log("⚠ Removing dead SSE client", err);
        clients = clients.filter((c) => c !== send);
      }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Reminder API error:", err);
    return new Response(JSON.stringify({ error: "server-error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
