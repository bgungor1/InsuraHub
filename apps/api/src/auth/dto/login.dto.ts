import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
    @IsNotEmpty({ message: 'E-posta alanı boş bırakılamaz' })
    email!: string;

    @IsString({ message: 'Şifre metin formatında olmalıdır' })
    @IsNotEmpty({ message: 'Şifre alanı boş bırakılamaz' })
    password!: string;
}