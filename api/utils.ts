
export async function handleApiError<T>(apiCall: () => Promise<T>): Promise<T | null> {
    try {
        return await apiCall();
    } catch (error) {
        console.error('API call failed:', error);
        return null; // or throw, depending on your error handling strategy
    }     
}