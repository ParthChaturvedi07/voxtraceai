import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
        return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    try {
        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(eq(meetings.id, meetingId));

        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        // Return the agent's instructions and the API configuration to connect to Gemini
        return NextResponse.json({
            instructions: existingAgent.instructions,
            // Returning the API key to the client so it can establish the WebSocket connection.
            geminiApiKey: process.env.GEMINI_API_KEY,
        });
    } catch (error) {
        console.error("Error fetching agent config:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
