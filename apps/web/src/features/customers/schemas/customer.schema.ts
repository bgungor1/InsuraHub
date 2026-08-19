import * as z from 'zod';

export const createCustomerSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır.'),
  identityNo: z
    .string()
    .min(10, 'Kimlik/Vergi no en az 10 hane olmalıdır.')
    .max(11, 'Kimlik/Vergi no en fazla 11 hane olabilir.')
    .regex(/^[0-9]+$/, 'Sadece rakam içermelidir.'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz.').optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerSchema>;
