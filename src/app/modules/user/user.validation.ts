import {z} from "zod";

// Validation schema for creating a customer 
const createCustomerValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long" ),
  
  email: z
    .email( "Invalid email address"),
  
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long" ),
  
  phone: z
    .string()
    .min(10,  "Phone number must be at least 10 digits" ),
  
  address: z
    .string()
    .min(5,  "Address must be at least 5 characters long" ),
});

export const UserValidation = {
  createCustomerValidationSchema
};

