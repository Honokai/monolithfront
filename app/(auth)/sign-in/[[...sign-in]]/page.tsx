"use client";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { axiosClient } from "@/lib/axios-client";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, {
    message: "Password must be at least 10 characters.",
  })
})

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isVisible, setVisible] = useState(false);

  function onSubmit(data: z.infer<typeof formSchema>) {
    axiosClient.post("/auth/login", data).then(response => console.log(response.data))
      .catch(e => console.log(e))
  }

  return (
    <main className="flex justify-center items-center h-4/5">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form action={"/sign-in"} onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    defaultValue=""
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <>
                            <Input type="email" id="email" placeholder="" {...field} />
                            {form.formState.errors.email && (
                              <Alert variant="destructive">
                                <AlertDescription>
                                  {form.formState.errors.email.message}
                                </AlertDescription>
                              </Alert>
                            )}
                          </>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    defaultValue=""
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <>
                            <div className="relative flex [&>svg]:mr-2">
                              <Input type={`${isVisible ? "text" : "password"}`} id="password" {...field}/>
                              {isVisible ? (
                                <EyeOffIcon onClick={() => setVisible(!isVisible)} className="absolute inset-y-2 right-0  cursor-pointer flex items-center p-1 text-lg leading-1"/>
                              ) : (
                                <EyeIcon onClick={() => setVisible(!isVisible)} className="absolute inset-y-2 right-0  cursor-pointer flex items-center p-1 text-lg leading-1"/>
                              )}
                              
                            </div>
                            {form.formState.errors.password && (
                              <Alert variant="destructive">
                                <AlertDescription>
                                  {form.formState.errors.password.message}
                                </AlertDescription>
                              </Alert>
                              )}
                          </>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="mb-4">
                <Link className="text-sm hover:text-primary/60 transition ease-linear duration-100" href={"/sign-up"}>Doesn't have an account? Sign up here.</Link>
              </div>
              <div className="flex w-full justify-center">
                <Button type="submit">Sign up now</Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  )
}