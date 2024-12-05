import React, { useState, useEffect } from 'react';
import axios from "axios";

const Comments = ({ id_aluno: idAluno }) => {
    const [comments, setListaComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const urlComment = "localhost:4000/api/comments";

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${urlComment}/${idAluno}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();

                setListaComments(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComments();
    }, [idAluno]); 

    async function buscarComentarios() {
        try {
            const response = await axios.get(urlComment);
            setListaComments(response.data);
        } catch (error) {
            console.error('Erro ao buscar Comentários:', error);
        }
    }

    function removerComentario(idComentario) {
      axios
        .delete(`${urlComment}/${idComentario}`)
        .then(() => {
          alert("Comentario deletado com sucesso:");
        })
        .catch((error) => {
          console.error("Erro ao deletar comentario:", error);
        });
      buscarComentarios();
    }

    useEffect(() => {
        buscarComentarios();
    }, []);

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
                        <button onClick={() => removerComentario(comment.aluno_id)}>Deletar</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Comments;