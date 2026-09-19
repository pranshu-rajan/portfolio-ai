import { NextRequest, NextResponse } from "next/server";
import { getMongoClientPromise } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");

    if (!sessionId && !userId) {
      return NextResponse.json({ error: "sessionId or userId is required" }, { status: 400 });
    }

    const mongoPromise = getMongoClientPromise();
    if (!mongoPromise) {
      return NextResponse.json({ sessions: [], messages: [] });
    }

    const client = await mongoPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "pranshu_portfolio_db");
    const col = db.collection("chat_sessions");

    // If specific sessionId requested, return that session's messages
    if (sessionId) {
      const session = await col.findOne({ session_id: sessionId });
      if (session) {
        return NextResponse.json({
          sessionId: session.session_id,
          title: session.title || "Chat Session",
          messages: session.messages || [],
        });
      }
      return NextResponse.json({ sessionId, messages: [] });
    }

    // Otherwise return list of recent sessions for userId
    if (userId) {
      const sessions = await col
        .find({ user_id: userId })
        .sort({ updated_at: -1 })
        .limit(10)
        .project({ session_id: 1, title: 1, updated_at: 1, messageCount: { $size: "$messages" } })
        .toArray();

      return NextResponse.json({ sessions });
    }

    return NextResponse.json({ messages: [] });
  } catch (err: unknown) {
    console.error("Chat history fetch error:", err);
    return NextResponse.json({ error: "Failed to retrieve chat history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, userId, title, messages } = body;

    if (!sessionId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "sessionId and messages array are required." },
        { status: 400 }
      );
    }

    const mongoPromise = getMongoClientPromise();
    if (!mongoPromise) {
      // Local fallback without Atlas
      return NextResponse.json({ success: true, storedInDatabase: false });
    }

    const client = await mongoPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "pranshu_portfolio_db");
    const col = db.collection("chat_sessions");

    const now = new Date();

    // Auto-generate title from the first user query if not provided
    let sessionTitle = title;
    if (!sessionTitle) {
      const firstUserMsg = messages.find((m: { role: string }) => m.role === "user");
      if (firstUserMsg && firstUserMsg.content) {
        sessionTitle =
          firstUserMsg.content.slice(0, 36) + (firstUserMsg.content.length > 36 ? "..." : "");
      } else {
        sessionTitle = "New Conversation";
      }
    }

    await col.updateOne(
      { session_id: sessionId },
      {
        $set: {
          session_id: sessionId,
          user_id: userId || "anonymous",
          title: sessionTitle,
          messages,
          updated_at: now,
        },
        $setOnInsert: {
          created_at: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, storedInDatabase: true });
  } catch (err: unknown) {
    console.error("Chat history save error:", err);
    return NextResponse.json({ error: "Failed to persist chat session" }, { status: 500 });
  }
}
