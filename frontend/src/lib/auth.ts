import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins"

export const auth = betterAuth({
    database: {
        provider: "postgres",
        url: process.env.DATABASE_URL, 
    },
    emailAndPassword: {
        enabled: true,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    plugins: [
        openAPI()
    ]
});