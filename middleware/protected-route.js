import frappeAuthMiddleware from '../../middleware/frappeAuthMiddleware';

export default async function handler(req, res) {
    await frappeAuthMiddleware(req, res, () => {
        // Your protected logic here
        res.status(200).json({ message: 'You are authenticated!', user: req.user });
    });
}
