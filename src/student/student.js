import React, { useState, useEffect } from 'react';
import default_pic from '../assets/default_user_picture.jpg';
import axios from "axios";

const Students = (update_table) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/aluno/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data = await response.json();

                setStudents(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudents();
    }, [update_table]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/aluno/${id}`);
            setStudents(students.filter(student => student.id !== id));
        } catch (err) {
            setError('Failed to delete student');
        }
    };

    if (loading) return <div>Loading students...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="students-container" style={{ textAlign: 'center' }}>
            <h2>Alunos</h2>
            {students.length === 0 ? (
                <p>Sem alunos ainda</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>
                                    {student.link_image ? (
                                        <img src={student.link_image} alt={student.nome} width="50" height="50" />
                                    ) : (
                                        <img src={default_pic} alt={'Foto Padrão'} width="50" height="50" />
                                    )}
                                </td> 
                                <td>{student.nome}</td>
                                <td>{student.email}</td>
                                <td>{student.idade}</td>
                                <td>{student.idade}</td>
                            <td>
                                <button onClick={() => handleDelete(student.id)}>Delete</button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Students;
