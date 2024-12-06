import { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';
import { FaListUl, FaRegEdit } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import Comments from './comments/comments';

function App() {
  const [aluno, setAluno] = useState({
    ID: 0,
    NOME: "",
    EMAIL: "",
    IDADE: "",
    LINK_IMAGE: null,
  });
  const [professor, setProfessor] = useState({
    ID: 0,
    NOME: "",
    CARGO: "",
    EMAIL: "",
    PASSWORD: "",
    LINK_IMAGE: null,
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
      ID: 0,
      NOME: "",
      CARGO: "",
      EMAIL: "",
      PASSWORD: "",
      LINK_IMAGE: null,
    });
    setAluno({
      ID: 0,
      NOME: "",
      EMAIL: "",
      IDADE: "",
      LINK_IMAGE: null,
    });
    setComment({
      ID: 0,
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
      setProfessor({ ...professor, LINK_IMAGE: file });
      setPreviewImage(imageUrl);
    }
  }

  function handleAlunoFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAluno({ ...aluno, LINK_IMAGE: file });
      setPreviewImage(imageUrl);
    }
  }

  function salvarProfessor() {
    const formData = new FormData();
    formData.append("NOME", professor.NOME);
    formData.append("CARGO", professor.CARGO);
    formData.append("EMAIL", professor.EMAIL);
    formData.append("PASSWORD", professor.PASSWORD);
    formData.append("LINK_IMAGE", professor.LINK_IMAGE);

    const url = professor.ID ? `${urlProfessor}/${professor.ID}` : urlProfessor;
    const method = professor.ID ? 'put' : 'post';

    axios({
      method: method,
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        alert(`Professor ${professor.ID ? 'atualizado' : 'salvo'} com sucesso:`);
        limparForm();
        fecharModal();
      })
      .catch((error) => {
        console.error(`Erro ao ${professor.ID ? 'atualizar' : 'salvar'} professor:`, error);
      });
  }

  function salvarAluno() {
    const formData = new FormData();
    formData.append("NOME", aluno.NOME);
    formData.append("EMAIL", aluno.EMAIL);
    formData.append("IDADE", aluno.IDADE);
    formData.append("LINK_IMAGE", aluno.LINK_IMAGE);

    const url = aluno.ID ? `${urlAluno}/${aluno.ID}` : urlAluno;
    const method = aluno.ID ? 'put' : 'post';

    axios({
      method: method,
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        alert(`Aluno ${aluno.ID ? 'atualizado' : 'salvo'} com sucesso:`);
        limparForm();
        fecharModal();
      })
      .catch((error) => {
        console.error(`Erro ao ${aluno.ID ? 'atualizar' : 'salvar'} aluno:`, error);
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
    setIsOpen(false);
    if (form === "professor") {
      buscarProfessores();
    } else {
      buscarAlunos();
    }
  }

  const editarProfessor = (ID) => {
    const professor = listaProfessores.find(prof => prof.ID === ID);
    setProfessor(professor);
    setIsOpen(true);
  };

  async function removerProfessor(idProfessor) {
    axios
      .delete(`${urlProfessor}/${idProfessor}`)
      .then(() => {
        alert("Professor deletado com sucesso:")
        limparForm();
      })
      .catch((error) => {
        console.error("Erro ao deletar professor:", error);
      });

    await buscarProfessores();
  }

  function editarAluno(idAluno) {
    const aluno = listaAlunos.find(alu => alu.ID === idAluno);
    setAluno(aluno);
    setForm("aluno");
    setIsOpen(true);
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
                onChange={(e) => { handleStatusChange(e); setSelectedAluno("") }}
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
                    <td><img src={professor.LINK_IMAGE} alt='Professor Image' /></td>
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
                    <td><img src={aluno.LINK_IMAGE} alt='Aluno Image' /></td>
                    <td>
                      <FaRegEdit
                        className="iconEdit"
                        onClick={() => editarAluno(aluno.ID)}
                      />
                      <CiTrash
                        className="iconDelete"
                        onClick={() => removerAluno(aluno.ID)}
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
                  setSelectedAluno("");
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
                    <input value={professor.NOME} onChange={(e) => setProfessor({ ...professor, NOME: e.target.value })} placeholder='Nome' type='text' className="inputStyle" id='inputNome'></input>
                    <input value={professor.CARGO} onChange={(e) => setProfessor({ ...professor, CARGO: e.target.value })} placeholder='Cargo' type='text' className="inputStyle"></input>
                    <input value={professor.EMAIL} onChange={(e) => setProfessor({ ...professor, EMAIL: e.target.value })} placeholder='Email' type='text' className="inputStyle"></input>
                    <input value={professor.PASSWORD} onChange={(e) => setProfessor({ ...professor, PASSWORD: e.target.value })} placeholder='Senha' type='text' className="inputStyle"></input>
                    <input type='file' onChange={(e) => handleProfessorFileChange(e)}></input>
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ maxWidth: "180px", marginTop: "16px", maxHeight: "110px", marginBottom: "46px" }}
                      />
                    ) : professor.LINK_IMAGE ? (
                      <img
                        src={professor.LINK_IMAGE}
                        alt="Professor"
                        style={{ maxWidth: "180px", marginTop: "16px", maxHeight: "110px", marginBottom: "46px" }}
                      />
                    ) : (
                      <div style={{ marginBottom: "46px" }}></div>
                    )}
                    <button className='btnSalvar' onClick={salvarProfessor}>Salvar</button>
                    <button className='btnFechar' onClick={() => { fecharModal(); limparForm(); buscarProfessores() }}>Fechar</button>
                  </div>
                </div>) : form === "aluno" ? (
                  <div className='containerForm'>
                    <div className='containerInput'>
                      <input value={aluno.NOME} onChange={(e) => setAluno({ ...aluno, NOME: e.target.value })} placeholder='Nome' type='text' className="inputStyle" id='inputNome'></input>
                      <input value={aluno.EMAIL} onChange={(e) => setAluno({ ...aluno, EMAIL: e.target.value })} placeholder='Email' type='text' className="inputStyle"></input>
                      <input value={aluno.IDADE} onChange={(e) => setAluno({ ...aluno, IDADE: e.target.value })} placeholder='Idade' type='number' className="inputStyle"></input>
                      <input type='file' onChange={(e) => handleAlunoFileChange(e)}></input>
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{ maxWidth: "180px", marginTop: "16px", maxHeight: "110px", marginBottom: "46px" }}
                        />
                      ) : aluno.LINK_IMAGE ? (
                        <img
                          src={aluno.LINK_IMAGE}
                          alt="Aluno"
                          style={{ maxWidth: "180px", marginTop: "16px", maxHeight: "110px", marginBottom: "46px" }}
                        />
                      ) : (
                        <div style={{ marginBottom: "46px" }}></div>
                      )}
                      <button className='btnSalvar' onClick={salvarAluno}>Salvar</button>
                      <button className='btnFechar' onClick={() => { fecharModal(); limparForm() }}>Fechar</button>
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
                          if (selectedValue === "") {
                            setSelectedAluno("");
                          } else {
                            setSelectedAluno(selectedValue);
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
                    </div>
                    <textarea value={comment.comentario} onChange={(e) => setComment({ ...comment, comentario: e.target.value })} placeholder='Texto' className="inputStyle" id='inputText'></textarea>
                    <button className='btnSalvar' onClick={salvarComentatio}>Salvar</button>
                    <button className='btnFechar' onClick={() => { fecharModal(); limparForm() }}>Fechar</button>
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
