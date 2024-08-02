import { describe, before, after, it } from 'node:test';
import { strictEqual, deepStrictEqual, ok } from 'node:assert';

const BASE_URL = 'http://localhost:3000';

describe('API', () => {
    let _server = {};
    let _globalToken = {};
    before(async () => {
        _server = (await import('../src/api.js')).app;
        await new Promise((resolve) => {
            _server.on('listening', resolve);
        });
    });
    after(done => _server.close(done));

    it('validate is user and password is incorrect', async () => {
        const data = {
            username: 'kauecampos',
            password: '13213'
        }

        const request = await fetch(
            `${BASE_URL}/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        strictEqual(request.status, 401);
        const response = await request.json();
        deepStrictEqual(response, { message: 'Invalid username or password' });
    });
    it('validate is user and password are correct', async () => {
        const data = {
            username: 'kauecampos',
            password: '123456'
        }

        const request = await fetch(
            `${BASE_URL}/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        strictEqual(request.status, 200);
        const response = await request.json();
        ok(response.token);
        _globalToken = response.token;
    });
    it('should is user not be allowed to access data a token', async () => {
        const request = await fetch(
            `${BASE_URL}/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: ''
                },
            });
        strictEqual(request.status, 400);
        const response = await request.json();
        deepStrictEqual(response, { message: 'Token not provided' });
    });
    it('should is user be allowed to access data a token', async () => {
        const request = await fetch(
            `${BASE_URL}/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${_globalToken}`
                },
            });
        strictEqual(request.status, 200);
        const response = await request.text();
        strictEqual(response, 'Hello World');
    });
});