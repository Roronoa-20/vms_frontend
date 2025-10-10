import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

// ------------------- Contexts -------------------

type FormFieldContextValue = {
  name: string
} | null

const FormFieldContext = React.createContext<FormFieldContextValue>(null)

type FormItemContextValue = {
  id: string
} | null

const FormItemContext = React.createContext<FormItemContextValue>(null)

// ------------------- Components -------------------

const FormField = ({ name, control, ...props }: any) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} control={control} {...props} />
    </FormFieldContext.Provider>
  )
}

// ------------------- Hooks -------------------

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField must be used within a <FormField>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const id = itemContext?.id

  return {
    id,
    name: fieldContext.name,
    formItemId: id ? `${id}-form-item` : undefined,
    formDescriptionId: id ? `${id}-form-item-description` : undefined,
    formMessageId: id ? `${id}-form-item-message` : undefined,
    ...fieldState,
  }
}

// ------------------- Layout -------------------

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

// ------------------- Label -------------------

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

// ------------------- Control -------------------

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  const describedBy = error
    ? `${formDescriptionId} ${formMessageId}`
    : formDescriptionId

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={describedBy?.trim()}
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

// ------------------- Description -------------------

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

// ------------------- Message -------------------

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) return null

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

// ------------------- Export -------------------

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
