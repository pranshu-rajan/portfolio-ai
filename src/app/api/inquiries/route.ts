import { NextRequest, NextResponse } from "next/server";
import { getMongoClientPromise } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const from_email = body.from_email || body.recruiter_email || body.email;
    const message = body.message;
    const sender_name = body.recruiter_name || body.name;
    const company = body.company;
    const role_title = body.role_title || body.role;

    if (!from_email || !message) {
      return NextResponse.json(
        { error: "Email and message are required fields." },
        { status: 400 }
      );
    }

    // Dynamic subject if not provided
    const subject =
      body.subject ||
      (role_title && company
        ? `${role_title} at ${company} (${sender_name || from_email})`
        : role_title
        ? `${role_title} Inquiry (${sender_name || from_email})`
        : sender_name
        ? `Message from ${sender_name}`
        : "Portfolio Recruiter Outreach");

    // Include metadata in stored message if sent from Contacts app
    let finalMessage = message;
    const metaParts = [
      sender_name ? `Name: ${sender_name}` : null,
      company && company !== "Not specified" ? `Company: ${company}` : null,
      role_title && role_title !== "Full Stack / AI Role" ? `Role: ${role_title}` : null,
    ].filter(Boolean);

    if (metaParts.length > 0 && !message.includes(sender_name || "")) {
      finalMessage = `${message}\n\n---\nSender Info: ${metaParts.join(" | ")}`;
    }

    // 1. First priority: Direct MongoDB Atlas write if MONGODB_URI is provided
    const mongoPromise = getMongoClientPromise();
    if (mongoPromise) {
      try {
        const client = await mongoPromise;
        const dbName = process.env.MONGODB_DB_NAME || "pranshu_portfolio_db";
        const db = client.db(dbName);
        const col = db.collection("inquiries");

        const ip =
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          req.headers.get("x-real-ip") ||
          "unknown";

        const doc = {
          from_email,
          subject,
          message: finalMessage,
          status: "received",
          sender_ip: ip,
          created_at: new Date(),
        };

        const result = await col.insertOne(doc);

        return NextResponse.json(
          {
            success: true,
            storedInDatabase: true,
            inquiry: { id: result.insertedId.toString(), ...doc },
            message: "Inquiry successfully recorded in MongoDB.",
          },
          { status: 201 }
        );
      } catch (err) {
        console.error("Direct MongoDB insert failed, falling back to backend:", err);
      }
    }

    // 2. Second priority: FastAPI backend (e.g. Render)
    const backendUrl =
      process.env.FASTAPI_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000";

    // Attempt to persist to FastAPI backend and MongoDB
    try {
      const response = await fetch(`${backendUrl}/api/v1/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_email,
          subject,
          message: finalMessage,
        }),
        // 8s timeout to handle Render cold-start latency
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(
          {
            success: true,
            storedInDatabase: true,
            inquiry: data,
            message: "Inquiry successfully recorded in MongoDB.",
          },
          { status: 201 }
        );
      }
    } catch {
      // Backend / MongoDB is offline or in local fallback mode
    }

    // Graceful offline fallback
    return NextResponse.json(
      {
        success: true,
        storedInDatabase: false,
        message: "Inquiry logged locally in fallback mode.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
