import {z, ZodEnum, ZodTypeAny} from "zod";

const passwordRegex = /^[a-zA-Z0-9]+$/; // At least 6 characters, at least one letter and one number
export const PasswordSchema = z
    .string()
    .min(6, {
        message: "Input.error_password_min",
    })
    .max(40, {
        message: "Input.error_password_max",
    })
    .regex(passwordRegex, {
        message: "Input.error_password_format",
    });


export const QueyParamsSchema = z
    .object({
        pageRequest: z.object({
            page: z.number(),
            size: z.number(),
            sortBy: z.string(),
            sortDirection: z.string(),
        }),
        ids: z.array(z.number()).optional(),
    })
    .catchall(z.any())
    .partial()
    .optional();

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        data: dataSchema,
        totalInstances: z.number().optional(),
        currentPage: z.number().optional(),
        totalPages: z.number().optional(),
    });

export const DateSchema = z
    .preprocess((val) => {
        if (typeof val === "string" || val instanceof String) {
            return new Date(val as string);
        }
        return val;
    }, z.date())
    .transform((date) => {
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
    });

export const DatetimeSchema = z.string().transform((value) => {
    const date = new Date(value);
    return date.toLocaleString();
});


export const ApiDatetimeSchema = z.string().transform((value) => {
    const date = new Date(value);
    return date.toISOString();
})

const hasWindow = typeof window !== 'undefined' && window !== null


export const ImageSchema = (requiredMessage?: string) => {
    if (requiredMessage) {
        return hasWindow ? z
            .instanceof(File)
            .nullable()
            .refine((val) => val instanceof File, {
                message: requiredMessage,
            }) : z.any();
    }

    return hasWindow ? z.instanceof(File).nullable() : z.any();
};
export const ArrayIndexSchema = z.number().gte(0, {message: "invalid action"})

export function makeNullable<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
    return z.object(
        Object.fromEntries(
            Object.entries(schema.shape).map(([k, v]) => [k, v.nullable()])
        ) as { [K in keyof T]: z.ZodNullable<T[K]> }
    );
}

export function zStrDefault(def: string) {
    return z.union([z.string(), z.null(), z.undefined()]).transform((v) => v ?? def)
}

export function zNumDefault(def: number) {
    return z.union([z.number(), z.null(), z.undefined()]).transform((v) => v ?? def);
}

export const zBoolDefault = (def: boolean = false) =>
    z.union([z.boolean(), z.null(), z.undefined()]).transform((v) => v ?? def);
export const zEnumDefault = <T extends ZodEnum<[string, ...string[]]>>(
    enumSchema: T,
    def: z.infer<T>
) =>
    z.union([enumSchema, z.null(), z.undefined()]).transform((v) => v ?? def);

export function zArrayDefault<T extends ZodTypeAny>(schema: T, def: z.infer<T>[]) {
    return z.union([z.array(schema), z.null(), z.undefined()]).transform((v) => v ?? def);
}
export function zNullableDefault<T extends ZodTypeAny>(schema: T) {
    return z.union([schema, z.null(), z.undefined()]).transform((v) => v ?? null);
}
