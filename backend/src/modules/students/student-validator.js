const { z } = require('zod');
const { ApiError } = require("../../utils");

const validateAgeRange = (minAge, maxAge) => {
  return (dateString) => {
    if (!dateString) return true;

    const birthDate = new Date(dateString);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return false;

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();


    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge && age <= maxAge;
  };
};
const studentSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z.string()
    .email("Invalid email format"),

  age: z.number()
    .int()
    .min(5, "Student must be at least 5 years old")
    .max(100)
    .optional(),

  role_id: z.number().default(3),

  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: "Gender must be male, female, or other" })
  }).optional(),

  systemAccess: z.boolean().default(true),

  dob: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(validateAgeRange(5, 120), {
      message: "Student must be between 5 and 120 years old"
    })

    .optional(),
});

const throwformatZodError = (result) => {
  const formattedErrors = result.error.flatten().fieldErrors;
  const errorMessage = Object.keys(
    formattedErrors).map(field => {
      return `${field}: ${formattedErrors[field][0]}`
    });
  throw new ApiError(400, `Validation failed: ${errorMessage}`)
}


const validateNewStudent = (data) => {
  const result = studentSchema.safeParse(data);

  if (!result.success) throwformatZodError(result);
  return true;

};

const validateUpdateStudent = (data) => {
  const result = studentSchema.partial().safeParse(data);
  if (!result.success) throwformatZodError(result);
  return true;

};



module.exports = {
  validateNewStudent,
  validateUpdateStudent
};