import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/context/use-cart";
import { checkoutService, type CheckoutStatusResponse } from "@/features/cart/services/checkout-service";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CheckCircle, CircleAlert, Clock, XCircle } from "lucide-react";
import { useEffect } from "react";

interface StatusContentProps {
  status: CheckoutStatusResponse["status"];
  orderNumber: string;
}

function StatusContent({ status, orderNumber }: Readonly<StatusContentProps>) {
  if (status === "PAID") {
    return (
      <>
        <CheckCircle className="w-16 h-16" />
        <h1 className="text-2xl font-semibold">Payment confirmed!</h1>
        <p className="text-muted-foreground  max-w-120">
          Your order <span className="font-mono font-medium text-foreground">{orderNumber}</span> has been paid
          successfully. Thank you for your purchase.
        </p>
      </>
    );
  }

  if (status === "PENDING_PAYMENT") {
    return (
      <>
        <Clock className="w-16 h-16 " />
        <h1 className="text-2xl font-semibold">Payment pending</h1>
        <p className="text-muted-foreground max-w-120">
          Order <span className="font-mono font-medium text-foreground">{orderNumber}</span> is still being processed.
          Please check back in a moment.
        </p>
      </>
    );
  }

  if (status === "PAYMENT_FAILED") {
    return (
      <>
        <XCircle className="w-16 h-16 " />
        <h1 className="text-2xl font-semibold">Payment failed</h1>
        <p className="text-muted-foreground max-w-120">
          There has been a problem with your order. The payment was not successful. Please contact support if you have
          any questions regarding this issue. Your order number was{" "}
          <span className="font-mono font-medium text-foreground">{orderNumber}</span>.
        </p>
      </>
    );
  }

  if (status === "CANCELLED") {
    return (
      <>
        <XCircle className="w-16 h-16 " />
        <h1 className="text-2xl font-semibold">Order cancelled</h1>
        <p className="text-muted-foreground max-w-120">
          There has been a problem with your order. The payment was cancelled. Please contact support if you have any
          questions regarding this issue. Your order number was{" "}
          <span className="font-mono font-medium text-foreground">{orderNumber}</span>.
        </p>
      </>
    );
  }

  if (status === "REFUNDED") {
    return (
      <>
        <CircleAlert className="w-16 h-16 " />
        <h1 className="text-2xl font-semibold">Order refunded</h1>
        <p className="text-muted-foreground max-w-120">
          There has been a problem with your order. The payment was refunded. Please contact support if you have any
          questions regarding this issue. Your order number was{" "}
          <span className="font-mono font-medium text-foreground">{orderNumber}</span>.
        </p>
      </>
    );
  }

  return null;
}

interface CheckoutSuccessProps {
  sessionId: string;
}

export function CheckoutSuccess({ sessionId }: Readonly<CheckoutSuccessProps>) {
  const { clearCart } = useCart();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["checkout", "session", sessionId],
    queryFn: () => checkoutService.getSessionStatus(sessionId),
    retry: 2,
  });

  useEffect(() => {
    if (data?.status === "PAID") clearCart();
  }, [data?.status, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-4">
      {isLoading && (
        <>
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
          <div className="h-7 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse" />
        </>
      )}

      {isError && <ErrorDisplay />}

      {data && <StatusContent status={data.status} orderNumber={data.orderNumber} />}

      {(data || isError) && (
        <Button asChild className="mt-2">
          <Link to="/">Back to shop</Link>
        </Button>
      )}
    </div>
  );
}
