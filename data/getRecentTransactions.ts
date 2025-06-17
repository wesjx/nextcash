import "server-only"
import { db } from "@/db"
import { categoriesTable, transactionsTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { desc, eq } from "drizzle-orm"

export async function getRecentTransactions() {
    const { userId } = await auth()

    if (!userId) {
        return []
    }

    const transactions = await db
        .select({
            id: transactionsTable.id,
            description: transactionsTable.description,
            amount: transactionsTable.amount,
            transactionDate: transactionsTable.transactionDate,
            category: categoriesTable.name,
            transactionType: categoriesTable.type,
            isPaid: transactionsTable.isPaid,
        })
        .from(transactionsTable)
        .where(
            eq(transactionsTable.userId, userId)).orderBy(desc(transactionsTable.transactionDate
            ))
        .limit(5).leftJoin(categoriesTable,
            eq(transactionsTable.categoryId, categoriesTable.id)
        )
    return transactions
}