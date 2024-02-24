'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('please confirm your email')) {
        return 'Please confirm your email';
      } else if (errorMessage.includes('invalid credentials')) {
        return 'Invalid credentials';
      } else if (errorMessage.includes('user not found')) {
        return 'User not found';
      } else {
        return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const registerUser = async (
  email: string,
  password: string,
): Promise<string> => {
  try {
    const response = await fetch('http://localhost:9000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        isCompany: false,
      }),
    });

    if (response.ok) {
      return 'success';
    } else {
      const errorData = await response.json();
      const errorMessage = errorData?.error || 'Registration failed';
      console.error(errorMessage);
      return errorMessage;
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return 'error';
  }
};

export const confirmEmail = async (
  email: string,
  token: string,
): Promise<boolean> => {
  try {
    const url = `http://localhost:9000/api/v1/auth/confirm-email?email=${encodeURIComponent(
      email,
    )}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error during email confirmation:', error);
    return false; // Confirmation failed due to an error
  }
};
export const resentConfirmationEmail = async (email: string) => {
  try {
    // Make the resend email request to the server using fetch
    const response = await fetch(
      `http://localhost:9000/api/v1/auth/resend-confirmation-email?email=${encodeURIComponent(
        email,
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Parse the response JSON
    const data = await response.json();

    // Check if the request was successful
    if (data.success) {
      console.log(data.success);
      // Show an alert for successful resend
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error during resend email request:', error);
    // Show an alert for unexpected errors
    alert('An unexpected error occurred. Please try again.');
  }
};
