// Crie este novo arquivo, por exemplo: app/dashboard/transactions/transaction-paid-button.tsx
"use client";

import { updatePaidTransaction } from "@/app/dashboard/transactions/actions";
import { Button } from "@/components/ui/button";
import { BanknoteArrowUp } from "lucide-react";
import { useTransition } from "react"; // Importe a Server Action

export function TransactionPaidButton({ transactionId }: { transactionId: number }) {
  const [isPending, startTransition] = useTransition();

  // A função de clique é definida AQUI, dentro do Client Component
  const handleClick = () => {
    startTransition(() => {
      // Chama a Server Action, passando o ID
      updatePaidTransaction(transactionId);
    });
  };

  return (
    <Button
      onClick={handleClick} // Passa a referência da função
      disabled={isPending}
      variant="outline"
      size="default"
      aria-label="Mark transaction as paid"
    >
      <BanknoteArrowUp />
    </Button>
  );
}