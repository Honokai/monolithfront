"use client";

import { Button } from "@/components/ui/button"
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { axiosClient } from "@/lib/axios-client";

const formSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters."),
  email: z.string().email(),
  password: z.string().min(10, {
    message: "Password must be at least 10 characters.",
  }),
  password_confirmation: z.string().min(10, {
    message: "Password must be at least 10 characters.",
  })
}).superRefine((val, ctx) => {
  if (val.password_confirmation != val.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Fields must match with password.",
      path: ["password_confirmation"]
    })
  }
})

export default function Page()
{
  const [isVisible, setVisible] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    axiosClient.post("auth/register", data).catch(e => console.log(e)).then(e  => {console.log(e)})
  }

  return (
    <main className="flex justify-center items-center h-4/5">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form action={"/sign-in"} onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    defaultValue=""
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User name</FormLabel>
                        <FormControl>
                          <>
                            <Input id="username" placeholder="" {...field} />
                            {form.formState.errors.username && (
                              <Alert variant="destructive">
                              <AlertDescription className="text-sm">
                                {form.formState.errors.username.message}
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <>
                            <Input id="email" type="email" placeholder="" {...field} />
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
                              <Input type={`${isVisible ? "text" : "password"}`} {...field} id="password"/>
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
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    defaultValue=""
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password confirmation</FormLabel>
                        <FormControl>
                          <>
                            <div className="relative flex [&>svg]:mr-2">
                              <Input type={`${isVisible ? "text" : "password"}`} {...field} id="password_confirmation"/>
                              {isVisible ? (
                                <EyeOffIcon onClick={() => setVisible(!isVisible)} className="absolute inset-y-2 right-0  cursor-pointer flex items-center p-1 text-lg leading-1"/>
                              ) : (
                                <EyeIcon onClick={() => setVisible(!isVisible)} className="absolute inset-y-2 right-0  cursor-pointer flex items-center p-1 text-lg leading-1"/>
                              )}
                              
                            </div>
                            {form.formState.errors.password_confirmation && (
                              <Alert variant="destructive">
                                <AlertDescription>
                                  {form.formState.errors.password_confirmation.message}
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
                <Link className="text-sm hover:text-primary/60 transition ease-linear duration-100" href={"/sign-in"}>Already have an account? Sign in here.</Link>
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