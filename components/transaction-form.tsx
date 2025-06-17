"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from './ui/select'
import { Popover, PopoverContent } from './ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { type Category } from '@/types/Category'

export const transactionFormSchema = z.object({
    transactionType: z.enum(['income', 'expenses']),
    categoryId: z.coerce.number().positive("Please select a category"),
    transactionDate: z
        .coerce
        .date()
        .max(addDays(new Date(), 100), "Transaction cannot be in the future."),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    description: z
        .string()
        .min(3, "Description must contain at least 3 caracters")
        .max(300, "Description must contain a maximum of 300 caracters"),
    isPaid: z.boolean()
})

type Props = {
    categories: Category[]
    onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>
    defaultValues?: {
        transactionType: "income" | "expenses",
        amount: number,
        categoryId: number,
        description: string,
        transactionDate: Date,
        isPaid: boolean,
    }
}

export default function TransactionForm({ categories, onSubmit, defaultValues }: Props) {
    const form = useForm<z.infer<typeof transactionFormSchema>>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            amount: 0,
            categoryId: 0,
            description: "",
            transactionDate: new Date(),
            transactionType: "income",
            isPaid: true,
            ...defaultValues
        },
    })

    const transactionType = form.watch("transactionType")

    const filteredCategories = categories.filter(
        (category) => category.type === transactionType
    )


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <fieldset
                        disabled={form.formState.isSubmitting}
                        className='pb-5 grid grid-cols-2 gap-y-5 gap-x-2 items-baseline'
                    >
                        <FormField control={form.control} name='transactionType' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Transaction Type:
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(newValue) => {
                                            field.onChange(newValue)
                                            form.setValue("categoryId", 0)
                                        }}
                                            value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="income">
                                                    Income
                                                </SelectItem>
                                                <SelectItem value='expenses'>
                                                    Expenses
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />
                        <FormField control={form.control} name='isPaid' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Is paid?
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                        disabled={transactionType === 'income'}
                                            value={String(field.value)}
                                            onValueChange={(value) => {
                                                field.onChange(value === 'true');
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">
                                                    Yes
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    No
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />
                        <FormField control={form.control} name='categoryId' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Category Type:
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value.toString()}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredCategories.map(category => (
                                                    <SelectItem value={category.id.toString()} key={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />
                        <FormField control={form.control} name='transactionDate' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Transaction Date:
                                    </FormLabel>
                                    <FormControl>
                                        <Popover >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                // disabled={{
                                                //     after: new Date()
                                                // }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />

                        <FormField control={form.control} name='amount' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Amount:
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='€' {...field} type='number' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />
                    </fieldset>
                    <fieldset
                        disabled={form.formState.isSubmitting}
                        className='flex flex-col gap-5'>
                        <FormField control={form.control} name='description' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Description:
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />

                        <Button type='submit'>
                            Submit
                        </Button>
                    </fieldset>
                </form>
            </Form>
        </div>
    )
}

