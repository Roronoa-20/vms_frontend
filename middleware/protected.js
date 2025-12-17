// pages/protected.js
import frappeAuthMiddleware from '../middleware/frappeAuthMiddleware';

export async function getServerSideProps(context) {
    const { req, res } = context;

    // Call the middleware to check authentication
    await frappeAuthMiddleware(req, res, () => {});

    // If the user is not authenticated, redirect to login
    if (!req.user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    // If authenticated, pass user data to the page
    return {
        props: { user: req.user },
    };
}

export default function ProtectedPage({ user }) {
    return <div>Welcome {user}</div>;
}
