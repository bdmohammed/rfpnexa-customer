"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { getErrorMessage, getValidationErrors } from "@/lib/errors";
import { useCountries } from "@/features/country/api/queries";
import CountryDropdown from "@/components/auth/CountryDropdown";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Name must be at least 2 characters" })
      .max(120, { error: "Name must not exceed 120 characters" }),

    email: z
      .email({ error: "Please enter a valid email address" })
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .trim()
      .min(8, { error: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        error: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        error: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        error: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        error: "Password must contain at least one special character",
      }),

    confirmPassword: z.string(),

    companyName: z
      .string()
      .trim()
      .min(2, { error: "Company name must be at least 2 characters" })
      .max(160, { error: "Company name must not exceed 160 characters" }),

    country: z
      .string()
      .trim()
      .min(1, { error: "Country is required" })
      .max(100, { error: "Country name must not exceed 100 characters" }),

    secondary_website: z.string().optional(), // Honeypot field

    terms: z.literal(true, {
      error: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register: registerUser,
    isRegistering,
    user,
    isAuthenticated,
  } = useAuth();
  const { data: countries } = useCountries();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user || isAuthenticated) {
      router.replace("/");
    }
  }, [user, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitted, dirtyFields, touchedFields },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      country: "",
      secondary_website: "",
      terms: undefined,
    },
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });

  const onSubmit = async (data: RegisterFormValues) => {
    // Honeypot check
    if (data.secondary_website) {
      console.warn("Spam detected via honeypot");
      return;
    }

    try {
      // Strip confirmPassword, secondary_website, and terms before sending
      const { confirmPassword, secondary_website, terms, ...payload } = data;

      const selectedCountry = countries?.find(
        (c) => c.name.toLowerCase() === payload.country.toLowerCase(),
      );
      const countryId = selectedCountry
        ? String(selectedCountry.id)
        : "";

      await registerUser({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        companyName: payload.companyName,
        country: payload.country,
        countryId,
      });

      router.replace('/login');
    } catch (err: any) {
      const backendErrors = getValidationErrors(err);
      if (backendErrors) {
        backendErrors.forEach((e: { field: string; message: string }) => {
          const fieldName = e.field === "countryId" ? "country" : e.field;
          setError(fieldName as any, { type: "manual", message: e.message });
        });
      } else {
        const msg = getErrorMessage(err) || "Failed to register account.";
        setError("root", { type: "manual", message: msg });
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-linear-to-b from-[var(--background)] to-[var(--surface-secondary)]">
      <div className="w-full max-w-2xl p-8 bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#003EC7] opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#003EC7] opacity-10 blur-3xl rounded-full"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Get access to federal, state, and local government tenders
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-500 rounded-lg text-sm text-center">
            {successMsg}
          </div>
        )}

        {errors.root && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-xs font-medium flex items-center gap-2 justify-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.root.message}</span>
          </div>
        )}

        {!successMsg && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 relative z-10"
            noValidate
          >
            {/* Honeypot field */}
            <div
              className="absolute opacity-0 h-0 w-0 overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="secondary_website">Secondary Website</label>
              <input
                id="secondary_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("secondary_website")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg bg-[var(--surface-secondary)] border text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-hidden focus:ring-2 focus:ring-[#003EC7] focus:border-transparent transition-all ${
                    errors.name ? "border-red-500" : "border-[var(--border)]"
                  }`}
                  placeholder="John Doe"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 rounded-lg bg-[var(--surface-secondary)] border text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-hidden focus:ring-2 focus:ring-[#003EC7] focus:border-transparent transition-all ${
                    errors.email ? "border-red-500" : "border-[var(--border)]"
                  }`}
                  placeholder="name@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg bg-[var(--surface-secondary)] border text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-hidden focus:ring-2 focus:ring-[#003EC7] focus:border-transparent transition-all ${
                    errors.companyName
                      ? "border-red-500"
                      : "border-[var(--border)]"
                  }`}
                  placeholder="Acme Corp"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.companyName.message}
                  </span>
                )}
              </div>

              <div>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <CountryDropdown
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.country?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-4 pr-11 py-3 rounded-lg bg-[var(--surface-secondary)] border text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-hidden focus:ring-2 focus:ring-[#003EC7] focus:border-transparent transition-all ${
                      errors.password
                        ? "border-red-500"
                        : "border-[var(--border)]"
                    }`}
                    placeholder="Enter Password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors focus:outline-hidden cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full pl-4 pr-11 py-3 rounded-lg bg-[var(--surface-secondary)] border text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-hidden focus:ring-2 focus:ring-[#003EC7] focus:border-transparent transition-all ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-[var(--border)]"
                    }`}
                    placeholder="Enter Confirm Password"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors focus:outline-hidden cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <PasswordChecklist
              password={password}
              isTouched={touchedFields.password}
              isDirty={dirtyFields.password}
              isSubmitted={isSubmitted}
            />

            <div className="flex flex-col mt-2">
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border-[var(--border)] bg-[var(--surface-secondary)] text-[#003EC7] focus:ring-[#003EC7] mt-0.5 cursor-pointer"
                  {...register("terms")}
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-xs text-[var(--muted)]"
                >
                  I agree to the{" "}
                  <a href="#" className="text-[#003EC7] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#003EC7] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {errors.terms && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.terms.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3.5 px-4 bg-[#003EC7] hover:bg-[#002fad] text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRegistering ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-[var(--muted)] relative z-10">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#003EC7] hover:underline"
          >
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
