"use client"

import TransactionForm, { transactionFormSchema } from "@/components/transaction-form"
import { type Category } from "@/types/Category"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { updateTransaction } from "./actions"
import { format } from "date-fns"

export default function EditTransactionForm({ categories, transaction }: {
    categories: Category[],
    transaction: {
        id: number,
        categoryId: number,
        amount: string,
        description: string,
        transactionDate: string,
        isPaid: boolean
    }
}) {
    const router = useRouter()
    const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
        const result = await updateTransaction({
            id: transaction.id,
            amount: data.amount.toString(),
            description: data.description,
            categoryId: data.categoryId,
            transactionDate: format(data.transactionDate, "yyyy-MM-dd" ) 
        })
        if (result?.error) {
            toast.error("Error.", {
                description: result.message,
            })
        } else {
            toast.success("Sucess!", {
                description: "Transaction updated"
            })
        }
        router.push(`/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}
        &year=${data.transactionDate.getFullYear()}`)
    }

    return (
        <TransactionForm defaultValues={{
            amount: Number(transaction.amount),
            categoryId: transaction.categoryId,
            description: transaction.description,
            transactionDate: new Date(transaction.transactionDate),
            transactionType: categories.find(category => category.id === transaction.categoryId)?.type ?? "income",
            isPaid: transaction.isPaid
        }} onSubmit={handleSubmit} categories={categories} />
    )
}