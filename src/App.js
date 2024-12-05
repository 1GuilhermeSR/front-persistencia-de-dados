import { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';
import { FaListUl, FaRegEdit } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import Comments from './comments/comments';

function App() {
  const [aluno, setAluno] = useState({
    id: 0,
    nome: "",
    email: "",
    idade: "",
    link_image: null,
  });
  const [professor, setProfessor] = useState({
    id: 0,
    nome: "",
    cargo: "",
    email: "",
    senha: "",
    link_image: null,
  });
  const [comment, setComment] = useState({
    id_professor: 0,
    id_aluno: 0,
    comentario: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [form, setForm] = useState("professor");
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("professores");
  const [listaProfessores, setListaProfessores] = useState([]);
  const [listaAlunos, setListaAlunos] = useState([]);
  const [selectedAluno, setSelectedAluno] = useState('');
  const [showComments, setShowComments] = useState(false);
  const urlProfessor = "http://localhost:4000/api/professor";
  const urlAluno = "http://localhost:4000/api/aluno";
  const urlComment = "http://localhost:4000/api/comments";

  useEffect(() => {
    buscarProfessores()
    buscarAlunos()
  }, [])

  async function buscarProfessores() {
    try {
      var response = await axios.get(urlProfessor);
      setListaProfessores(response.data);
    } catch (error) {
      console.error('Erro ao buscar Professores:', error);
    }
  }
  async function buscarAlunos() {
    try {
      var response = await axios.get(urlAluno);
      setListaAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar Alunos:', error);
    }
  }
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  function limparForm() {
    setProfessor({
      id: 0,
      nome: "",
      cargo: "",
      email: "",
      senha: "",
      link_image: null,
    });
    setAluno({
      id: 0,
      nome: "",
      email: "",
      idade: "",
      link_image: null,
    });
    setComment({
      id: 0,
      id_professor: 0,
      id_aluno: 0,
      comentario: '',
    });
    setPreviewImage("");
  }

  function alterarForm(form) {
    limparForm();
    setForm(form);
  }

  function handleProfessorFileChange(event) {
    const file = event.target.files[0];
    debugger
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfessor({ ...professor, link_image: file });
      setPreviewImage(imageUrl);
    }
  }

  function handleAlunoFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAluno({ ...aluno, link_image: file });
      setPreviewImage(imageUrl);
    }
  }

  function salvarProfessor() {
    const formData = new FormData();
    formData.append("NOME", professor.nome);
    formData.append("CARGO", professor.cargo);
    formData.append("EMAIL", professor.email);
    formData.append("PASSWORD", professor.senha);
    formData.append("LINK_IMAGE", professor.link_image);

    axios
      .post(urlProfessor, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Professor salvo com sucesso:");
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao salvar professor:", error);
      });
  }

  function salvarAluno() {
    const formData = new FormData();
    formData.append("nome", aluno.nome);
    formData.append("email", aluno.email);
    formData.append("idade", aluno.idade);
    formData.append("link_image", aluno.link_image);

    axios
      .post(urlAluno, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Aluno salvo com sucesso:")
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao salvar aluno:", error);
      });
  }

  function salvarComentatio() {
    const formData = new FormData();
    formData.append("id_aluno", selectedAluno);
    formData.append("comentario", comment.comentario);

    axios
      .post(urlComment, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Comentario salvo com sucesso:")
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao salvar comentario:", error);
      });
  }

  function abrirModal() {
    setIsOpen(true)
  }
  function fecharModal() {
    setIsOpen(false)
  }

  function editarProfessor(idProfessor) {
    axios
      .put(`${urlProfessor}/${idProfessor}`)
      .then(() => {
        alert("Professor atualizado com sucesso:")
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao atualizar professor:", error);
      });
    buscarProfessores();
  }

  function removerProfessor(idProfessor) {
    axios
      .delete(`${urlProfessor}/${idProfessor}`)
      .then(() => {
        alert("Professor deletado com sucesso:")
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao deletar professor:", error);
      });
    buscarProfessores();
  }

  function editarAluno(idAluno) {
    axios
      .put(`${urlAluno}/${idAluno}`)
      .then(() => {
        alert("Aluno atualizado com sucesso:")
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao atualizar aluno:", error);
      });
    buscarAlunos();
  }

  function removerAluno(idAluno) {
    axios
      .delete(`${urlAluno}/${idAluno}`)
      .then(() => {
        alert("Aluno deletado com sucesso:")
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao deletar aluno:", error);
      });
    buscarAlunos();
  }

  return (
    <div className="main">
      <div className='container'>
        <div className="titulo">
          <div className="containerSpanTitulo"> <FaListUl /><span>Lista de professores, alunos e comentários</span></div>
          <div className="divisor"></div>
        </div>
        <div className="topo">
          <button onClick={abrirModal}>Novo</button>
          <div className="status">
            <p>Filtrar por: </p>
            <div className="radioGroup">
              <input
                type="radio"
                id="Professores"
                name="status"
                value="professores"
                checked={status == 'professores'}
                onChange={handleStatusChange}
                className="chkStatus"
              />
              <label htmlFor="Professores" className="chkLabel">Professores</label>

              <input
                type="radio"
                id="alunos"
                name="status"
                value="alunos"
                checked={status == 'alunos'}
                onChange={handleStatusChange}
                className="chkStatus"
              />
              <label htmlFor="alunos" className="chkLabel">Alunos</label>

              <input
                type="radio"
                id="comentarios"
                name="status"
                value="comentarios"
                checked={status == 'comentarios'}
                onChange={handleStatusChange}
                className="chkStatus"
              />
              <label htmlFor="comentarios" className="chkLabel">Comentarios</label>

            </div>
          </div>
        </div>

        {status == "professores" ? (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOME</th>
                  <th>CARGO</th>
                  <th>EMAIL</th>
                  <th>FOTO</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {listaProfessores.map((professor) => (
                  <tr key={professor.ID}>
                    <td>{professor.ID}</td>
                    <td>{professor.NOME}</td>
                    <td>{professor.CARGO}</td>
                    <td>{professor.EMAIL}</td>
                    <td><img src={professor.LINK_IMAGE} alt='Professor Image'/></td>
                    <td>
                      <FaRegEdit
                        className="iconEdit"
                        onClick={() => editarProfessor(professor.ID)}
                      />
                      <CiTrash
                        className="iconDelete"
                        onClick={() => removerProfessor(professor.ID)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        ) : status == "alunos" ? (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOME</th>
                  <th>IDADE</th>
                  <th>EMAIL</th>
                  <th>FOTO</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {listaAlunos.map((aluno) => (
                  <tr key={aluno.ID}>
                    <td>{aluno.ID}</td>
                    <td>{aluno.NOME}</td>
                    <td>{aluno.IDADE}</td>
                    <td>{aluno.EMAIL}</td>
                    <td><img src={aluno.LINK_IMAGE} alt='Aluno Image'/></td>
                    <td>
                      <FaRegEdit
                        className="iconEdit"
                        onClick={() => editarAluno(aluno.id)}
                      />
                      <CiTrash
                        className="iconDelete"
                        onClick={() => removerAluno(aluno.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        ) : (
          <div>
            <select
              defaultValue=""
              value={selectedAluno}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue !== "") {
                  setSelectedAluno(selectedValue);
                  setShowComments(false);
                  setTimeout(() => setShowComments(true), 0);
                } else {
                  setShowComments(false);
                }
              }}
              className="inputStyle"
            >
              <option value="">Selecione um aluno</option>
              {listaAlunos.map(aluno => (
                <option key={aluno.ID} value={aluno.ID}>
                  {aluno.NOME}
                </option>
              ))}
            </select>
            {showComments && <Comments id_aluno={selectedAluno} />}
          </div>
        )}

        {isOpen && (
          <div className="modalOverlay">

            <div className="card">
              <div className="containerTipo">
                <h2 onClick={() => alterarForm("professor")} id={form === "professor" ? "sublinhado" : ""}>Professor</h2>
                <h2 onClick={() => alterarForm("aluno")} id={form === "aluno" ? "sublinhado" : ""}>Aluno</h2>
                <h2 onClick={() => alterarForm("comentario")} id={form === "comentario" ? "sublinhado" : ""}>Comentário</h2>
              </div>
              {form === "professor" ? (
                <div className='containerForm'>
                  <div className='containerInput'>
                    <input value={professor.nome} onChange={(e) => setProfessor({ ...professor, nome: e.target.value })} placeholder='Nome' type='text' className="inputStyle" id='inputNome'></input>
                    <input value={professor.cargo} onChange={(e) => setProfessor({ ...professor, cargo: e.target.value })} placeholder='Cargo' type='text' className="inputStyle"></input>
                    <input value={professor.email} onChange={(e) => setProfessor({ ...professor, email: e.target.value })} placeholder='Email' type='text' className="inputStyle"></input>
                    <input value={professor.senha} onChange={(e) => setProfessor({ ...professor, senha: e.target.value })} placeholder='Senha' type='text' className="inputStyle"></input>
                    <input type='file' onChange={(e) => handleProfessorFileChange(e)}></input>
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ maxWidth: "180px", marginTop: "16px", maxHeight: "110px", marginBottom: "46px" }}
                      />
                    ) : (<div style={{ marginBottom: "46px" }}></div>)}
                    <button className='btnSalvar' onClick={salvarProfessor}>Salvar</button>
                    <button className='btnFechar' onClick={fecharModal}>Fechar</button>
                  </div>
                </div>) : form === "aluno" ? (
                  <div className='containerForm'>
                    <div className='containerInput'>
                      <input value={aluno.nome} onChange={(e) => setAluno({ ...aluno, nome: e.target.value })} placeholder='Nome' type='text' className="inputStyle" id='inputNome'></input>
                      <input value={aluno.email} onChange={(e) => setAluno({ ...aluno, email: e.target.value })} placeholder='Email' type='text' className="inputStyle"></input>
                      <input value={aluno.idade} onChange={(e) => setAluno({ ...aluno, idade: e.target.value })} placeholder='Idade' type='number' className="inputStyle"></input>
                      <input type='file' onChange={(e) => handleAlunoFileChange(e)}></input>
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{ maxWidth: "180px", marginTop: "16px", maxHeight: "110px", marginBottom: "46px" }}
                        />
                      ) : (<div style={{ marginBottom: "46px" }}></div>)}
                      <button className='btnSalvar' onClick={salvarAluno}>Salvar</button>
                      <button className='btnFechar' onClick={fecharModal}>Fechar</button>
                    </div>
                  </div>) : (
                <div className='containerForm'>
                  <div className='containerInput'>
                    <div className="dropdown-container" id='inputNome'>
                      <select
                        defaultValue=""
                        value={selectedAluno}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setSelectedAluno(selectedValue);
                        }}
                        className="inputStyle"
                      >
                        <option value="">Selecione um aluno</option>
                        {listaAlunos.map(aluno => (
                          <option key={aluno.ID} value={aluno.ID}>
                            {aluno.NOME}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea value={comment.comentario} onChange={(e) => setComment({ ...comment, comentario: e.target.value })} placeholder='Texto' className="inputStyle" id='inputText'></textarea>
                    <button className='btnSalvar' onClick={salvarComentatio}>Salvar</button>
                    <button className='btnFechar' onClick={fecharModal}>Fechar</button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>

  );
}

export default App;
