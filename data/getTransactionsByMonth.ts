import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { format } from "date-fns";
import "server-only"

export async function getTransactionsByMonth({
    month, year
}: {
    month: number;
    year: number
}) {
    const { userId } = await auth();

    if (!userId) {
        return null
    }

    const earliestDate = new Date(year, month - 1, 1);
    const latestDate = new Date(year, month, 0) //to grab the last day of the month

    const transactions = await db
        .select({
            id: transactionsTable.id,
            description: transactionsTable.description,
            amount: transactionsTable.amount,
            transactionDate: transactionsTable.transactionDate,
            category: categoriesTable.name,
            transactionType: categoriesTable.type,
            isPaid: transactionsTable.isPaid
        })
        .from(transactionsTable)
        .where(
            and(
                eq(transactionsTable.userId, userId),
                gte(
                    transactionsTable.transactionDate,
                    format(earliestDate, "yyyy-MM-dd")
                ),
                lte(transactionsTable.transactionDate, format(latestDate, "yyyy-MM-dd"))
            )
            //eq: check if transactionsTable.userId is equal user logged in
            //gte: check if the transaction date is greater than or equal to our earliest date
            //lte:check if the transaction date is less than or equal to our latest date
        ).orderBy(desc(transactionsTable.transactionDate)).leftJoin(categoriesTable,
            eq(transactionsTable.categoryId, categoriesTable.id)
        )
        //leftjoin is to join the category table with transaction table

    return transactions
}