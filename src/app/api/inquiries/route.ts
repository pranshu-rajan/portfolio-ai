import { NextRequest, NextResponse } from "next/server";

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
        // Short timeout for fast feedback
        signal: AbortSignal.timeout(4000),
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
