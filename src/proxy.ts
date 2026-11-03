import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

// Next.js-এর লেটেস্ট নিয়ম অনুযায়ী 'proxy' ফাংশনটি এক্সপোর্ট করতে হবে
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user

    // যদি ইউজার লগইন করা না থাকে, তবে তাকে /login পেজে পাঠিয়ে দিন
    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // ইউজার লগইন করা থাকলে তাকে তার কাঙ্ক্ষিত পেজে (যেমন: /my-booking) যেতে দিন
    return NextResponse.next()
}

export const config = {
    matcher: ['/my-booking','/explore/:path*','/add-studio','/myprofile'],
}