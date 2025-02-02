import { resend } from "@/app/lib/resend";
import VerificationEmail from "../../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function SendVerificationEmail(
  email: string,
  username: string,
  VerifyCode: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'MystyMsg Verification Code',
            react:VerificationEmail({username,otp:VerifyCode}),
          });

        return {success:true,message:'Verification email Send Successfully'}
    } catch (emailError) {
        console.log('Error in Email Verification ',emailError)
        return {success:false,message:'Failed to Send Verificaton email'}
    }
}
