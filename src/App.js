import { useState } from 'react';
import axios from "axios";
import './App.css';
import Modal from 'react-modal';

function App() {
  const [aluno, setAluno] = useState({
    nome: "",
    email: "",
    idade: "",
    link_image: null,
  });
  const [professor, setProfessor] = useState({
    nome: "",
    cargo: "",
    email: "",
    senha: "",
    link_image: null,
  });
  const [comentario, setComentario] = useState({
    texto: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [form, setForm] = useState("professor");

  const urlProfessor = "localhost:4000/api/professor";
  const urlAluno = "localhost:4000/api/aluno";
  const urlComentario = "localhost:4000/api/comments";

  function limparForm() {
    setProfessor({
      nome: "",
      cargo: "",
      email: "",
      senha: "",
      link_image: null,
    });
    setAluno({
      nome: "",
      email: "",
      idade: "",
      link_image: null,
    });
    setComentario({
      text: "",
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
    formData.append("nome", professor.nome);
    formData.append("cargo", professor.cargo);
    formData.append("email", professor.email);
    formData.append("senha", professor.senha);
    formData.append("link_image", professor.link_image);

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
    formData.append("texto", comentario.texto);

    axios
      .post(urlComentario, formData, {
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

  return (
    <div className="main">
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
                  style={{ maxWidth: "180px", marginTop: "16px", maxHeight: "150px", marginBottom: "46px" }}
                />
              ) : (<div style={{ marginBottom: "46px" }}></div>)}
              <button className='btnSalvar' onClick={salvarProfessor}>Salvar</button>
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
                    style={{ maxWidth: "180px", marginTop: "16px", marginBottom: "46px" }}
                  />
                ) : (<div style={{ marginBottom: "46px" }}></div>)}
                <button className='btnSalvar' onClick={salvarAluno}>Salvar</button>
              </div>
            </div>) : (
          <div className='containerForm'>
            <div className='containerInput'>
              <textarea value={comentario.texto} onChange={(e) => setComentario({ ...comentario, texto: e.target.value })} placeholder='Texto' className="inputStyle" id='inputTexto'></textarea>
              <button className='btnSalvar' onClick={salvarComentatio}>Salvar</button>
            </div>
          </div>)}
      </div>
    </div>
  );
}

export default App;
