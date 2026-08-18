import * as z from 'zod';
import type { UserRole } from '../types/user.types';

export const USER_ROLES: { label: string; value: UserRole }[] = [
  { label: 'Sistem Yöneticisi (Superadmin)', value: 'SUPERADMIN' },
  { label: 'Şirket Yetkilisi', value: 'COMPANY_USER' },
  { label: 'Acente Müdürü', value: 'AGENCY_MANAGER' },
  { label: 'Şube Müdürü', value: 'BRANCH_MANAGER' },
  { label: 'Broker (Satış Temsilcisi)', value: 'BROKER' },
];

export const userFormSchema = z
  .object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    role: z.enum(['SUPERADMIN', 'COMPANY_USER', 'AGENCY_MANAGER', 'BRANCH_MANAGER', 'BROKER']),
    companyId: z.string().optional(),
    agencyId: z.string().optional(),
    branchId: z.string().optional(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'COMPANY_USER' && !data.companyId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Şirket seçimi zorunludur',
        path: ['companyId'],
      });
    }
    if (data.role === 'AGENCY_MANAGER' && !data.agencyId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Acente seçimi zorunludur',
        path: ['agencyId'],
      });
    }
    if ((data.role === 'BRANCH_MANAGER' || data.role === 'BROKER') && !data.branchId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Şube seçimi zorunludur',
        path: ['branchId'],
      });
    }
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
