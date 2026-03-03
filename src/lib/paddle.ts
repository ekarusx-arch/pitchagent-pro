import { Paddle, Environment } from '@paddle/paddle-node-sdk';

export const paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
    environment: (process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true' ? Environment.sandbox : Environment.production) as Environment,
});
