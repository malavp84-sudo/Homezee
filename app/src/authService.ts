// Auth backend adapter. Currently a MOCK (any valid number, OTP is always 123456).
// To go live, replace the bodies with Supabase:
//   sendOtp   -> supabase.auth.signInWithOtp({ phone: '+91' + phone })
//   verifyOtp -> supabase.auth.verifyOtp({ phone: '+91' + phone, token: code, type: 'sms' })

export const MOCK_OTP = '123456';

export async function sendOtp(phone: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));
  if (!/^[6-9]\d{9}$/.test(phone)) throw new Error('Enter a valid 10-digit mobile number');
}

export async function verifyOtp(phone: string, code: string): Promise<{ phone: string }> {
  await new Promise((r) => setTimeout(r, 600));
  if (code !== MOCK_OTP) throw new Error('Wrong code. Please try again.');
  return { phone };
}
