import { FormFieldsExample } from "@/features/form-fields";

export default function FormFieldsPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Form Fields</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Verification route for the field primitives and controlled
          component patterns.
        </p>
        <div className="mt-8">
          <FormFieldsExample />
        </div>
      </div>
    </main>
  );
}
