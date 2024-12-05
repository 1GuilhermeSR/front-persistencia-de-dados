import React, { useState, useEffect } from 'react';
import axios from "axios";

const Comments = ({ id_aluno: idAluno }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/comments/${idAluno}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();

                setComments(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComments();
    }, [idAluno]); 

    if (loading) return <div>Procurando comentários...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="comments-container" style={{ textAlign: 'center' }}>
            <h2>Comentários</h2>
            {comments.length === 0 ? (
                <p>Sem comentarios</p>
            ) : (
                comments.map(comment => (
                    <div key={comment.aluno_id} className="comment-box">
                        <p>{comment.comentario}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Comments;