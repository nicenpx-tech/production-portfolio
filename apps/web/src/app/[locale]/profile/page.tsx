import { ProfileForm } from "@/features/profile";

export default function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Verification route for composed forms: shared form setup, transformed
          values, and form-level submission errors.
        </p>
        <div className="mt-8">
          <ProfileForm />
        </div>
      </div>
    </main>
  );
}
