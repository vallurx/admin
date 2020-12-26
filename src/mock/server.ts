import { createServer, Response } from 'miragejs';

export const startMockServer = () => {
    createServer({
        routes() {
            this.namespace = 'api';

            this.get('/user', (schema, request) => {
                if (request.requestHeaders.Authorization) {
                    return {
                        id: 1,
                        name: 'Jackson Yeager',
                        email: 'jackson@vallurx.com',
                        company_name: 'VallurX',
                        role: 1
                    };
                } else {
                    return new Response(401, {}, { error: 'MISSING_AUTH' });
                }
            });

            this.post('/login', (schema, request) => {
                const { email, password } = JSON.parse(request.requestBody);

                if (email === 'jackson@vallurx.com' && password === 'password123') {
                    return { session_id: 123, id: 1 };
                } else {
                    const error = email !== 'jackson@vallurx.com' ? 'EMAIL_NOT_FOUND' : 'INVALID_PASSWORD';

                    return new Response(401, {}, { error });
                }
            });
        }
    });
}