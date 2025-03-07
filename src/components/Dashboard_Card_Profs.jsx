import css from "./Dashboard_Card_Profs.module.css";
import Modal from "react-modal";
import {useContext, useEffect, useState} from "react";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import {Dados} from "../contexts/context";

Modal.setAppElement("#root");

export default function Dashboard_Card_Profs({busca}) {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [nome, setNome] = useState("")
    const [senha, setSenha] = useState("")
    const [email, setEmail] = useState("")
    const [turnoINI, setTurnoINI] = useState("")
    const [turnoEND, setTurnoEND] = useState("")
    const {fetchData} = useContext(Dados)
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [professoresCadastrados, setProfessoresCadastradas] = useState([]);

    const [diasDaSemana, setDiasDaSemana] = useState(new Array(7).fill(false))
    const [totalDiasSemana, setTotalDiasSemana] = useState(0)

    const [ignore, setIgnore] = useState(0)

    useEffect(() => {
        const  handlePegarProf = async (e) => {
            let resp = await fetchData("/professor", "GET")
            console.log(resp)
            setProfessoresCadastradas(resp.response)
        };

        handlePegarProf()
    }, [ignore]);

    const deletarProf = async (e) => {
        let resp = await fetchData("/usuario/" + e.currentTarget.attributes.getNamedItem("data-id").value, "DELETE");
        console.log(resp);

        if (resp.mensagem == "Professor está cadastrado em um curso"){
            alert("Professor está cadastrado em um curso")
        }

        else{
            return window.location.reload();
        }
    };

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }
    const  handleCadastrarProfessor = async (e) => {
        e.preventDefault()
        let input_body = {"nome": nome, "senha": senha, "email": email, "cargo": "professor", "end_turno" : turnoEND, "start_turno":turnoINI, "dias_da_semana": totalDiasSemana}
        setNome('');
        setSenha('');
        setEmail('');
        setDiasDaSemana(new Array(7).fill(false));
        setTotalDiasSemana(0)
        setTurnoEND('');
        setTurnoINI('');
        console.log(input_body)
        let resp = await fetchData("/usuario", "POST", input_body)
        console.log(resp.statusCode)
        console.log(typeof resp.statusCode)
        if (!("response" in resp)) {
            return window.location.reload();
        }
        closeModal();
        setIgnore(resp)
    };

    function handleInputChange(event) {
        setNome(event.target.value);
    }

    function handleInputChange2(event) {
        setEmail(event.target.value);
    }

    function handleInputChange3(event) {
        setSenha(event.target.value);
    }

    function handleInputChange4(event) {
        setTurnoINI(event.target.value);
    }

    function handleInputChange5(event) {
        setTurnoEND(event.target.value);
    }

    function handleCheckboxChange(position) {
        const update_state = diasDaSemana.map((item, index) =>
            index === position ? !item : item
        )

        setDiasDaSemana(update_state)

        const totalDias = update_state.reduce(
            (sum, is_activated, index) => {
                return sum + is_activated * (2 ** index)
            }, 0
        );

        setTotalDiasSemana(totalDias)
    }

    function toggleExpansion(index) {
        setExpandedIndex(expandedIndex === index ? null : index);
    }


    return (
        <div>
            <div className={css.card_profs}>
                <h4 className={css.titulo}>Professores Cadastrados</h4>
                <div className={css.todos_cursos}>
                    {professoresCadastrados
                        .filter((sala) => sala?.nome.includes(busca))
                        .map((professor, index) => (
                        <div key={index} className={`${css.campo3} ${expandedIndex === index ? css.expanded : ''}`}>

                            <div className={css.separa_nome}>
                                <p className={css.professores}>Nome: {professor.nome}</p>
                                <button data-id={professor.id}
                                    className={css.btn_lixeira}
                                    onClick={(e) => deletarProf(e)}
                                >
                                    <HiArchiveBoxXMark className={css.icon_lixeira}/>
                                </button>
                            </div>
                            {expandedIndex === index && (
                                <>
                                    <p className={css.professores}>Email: {professor.email}</p>
                                    <p className={css.professores}>Início do turno: {professor.start_turno}</p>
                                    <p className={css.professores}>Final do turno: {professor.end_turno}</p>
                                    <p className={css.professores}>Dias de trabalho: {professor.dias_da_semana['list'].join(', ')}</p>
                                </>


                            )}
                            <div className={css.lado}>
                                <button className={css.btn_vermais} onClick={() => toggleExpansion(index)}>
                                    {expandedIndex === index ? 'Ver menos' : 'Ver mais'}
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
                <button className={css.mais} onClick={openModal}>+</button>
                <div className={css.plus}>
                <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        overlayClassName="modal-overlay"
                    >
                    <div className="modal-content">
                            <div>
                            <h2>Cadastrar Novo Professor</h2>
                            </div>
                        <div className={css.separa_inps}>
                            <input
                                className={css.inp}
                                placeholder={"Nome:"}
                                name="nome"
                                value={nome}
                                onChange={handleInputChange}
                                required="required"
                            ></input>
                            <input
                                className={css.inp}
                                placeholder={"Email:"}
                                name="email"
                                value={email}
                                onChange={handleInputChange2}
                                required="required"
                            ></input>
                            <input
                                className={css.inp}
                                placeholder={"Senha:"}
                                name="senha"
                                value={senha}
                                onChange={handleInputChange3}
                                required="required"
                            ></input>
                            <div className={css.pzin}>
                                <p>Início do turno:</p>
                            </div>
                            <input
                                className={css.inp}
                                placeholder={"Início do turno:"}
                                name="inicioTurno"
                                type={"time"}
                                value={turnoINI}
                                onChange={handleInputChange4}
                                required="required"
                            ></input>
                            <div className={css.pzin}>
                                <p>Fim do turno:</p>
                            </div>
                            <input
                                className={css.inp}
                                placeholder={"Final do turno:"}
                                name="finalTurno"
                                type={"time"}
                                value={turnoEND}
                                onChange={handleInputChange5}
                                required
                            ></input>
                            <div className={css.pzin2}>
                                <p>Dias de Aulas:</p>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <input
                                        name={'D'}
                                        type={"checkbox"}
                                        onChange={() => handleCheckboxChange(0)}
                                    />
                                    <label>D</label>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <input
                                        name={'S'}
                                        type={"checkbox"}
                                        onChange={() => handleCheckboxChange(1)}
                                    />
                                    <label>S</label>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <input
                                        name={'T'}
                                        type={"checkbox"}
                                        onChange={() => handleCheckboxChange(2)}
                                    />
                                    <label>T</label>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <input
                                        name={'Q'}
                                        type={"checkbox"}
                                        onChange={() => handleCheckboxChange(3)}
                                    />
                                    <label>Q</label>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <input
                                        name={'Q'}
                                        type={"checkbox"}
                                        onChange={() => handleCheckboxChange(4)}
                                    />
                                    <label>Q</label>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <input
                                        name={'S'}
                                        type={"checkbox"}
                                        onChange={() => handleCheckboxChange(5)}
                                    />
                                    <label>S</label>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <input
                                        name={'S'}
                                        type={"checkbox"}
                                        onChange={() => handleCheckboxChange(6)}
                                    />
                                    <label>S</label>
                                </div>

                            </div>
                        </div>
                        <div>
                            <button className={css.cadastrar_btn} onClick={handleCadastrarProfessor}>
                                Cadastrar
                            </button>
                        </div>
                    </div>
                </Modal>
                </div>
            </div>
        </div>
    );
}
