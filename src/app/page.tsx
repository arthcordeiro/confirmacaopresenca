'use client'; // This directive is essential for client components in the App Router

import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useEffect } from "react"; // Import useEffect for side effects

export default function Home() {
  const router = useRouter(); // Initialize the router hook

  useEffect(() => {
    // This effect runs once after the component mounts
    router.push("/confirmacao"); // Redirect to the desired path
  }, [router]); // Dependency array: the effect re-runs if 'router' changes (it's stable, so it's fine)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Redirecting...
    </div>
  );
}