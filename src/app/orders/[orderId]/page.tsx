import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function OrderDetails({
  params,
}: PageProps<"/orders/[orderId]">) {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen bg-[#151515]"
          role="status"
          aria-label="Loading order"
        />
      }
    >
      {params.then(({ orderId }) => (
        <Dashboard page="order" orderId={orderId} />
      ))}
    </Suspense>
  );
}
