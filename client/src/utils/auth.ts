export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem("token");
    return !!token;
};

export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
};

export const requireAuth = (router: any): boolean => {
    if (!isAuthenticated()) {
        alert("Please log in to access this feature.");
        router.push("/login");
        return false;
    }
    return true;
};

export const logout = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};