import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one digit").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    passwordConfirm: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one digit").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    username: z.string(),
}).superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords do not match',
            path: ['passwordConfirm'],
        });
    }
});


export type LoginSchema = typeof loginSchema;
export type RegisterSchema = typeof registerSchema;