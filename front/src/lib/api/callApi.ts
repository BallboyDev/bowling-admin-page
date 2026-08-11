export const callApi = async (url: string, method: string, body?: any) => {
    const mode = import.meta.env.MODE || ''

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${mode === 'dev' ? '' : ''}${url}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error calling API:", error);
        throw error;
    }
};