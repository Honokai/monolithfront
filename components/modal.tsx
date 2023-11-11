import moment from "moment";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Form, UseFormReturn } from "react-hook-form";
import { CardContent, CardFooter } from "./ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import Link from "next/link";
import { Button } from "./ui/button";
import { Ticket } from "@/lib/types";
import { z } from "zod";

interface ModalProps<TData> {
  form: UseFormReturn
  isOpen: boolean
  setOpen: (state: boolean) => void
  ticket: Ticket
  onSubmit: (x) => void
}

export default function Modal({isOpen, setOpen, form, ticket, onSubmit}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="md:w-screen max-w-screen-lg">
            {ticket ? (
              <>
                <DialogHeader>
                  <DialogTitle># {ticket.ticket_id}</DialogTitle>
                </DialogHeader>
                  <div className="flex">
                    <div className="flex-1 p-2 [&>*:not(first-child)]:mt-1">
                      <div className="flex flex-col [&>*]:my-1">
                        <Label className="font-bold">Requester</Label>
                        <Label>{ticket.requester}</Label>
                      </div>
                      <div className="flex flex-col [&>*]:my-1">
                        <Label className="font-bold">Category</Label>
                        <Label>{ticket.subcategory.name}</Label>
                      </div>
                      <div className="flex flex-col [&>*]:my-1">
                        <Label className="font-bold">Created at</Label>
                        <Label>{moment.utc(ticket.created_at).format("DD/MM/YYYY HH:mm:ss")}</Label>
                      </div>
                    </div>
                    <div className="flex-[2]">
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
                                      <FormLabel>Requester</FormLabel>
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
                                            <Input id="password" {...field}/>
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
                    </div>
                  </div>
              </>
            ) : (
              <div role="status" className="p-10 text-center">
                    <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            
          
        </DialogContent>
      </Dialog>    
  )
}