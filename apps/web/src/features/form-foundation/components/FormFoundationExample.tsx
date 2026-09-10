"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/ui/components";
import { Textarea } from "@repo/ui/forms";
import { useForm } from "react-hook-form";
import {
  type FormFoundationValues,
  formFoundationSchema,
} from "../schemas/form-foundation.schema";

/**
 * FormFoundationExample - Reference implementation of the form foundation.
 *
 * Demonstrates React Hook Form + Zod + @repo/ui form primitives.
 * Series 3.6.1 verifies valid values locally; BFF submission arrives
 * in a later series.
 */
export function FormFoundationExample() {
  const form = useForm<FormFoundationValues>({
    resolver: zodResolver(formFoundationSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(_values: FormFoundationValues) {
    // Values are validated against formFoundationSchema at this point.
    // The BFF call will be introduced by the form system series.
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" autoComplete="name" {...field} />
              </FormControl>
              <FormDescription>Between 2 and 100 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Used only to reply to your message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help?" rows={5} {...field} />
              </FormControl>
              <FormDescription>Between 10 and 1000 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        {form.formState.isSubmitSuccessful && (
          <output className="block text-sm text-green-600 dark:text-green-400">
            Valid values confirmed locally. BFF submission will be added in a
            later series.
          </output>
        )}
      </form>
    </Form>
  );
}
