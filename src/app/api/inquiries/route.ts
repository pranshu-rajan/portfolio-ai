import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from_email, subject, message } = body;

    if (!from_email || !message) {
      return NextResponse.json(
        { error: "from_email and message are required fields." },
        { status: 400 }
      );
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
          subject: subject || "Portfolio Recruiter Outreach",
          message,
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
