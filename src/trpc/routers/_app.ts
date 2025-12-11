import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
    hello: baseProcedure
        .input
        (z.object({
            text: z.string(),
        }),
        )
        .query((otps) => {
            return { greeting: `Hello ${otps.input.text}` };
        })
});

export type AppRouter = typeof appRouter;