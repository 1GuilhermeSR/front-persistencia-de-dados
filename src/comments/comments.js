import React, { useState, useEffect } from 'react';
import axios from "axios";

const Comments = ({ postId: idAluno }) => {
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

                // utilizado para test sem a API
                // const data = [{
                //     id_professor: 1,
                //     id_aluno: 1,
                //     comentario: "Aluno Ruim!",
                // },{
                //     id_professor: 1,
                //     id_aluno: 1,
                //     comentario: "Aluno otimo!",
                // }];

                setComments(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComments();
    }, [idAluno]);

//    const deleteComment = async (commentId) => {
//        try {
//            const response = await axios.delete(`http://localhost:4000/comments/${commentId}`, {
//                method: 'DELETE',
//            });
//            if (!response.ok) {
//                throw new Error('Failed to delete comment');
//            }
//            setComments(comments.filter(comment => comment.id !== commentId));
//        } catch (err) {
//            setError(err.message);
//        }
//    };

    if (loading) return <div>Procurando comentários...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="comments-container">
            <h2>Comments</h2>
            {comments.length === 0 ? (
                <p>No comments yet</p>
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