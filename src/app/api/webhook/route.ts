import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import {
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature)
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature")
    const apiKey = req.headers.get("x-api-key")

    if (!signature || !apiKey) {
        return NextResponse.json({ error: "Missing headers" }, { status: 400 })
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body)
    } catch (error) {
        console.error("Error parsing webhook payload:", error);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;
        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing"))
                )
            );

        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting Not found" }, { status: 404 })
        }

        await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, existingMeeting.id))
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (existingAgent) {
            try {
                // console.log(`[Webhook] Connecting AI Agent ${existingAgent.id} to call ${meetingId}...`);
                const call = streamVideo.video.call("default", meetingId);
                const realtimeClient = await streamVideo.video.connectOpenAi({
                    call,
                    openAiApiKey: process.env.OPENAI_API_KEY!,
                    agentUserId: existingAgent.id,
                });

                // console.log(`[Webhook] RealtimeClient connected, updating session instructions...`);
                realtimeClient.updateSession({
                    instructions: existingAgent.instructions,
                });
                // console.log(`[Webhook] AI Agent connection successful.`);
            } catch (error) {
                console.error("[Webhook] Error connecting AI Agent:", error);
            }
        }
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    }
    return NextResponse.json({ status: "ok" })
}

// if (eventType === "call.session_ended") {
    //     const event = payload as CallEndedEvent;
    //     const meetingId = event.call.custom?.meetingId;
    //     if (!meetingId) {
    //         return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    //     }

    //     const [existingMeeting] = await db
    //         .select()
    //         .from(meetings)
    //         .where(
    //             and(
    //                 eq(meetings.id, meetingId),
    //                 not(eq(meetings.status, "completed")),
    //                 not(eq(meetings.status, "active")),
    //                 not(eq(meetings.status, "cancelled")),
    //                 not(eq(meetings.status, "processing"))
    //             )
    //         );

    //     if (!existingMeeting) {
    //         return NextResponse.json({ error: "Meeting Not found" }, { status: 404 })
    //     }

    //     await db
    //         .update(meetings)
    //         .set({
    //             status: "completed",
    //             endedAt: new Date(),
    //         })
    //         .where(eq(meetings.id, existingMeeting.id))

    // } else if (eventType === "call.session_participant_joined") {
    //     const { participant } = payload as any;
    //     const meetingId = (payload as any).call_cid?.split(":")[1];

    //     if (!meetingId) {
    //         return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    //     }

    //     console.log("[Webhook] Participant Joined:", JSON.stringify(participant, null, 2));

    //     // Avoid infinite loop if the AI is joining (fallback text matching on ID)
    //     if (participant?.id?.match(/_agent_/)) {
    //         console.log("[Webhook] Ignoring bot participant join event (matched _agent_ ID).");
    //         return NextResponse.json({ status: "ok" });
    //     }

    //     const [existingMeeting] = await db
    //         .select()
    //         .from(meetings)
    //         .where(eq(meetings.id, meetingId));

    //     if (!existingMeeting) return NextResponse.json({ status: "ok" });

    //     // Skip adding agent if the participant joining IS the agent's ID
    //     if (participant?.id === existingMeeting.agentId) {
    //         console.log("[Webhook] Ignoring bot participant join event (matched agentId).");
    //         return NextResponse.json({ status: "ok" });
    //     }