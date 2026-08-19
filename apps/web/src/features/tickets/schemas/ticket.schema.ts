import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(3, 'Konu başlığı en az 3 karakter olmalıdır.'),
  category: z.enum([
    'POLICY_ISSUE',
    'COMMISSION_INQUIRY',
    'TECHNICAL_SUPPORT',
    'GENERAL_REQUEST',
  ], {
    message: 'Lütfen geçerli bir destek kategorisi seçin.',
  }),
  message: z.string().min(5, 'Mesajınız en az 5 karakter olmalıdır.'),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const addTicketMessageSchema = z.object({
  body: z.string().min(2, 'Mesajınız en az 2 karakter olmalıdır.'),
});

export type AddTicketMessageFormValues = z.infer<typeof addTicketMessageSchema>;
