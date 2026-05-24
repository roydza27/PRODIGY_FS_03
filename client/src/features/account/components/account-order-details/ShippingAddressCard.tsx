import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { ShippingAddress } from "../../types/order.types";

type Props = {
  address: ShippingAddress;
};

export default function ShippingAddressCard({ address }: Props) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
        <div>
          <p className="text-zinc-500">Full Name</p>
          <p>{address.fullName}</p>
        </div>
        <div>
          <p className="text-zinc-500">Email</p>
          <p>{address.email}</p>
        </div>
        <div>
          <p className="text-zinc-500">Phone</p>
          <p>{address.phone}</p>
        </div>
        <div>
          <p className="text-zinc-500">Country</p>
          <p>{address.country}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-zinc-500">Address</p>
          <p>{address.address}</p>
        </div>
        <div>
          <p className="text-zinc-500">City</p>
          <p>{address.city}</p>
        </div>
        <div>
          <p className="text-zinc-500">State</p>
          <p>{address.state}</p>
        </div>
        <div>
          <p className="text-zinc-500">Postal Code</p>
          <p>{address.postalCode}</p>
        </div>
      </CardContent>
    </Card>
  );
}