export const callApi = async (url: string, method: string, body?: any) => {
    const mode = import.meta.env.MODE || ''

    // const options: RequestInit = {
    //     method,
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // };

    // if (body) {
    //     // options.body = type === 'image' ? body : JSON.stringify(body);

    //     options.body = body instanceof FormData ? body : JSON.stringify(body);
    // }

    const options: RequestInit = {
        method
    };

    if (body instanceof FormData) {
        // Content-Type을 직접 지정하지 않아야
        // 브라우저가 multipart boundary를 자동 생성합니다.
        options.body = body;
    } else if (body !== undefined) {
        options.headers = {
            "Content-Type": "application/json"
        };
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