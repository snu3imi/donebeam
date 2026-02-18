import { NextRequest, NextResponse } from "next/server"

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1473632592334159884/iKHSQTTMSHnRd0TGYmpFpwxxf1M1QAMWTccGJltzQ7g6xqPD7DK7FKlwvRKzVrFxkFOG"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "New Access Request",
            color: 0xdc2626,
            fields: [
              { name: "Email", value: email, inline: true },
              {
                name: "Requested At",
                value: new Date().toLocaleString("en-US", {
                  timeZone: "UTC",
                }),
                inline: true,
              },
            ],
            footer: { text: "Elit Tools - Access Request" },
          },
        ],
      }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to send request" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
