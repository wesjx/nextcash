"use server"

import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { transactionSchema } from "@/validation/transactionSchema";
import { auth } from "@clerk/nextjs/server";

export const createTransaction = async (data: {
    amount: number;
    transactionDate: string;
    description: string;
    categoryId: number;
    isPaid: boolean;
}) => {
    const { userId } = await auth()

    if(!userId) {
        return{
            error: true,
            message: "Unauthorized"
        }
    }

const validation = transactionSchema.safeParse(data)

if (!validation.success){
    return{
        error: true,
        message: validation.error.issues[0].message
    }
}

const [transaction] = await db.insert(transactionsTable).values({
    userId,
    amount: data.amount.toString(),
    description: data.description,
    categoryId: data.categoryId,
    transactionDate: data.transactionDate,
    isPaid: data.isPaid
}).returning()

return{
    id: transaction.id
}
}