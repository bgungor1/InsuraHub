'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

import { useLoginMutation, DemoCredentialsCard } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir kurumsal e-posta adresi giriniz.'),
  password: z.string().min(6, 'Şifreniz en az 6 karakter olmalıdır.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setErrorMessage(null);
      await loginMutation.mutateAsync(values);
      router.push(redirectPath);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Giriş yapılamadı. Bilgilerinizi kontrol edin.';
      setErrorMessage(message);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xl backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Shield className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          InsuraHub
        </CardTitle>
        <CardDescription>
          Kurumsal sigorta ve acente yönetim sistemine giriş yapın
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ad.soyad@insurahub.com"
                      autoComplete="email"
                      disabled={loginMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-semibold"
              size="lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>
          </form>
        </Form>

        <DemoCredentialsCard />
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-radial-[at_top_center] from-muted/50 to-background p-4">
      <React.Suspense
        fallback={<Loader2 className="size-8 animate-spin text-primary" />}
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
