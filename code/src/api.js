import { createServer } from 'node:http';
import { once } from 'node:events';
import jsonwebtoken from 'jsonwebtoken';

const VALID_USER = {
    username: 'kauecampos',
    password: '123456'
}

const SECRET = '1312313123';
async function loginRoutes(request, response) {
    const { username, password } = JSON.parse(
        await once(request, 'data')
    );
    if (username !== VALID_USER.username || password !== VALID_USER.password) {
        response.writeHead(401, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Invalid username or password' }));
        return;
    }
    const token = jsonwebtoken.sign({
        username
    }, SECRET);

    response.end(JSON.stringify({ token }));
}

function validateHeader(headers) {
    try {
        const auth = headers.authorization.replace(/bearer\s/ig, '');
        jsonwebtoken.verify(auth, SECRET);
        return true;
    } catch (e) {
        return false;
    }
}
async function handler(request, response) {
    if (request.url === '/login' && request.method === 'POST') {
        return loginRoutes(request, response);
    }
    if (!validateHeader(request.headers)) {
        response.writeHead(400);
        response.end(JSON.stringify({ message: 'Token not provided' }));
        return;
    }
    response.end('Hello World');
}

const app = createServer(handler).listen(3000, () => {
    console.log('Server listening on port 3000');
});

export { app }