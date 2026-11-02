import { ContactForm } from "@/features/contact";

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Contact</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Verification route for advanced form patterns: a field array of
          contact methods, a conditional field per contact type, and a region
          that depends on the chosen country.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
