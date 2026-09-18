import Link from "next/link";
import Center from "@/components/Center";

export const metadata = {
  title: "Account",
  description: "Your orders and account details",
};

export default function AccountPage() {
  return (
    <Center>
      <div className="py-12 text-center">
        <h1 className="text-2xl font-semibold mb-2">Account</h1>
        <p className="mb-6">
          Customer accounts are not available yet. You can check out as a guest —
          your receipt is emailed to you once payment completes.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-700 text-white rounded-lg px-5 py-2.5 hover:bg-blue-800"
        >
          Browse products
        </Link>
      </div>
    </Center>
  );
}
