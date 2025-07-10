import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token);
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
    }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Vui lòng nhập tên đăng nhập và mật khẩu");
                }

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    })
                    
                    if (!response.ok) {
                        let errorMessage = "Thông tin đăng nhập không hợp lệ";
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorData.error || errorMessage;
                        } catch (e) {
                            errorMessage = response.statusText || errorMessage;
                        }
                        throw new Error(errorMessage);
                    }

                    const data = await response.json();
                    
                    let accessToken, userData;
                    
                    if (data.access_token) {
                        accessToken = data.access_token;
                        userData = data.user || {};
                    } else if (data.data?.access_token) {
                        accessToken = data.data.access_token;
                        userData = data.data.user || {};
                    } else {
                        throw new Error("Không tìm thấy access token trong phản hồi");
                    }

                    if (typeof window !== 'undefined' && accessToken) {
                        setToken(accessToken);
                    }
                    
                    return {
                        id: userData.id || userData._id || credentials.username,
                        username: userData.username || credentials.username,
                        email: userData.email || '',
                        access_token: accessToken,
                    }
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : "Lỗi đăng nhập không xác định");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.access_token = (user as any).access_token
                token.user = {
                    _id: user.id || '',
                    username: (user as any).username || '',
                    email: user.email || '',
                    isVerify: true,
                    type: 'user',
                    role: 'user'
                }
            }
            return token
        },
        async session({ session, token }) {
            session.access_token = token.access_token
            session.user = {
                ...session.user,
                ...token.user,
                id: token.user._id,
                emailVerified: null
            }
            return session
        },
    },
    events: {
        async signOut() {
            removeToken();
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: 'jwt',
    },
})

export const customSignOut = async () => {
    removeToken();
    await signOut({ redirectTo: '/auth/login' });
};

export const testBackendConnection = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/test`);
        return response.ok;
    } catch (error) {
        console.error('Lỗi kết nối Backend:', error);
        return false;
    }
};