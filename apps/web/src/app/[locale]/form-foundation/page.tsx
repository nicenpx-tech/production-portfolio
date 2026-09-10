import { FormFoundationExample } from "@/features/form-foundation";

export default function FormFoundationPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Form Foundation</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Verification route for the shared form primitives.
        </p>
        <div className="mt-8">
          <FormFoundationExample />
        </div>
      </div>
    </main>
  );
}
