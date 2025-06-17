import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRecentTransactions } from "@/data/getRecentTransactions";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export async function RecentTransactions() {
    const transactions = await getRecentTransactions()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <span>
                        Recent Transactions
                    </span>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/dashboard/transactions">
                                View all
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/dashboard/transactions/new">
                                Create new
                            </Link>
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!transactions?.length && (
                    <p className="text-center py-10 text-lg text-muted-foreground">
                        You heave no transactions yet. Start by hitting Create New to
                        create your first Transaction.
                    </p>
                )}

                {!!transactions?.length &&
                    <Table className="mt-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Paid/Received</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {transactions.map((transaction) =>
                                <TableRow key={transaction.id}>
                                    <TableCell >
                                        {format(transaction.transactionDate, "do MMM yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.description}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.category}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <Badge
                                            className={transaction.transactionType === 'income'
                                                ? 'bg-lime-600'
                                                : 'bg-orange-500'}
                                        >
                                            {transaction.transactionType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <Badge
                                            className={transaction.isPaid === true
                                                && transaction.transactionType === 'income'
                                                ? 'bg-lime-600'
                                                : 'bg-orange-500'}
                                        >
                                            {
                                                transaction.isPaid === true
                                                ? (transaction.transactionType === 'income' ? <span>Received</span> : <span>Paid</span>)
                                                : (transaction.transactionType === 'income' ? <span>Not Received</span> : <span>Not Paid</span>)
                                            }
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        €{numeral(transaction.amount).format('€0,0.00')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="icon" aria-label="Edit transaction">
                                            <Link href={`/dashboard/transactions/${transaction.id}`}>
                                                <PencilIcon />
                                            </Link>
                                        </Button>

                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                }
            </CardContent>
        </Card>
    )
}