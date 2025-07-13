import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            className="fixed top-4 left-4 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md z-20"
        >
            Volver
        </button>
    );
}

export default BackButton;
