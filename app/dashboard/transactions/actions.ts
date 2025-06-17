"use server"

import { db } from "@/db"
import { transactionsTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updatePaidTransaction(transactionId : number ) {
    const { userId } = await auth()

    if (!userId) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }

    const [transaction] = await db
        .update(transactionsTable).set({
            isPaid: true
        })
        .where(eq(transactionsTable.id, transactionId))
        .returning()

        revalidatePath("/dashboard/transactions")

    return {
        isPaid: transaction.isPaid
    }
}