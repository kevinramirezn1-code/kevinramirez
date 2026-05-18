import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarGestionSalas from '../components/NavbarGestionSalas';
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import '../styles/GestionarReservas.css';
import devolver from '../assets/images/devolver.png';

function GestionarReservas() {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [showCrear, setShowCrear] = useState(false);
  const [showEditar, setShowEditar] = useState(false);

  const [showConsultar, setShowConsultar] = useState(false);
  const [tipoConsulta, setTipoConsulta] = useState("sala");
  const [salaConsulta, setSalaConsulta] = useState("");
  const [fechaConsulta, setFechaConsulta] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);

  const [horaInicio, setHoraInicio] = useState("07:00 AM");
  const [horaFin, setHoraFin] = useState("07:30 AM");
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState("");

  const [reservasDelDia, setReservasDelDia] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const [docentes, setDocentes] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState("");

  const [showHistorial, setShowHistorial] = useState(false);
  const [historialReservas, setHistorialReservas] = useState([]);
  const [filtroSala, setFiltroSala] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  const [historialPage, setHistorialPage] = useState(1);
  const HISTORIAL_PAGE_SIZE = 10;

  const [usuarios, setUsuarios] = useState([]);

  const API_URL = "http://localhost:3001/api";

  const opcionesHora = [];

    for (let minutos = 7 * 60; minutos <= 21 * 60 + 30; minutos += 30) {
      const h24 = Math.floor(minutos / 60);
      const m = minutos % 60;

      const ampm = h24 >= 12 ? "PM" : "AM";
      let h = h24 % 12;
      if (h === 0) h = 12;

      opcionesHora.push(`${h}:${m === 0 ? "00" : "30"} ${ampm}`);
    }
  
  const generarDisponibilidad = async () => {
    if (!salaConsulta) return alert("Selecciona una sala");
    if (!fechaConsulta) return alert("Selecciona una fecha");

    try {
      const res = await axios.get(
        `${API_URL}/reservas?fecha=${fechaConsulta}`
      );

      const reservasSala = res.data.filter(
        r => r.idSala == salaConsulta
      );

      // ✅ FIX REAL SIN DESFASE
      const getMinutosDesdeISO = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.getHours() * 60 + fecha.getMinutes();
      };

      const minutosAHora12 = (minutosTotales) => {
        let h = Math.floor(minutosTotales / 60);
        const m = minutosTotales % 60;

        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12;
        if (h === 0) h = 12;

        return `${h}:${m === 0 ? "00" : m} ${ampm}`;
      };

      const bloques = [];

      for (let minutos = 7 * 60; minutos < 21 * 60 + 30; minutos += 30) {

        const inicioBloqueMin = minutos;
        const finBloqueMin = minutos + 30;

        const ocupado = reservasSala.some(r => {
          const inicioResMin = getMinutosDesdeISO(r.fechaInicio);
          const finResMin = getMinutosDesdeISO(r.fechaFin);

          return inicioBloqueMin < finResMin && finBloqueMin > inicioResMin;
        });

        bloques.push({
          hora: minutosAHora12(minutos),
          estado: ocupado ? "OCUPADO" : "DISPONIBLE"
        });
      }

      setDisponibilidad(bloques);

    } catch (error) {
      console.error("Error:", error);
      alert("Error al consultar disponibilidad");
    }
  };

  const formatoHora = (hora) => {
    const [time, ampm] = hora.split(" ");
    let [h, m] = time.split(":").map(Number);

    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    return { h, m };
  };

  const convertirFechaAHora12 = (fecha) => {
    const date = new Date(fecha);
    let horas = date.getHours();
    const minutos = date.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";

    horas = horas % 12;
    if (horas === 0) horas = 12;

    return `${horas}:${minutos} ${ampm}`;
  };

  const cargarReservasDelDia = async (fecha) => {
    if (!fecha) return;

    try {
      const fechaStr = fecha.toLocaleDateString('en-CA');
      const res = await axios.get(`${API_URL}/reservas?fecha=${fechaStr}`);
      setReservasDelDia(res.data);
    } catch (error) {
      console.error("Error al obtener reservas del día:", error);
      setReservasDelDia([]);
    }
  };

  useEffect(() => {
    if (!selectedDate) return;
    cargarReservasDelDia(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const res = await axios.get(`${API_URL}/salas`, {
          withCredentials: true // 🔥 ESTO ES LO QUE TE FALTA
        });

        setSalas(res.data); // 🔥 ya vienen filtradas desde backend
      } catch (error) {
        console.error("Error al obtener salas:", error);
      }
    };

    fetchSalas();
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {

        const res = await axios.get(
          `${API_URL}/usuarios`,
          { withCredentials: true }
        );

        setUsuarios(res.data.items);

      } catch (error) {
        console.error("Error cargando usuarios", error);
      }
    };

    fetchUsuarios();

  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.rol?.toLowerCase() === "secretaria") {
      const fetchDocentes = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/usuarios/docentes/mis-facultad`,
            { withCredentials: true }
          );

          setDocentes(res.data);
        } catch (error) {
          console.error("Error cargando docentes", error);
        }
      };

      fetchDocentes();
    }
  }, [user]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const firstDayOfWeek = firstDay.getDay();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setReservaSeleccionada(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setReservaSeleccionada(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setReservaSeleccionada(null);
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getAvailabilityStatus = () => "disponible";
  const getStatusText = () => "Disponible";
  const getStatusColor = () => "#10b981";
  const getStatusBackgroundColor = () => "#d1fae5";

  const limpiarFormulario = () => {
    setHoraInicio("07:00 AM");
    setHoraFin("07:30 AM");
    setSalaSeleccionada("");
  };

  const abrirModalCrear = () => {
    if (!selectedDate) {
      alert("Debes seleccionar un día antes de crear reserva");
      return;
    }
    if (selectedDate.getDay() === 0) {
      alert("No se pueden hacer reservas los domingos");
      return;
    }
    limpiarFormulario();
    setShowCrear(true);
  };

  const abrirModalEditar = () => {
    if (!reservaSeleccionada) {
      alert("Debes seleccionar una reserva para ajustar");
      return;
    }

    setHoraInicio(convertirFechaAHora12(reservaSeleccionada.fechaInicio));
    setHoraFin(convertirFechaAHora12(reservaSeleccionada.fechaFin));
    setSalaSeleccionada(reservaSeleccionada.idSala);
    setShowEditar(true);
  };

  const handleCrearReserva = async () => {
    if (!selectedDate) return alert("Debes seleccionar un día primero");

    if (selectedDate.getDay() === 0) {
      return alert("No se pueden crear reservas los domingos");
    }

    if (!salaSeleccionada) {
      return alert("Debes seleccionar una sala");
    }

    if (!horaInicio || !horaFin) {
      return alert("Debes seleccionar hora inicio y fin");
    }

    // 🔥 VALIDACIÓN CLAVE
    if (user.rol === "SECRETARIA" && !docenteSeleccionado) {
      return alert("Debes seleccionar un docente");
    }

    try {
      const inicio = formatoHora(horaInicio);
      const fin = formatoHora(horaFin);

      const fechaInicio = new Date(selectedDate);
      fechaInicio.setHours(inicio.h, inicio.m, 0, 0);

      const fechaFin = new Date(selectedDate);
      fechaFin.setHours(fin.h, fin.m, 0, 0);

      await axios.post(
        `${API_URL}/reservas`,
        {
          fechaInicio,
          fechaFin,
          idUsuario:
            user.rol === "DOCENTE"
              ? user.id
              : docenteSeleccionado, // 🔥 aquí se asigna
          idSala: salaSeleccionada
        },
        { withCredentials: true }
      );

      alert("Reserva creada correctamente");

      setShowCrear(false);
      limpiarFormulario();
      setDocenteSeleccionado("");

      await cargarReservasDelDia(selectedDate);

    } catch (error) {
      console.error("Error al crear reserva:", error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.errores?.join("\n") ||
        "Error al crear reserva"
      );
    }
  };

  const handleActualizarReserva = async () => {
    if (!reservaSeleccionada) return alert("Debes seleccionar una reserva");
    if (!selectedDate) return alert("Debes seleccionar un día");
    if (!salaSeleccionada) return alert("Debes seleccionar una sala");
    if (!horaInicio || !horaFin) return alert("Debes seleccionar hora inicio y fin");

    try {
      const inicio = formatoHora(horaInicio);
      const fin = formatoHora(horaFin);

      const fechaInicio = new Date(selectedDate);
      fechaInicio.setHours(inicio.h, inicio.m, 0, 0);

      const fechaFin = new Date(selectedDate);
      fechaFin.setHours(fin.h, fin.m, 0, 0);

      await axios.put(`${API_URL}/reservas/${reservaSeleccionada.id}`, {
        fechaInicio,
        fechaFin,
        idSala: salaSeleccionada
      });

      alert("Reserva ajustada correctamente");
      setShowEditar(false);
      limpiarFormulario();
      setReservaSeleccionada(null);
      await cargarReservasDelDia(selectedDate);
    } catch (error) {
      console.error("Error al ajustar reserva:", error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.errores?.join("\n") ||
        "Error al ajustar reserva"
      );
    }
  };

  const handleCancelarReserva = async () => {
    if (!reservaSeleccionada) {
      alert("Debes seleccionar una reserva para cancelar");
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas cancelar la reserva de la sala ${reservaSeleccionada.idSala}?`
    );

    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}/reservas/${reservaSeleccionada.id}`);
      alert("Reserva cancelada correctamente");
      setReservaSeleccionada(null);
      await cargarReservasDelDia(selectedDate);
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al cancelar reserva"
      );
    }
  };

  return (
    <div className="grContainer">
      <NavbarGestionSalas userRole={user?.rol || ""} />

      <div className="grContent">
        <div className="threeColumnLayout">

          <div className="leftColumnSelected">
            <div className="selectedDateCard">
              <h3 className="selectedDateTitle">Fecha Seleccionada</h3>
              {selectedDate ? (
                <div className="selectedDateContent">
                  <div className="selectedDateDay">
                    <span className="dayNumberLarge">{selectedDate.getDate()}</span>
                  </div>
                  <div className="selectedDateDetails">
                    <p className="selectedDateFull">
                      {selectedDate.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div
                      className="selectedDateStatus"
                      style={{
                        backgroundColor: getStatusBackgroundColor(getAvailabilityStatus(selectedDate)),
                        color: getStatusColor(getAvailabilityStatus(selectedDate))
                      }}
                    >
                      {getStatusText(getAvailabilityStatus(selectedDate))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="noDateSelected">
                  <p>No hay fecha seleccionada</p>
                  <p className="hintText">Haz clic en un día del calendario</p>
                </div>
              )}
            </div>

            <div className="secondaryCard">
              <h4>Reservas del {selectedDate?.toLocaleDateString()}</h4>

              {!selectedDate ? (
                <p>Selecciona un día para ver las reservas</p>
              ) : reservasDelDia.length === 0 ? (
                <p>No hay reservas para este día</p>
              ) : (
                <ul className="reservasList">
                  {reservasDelDia.map((reserva) => (
                    <li
                      key={reserva.id}
                      onClick={() => setReservaSeleccionada(reserva)}
                      className={`reservaItem ${reservaSeleccionada?.id === reserva.id ? "reservaSeleccionada" : ""}`}
                      style={{
                        cursor: "pointer",
                        border: reservaSeleccionada?.id === reserva.id
                          ? "2px solid #3b82f6"
                          : "1px solid transparent"
                      }}
                    >
                      <span><strong>{reserva.idSala}</strong></span>
                      <span>
                        {new Date(reserva.fechaInicio).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} -{" "}
                        {new Date(reserva.fechaFin).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="centerColumn">
            <div className="calendarContainerSmall">
              <div className="calendarHeaderSmall">
                <button className="monthNavBtnSmall" onClick={handlePrevMonth}>←</button>
                <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                <button className="monthNavBtnSmall" onClick={handleNextMonth}>→</button>
              </div>

              <div className="calendarWeekDaysSmall">
                {dayNames.map(day => (
                  <div key={day} className="weekDaySmall">{day}</div>
                ))}
              </div>

              <div className="calendarDaysSmall">
                {days.map((day, index) => {
                  const isSelected = selectedDate && isSameDate(day.date, selectedDate);

                  return (
                    <div
                      key={index}
                      className={`calendarDaySmall ${!day.isCurrentMonth ? "otherMonthSmall" : ""}
                        ${isSelected ? "selectedSmall" : ""} ${day.isCurrentMonth ? "clickableSmall" : ""}`}
                      onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                    >
                      <span className="dayNumberSmall">{day.date.getDate()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rightColumn">
            <div className="buttonsVertical">
              <button
                className="reservaBtnVertical crearBtn"
                onClick={abrirModalCrear}
              >
                Crear
              </button>

              <button
                className="reservaBtnVertical ajustarBtn"
                onClick={() => {
                  if (!selectedDate) {
                    alert("Debes seleccionar un día antes de ajustar la reserva");
                    return;
                  }
                  abrirModalEditar();
                }}
              >
                Ajustar
              </button>

              <button
                className="reservaBtnVertical cancelarBtn"
                onClick={() => {
                  if (!selectedDate) {
                    alert("Debes seleccionar un día antes de cancelar la reserva");
                    return;
                  }
                  handleCancelarReserva();
                }}
              >
                Cancelar
              </button>

              <button
                className="reservaBtnVertical consultarBtn"
                onClick={() => setShowConsultar(true)}
              >
                Consultar
              </button>

              {user?.rol?.toLowerCase() === "secretaria" && (
                <button
                  className="reservaBtnVertical historialBtn"
                  onClick={() => setShowHistorial(true)}
                >
                  Historial
                </button>
              )}

            </div>

            <div className="legendContainer">
              <h4 className="legendTitle">Estado</h4>
              <div className="legendItems">
                <div className="legendItem"><div className="legendColor disponible"></div><span>Disponible</span></div>
                <div className="legendItem"><div className="legendColor ocupado"></div><span>Ocupado</span></div>
                <div className="legendItem"><div className="legendColor inhabilitado"></div><span>Inhabilitado</span></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showCrear && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>Crear Reserva</h3>

            <div className="modalField">

              <div className="fieldRow">
                <label>Hora Inicio:</label>
                <select value={horaInicio} onChange={e => setHoraInicio(e.target.value)}>
                  {opcionesHora.map((hora, i) => (
                    <option key={i} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>

              <div className="fieldRow">
                <label>Hora Fin:</label>
                <select value={horaFin} onChange={e => setHoraFin(e.target.value)}>
                  {opcionesHora.map((hora, i) => (
                    <option key={i} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>

              <div className="fieldRow">
                <label>Sala:</label>
                <select
                  value={salaSeleccionada}
                  onChange={e => setSalaSeleccionada(e.target.value)}
                >
                  <option value="">-- Selecciona sala --</option>
                  {salas.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nombre || s.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔥 SOLO SECRETARIA VE ESTO */}
              {user?.rol?.toLowerCase() === "secretaria" && (
                <div className="fieldRow">
                  <label>Docente:</label>
                  <select
                    value={docenteSeleccionado}
                    onChange={(e) => setDocenteSeleccionado(e.target.value)}
                  >
                    <option value="">-- Selecciona docente --</option>
                    {docentes.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.correo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            </div>

            <button className="modalPrimaryBtn" onClick={handleCrearReserva}>
              Crear
            </button>

            <button
              className="modalCloseBtn"
              onClick={() => {
                setShowCrear(false);
                limpiarFormulario();
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showEditar && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>Ajustar Reserva</h3>

            <div className="modalField">
              <div className="fieldRow">
                <label>Hora Inicio:</label>
                <select value={horaInicio} onChange={e => setHoraInicio(e.target.value)}>
                  {opcionesHora.map((hora, i) => (
                    <option key={i} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>

              <div className="fieldRow">
                <label>Hora Fin:</label>
                <select value={horaFin} onChange={e => setHoraFin(e.target.value)}>
                  {opcionesHora.map((hora, i) => (
                    <option key={i} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>

              <div className="fieldRow">
                <label>Sala:</label>
                <select value={salaSeleccionada} onChange={e => setSalaSeleccionada(e.target.value)}>
                  <option value="">-- Selecciona sala --</option>
                  {salas.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nombre || s.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="modalPrimaryBtn" onClick={handleActualizarReserva}>Guardar cambios</button>
            <button
              className="modalCloseBtn"
              onClick={() => {
                setShowEditar(false);
                limpiarFormulario();
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showConsultar && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>Consultar Disponibilidad</h3>

            <div className="modalField">

              <div className="fieldRow">
                <label>Sala</label>
                <select
                  value={salaConsulta}
                  onChange={(e) => setSalaConsulta(e.target.value)}
                >
                  <option value="">-- Selecciona sala --</option>
                  {salas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre || s.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fieldRow">
                <label>Fecha</label>
                <input
                  type="date"
                  value={fechaConsulta}
                  onChange={(e) => setFechaConsulta(e.target.value)}
                />
              </div>

            </div>

            <button className="modalPrimaryBtn" onClick={generarDisponibilidad}>
              Consultar
            </button>

            {disponibilidad.length > 0 && (
              <div className="disponibilidadWrapper">

              <div className="disponibilidadGrid">
                {disponibilidad.map((bloque, i) => (
                  <div
                    key={i}
                    className={`bloqueHora ${
                      bloque.estado === "OCUPADO" ? "ocupado" : "disponible"
                    }`}
                    title={`${bloque.hora} → ${bloque.estado}`}
                  />
                ))}
              </div>

              <div className="horasLabels">
                {disponibilidad.map((bloque, i) =>
                  i % 2 === 0 ? (
                    <span key={i}>{bloque.hora}</span>
                  ) : null
                )}
              </div>

            </div>
            )}

            <button
              className="modalCloseBtn"
              onClick={() => {
                setShowConsultar(false);
                setDisponibilidad([]);
                setSalaConsulta("");
                setFechaConsulta("");
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showHistorial && (
        <div className="modalOverlay">

          <div className="historialModal">

            {/* HEADER */}
            <div className="historialHeader">
              <h3 className="historialTitle">
                Historial de Reservas
              </h3>

              <button
                className="historialCloseBtn"
                onClick={() => setShowHistorial(false)}
              >
                ×
              </button>
            </div>

            {/* FILTROS */}
            <div className="historialFilters">

              <div className="historialFiltersGrid">

                <div className="historialField">
                  <label>Sala</label>

                  <select
                    className="historialInput"
                    value={filtroSala}
                    onChange={(e) => setFiltroSala(e.target.value)}
                  >
                    <option value="">Todas</option>

                    {salas.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre || s.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="historialField">
                  <label>Estado</label>

                  <select
                    className="historialInput"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>
                </div>

                <div className="historialField">
                  <label>Fecha Inicio</label>

                  <input
                    className="historialInput"
                    type="date"
                    value={filtroFechaInicio}
                    onChange={(e) => setFiltroFechaInicio(e.target.value)}
                  />
                </div>

                <div className="historialField">
                  <label>Fecha Fin</label>

                  <input
                    className="historialInput"
                    type="date"
                    value={filtroFechaFin}
                    onChange={(e) => setFiltroFechaFin(e.target.value)}
                  />
                </div>

              </div>

              <div className="historialButtons">

                <button
                  className="historialBtn historialBtnBuscar"
                  onClick={async () => {
                    try {

                      const params = {};

                      if (filtroSala) params.idSala = filtroSala;
                      if (filtroEstado) params.estado = filtroEstado;
                      if (filtroFechaInicio) params.fechaInicio = filtroFechaInicio;
                      if (filtroFechaFin) params.fechaFin = filtroFechaFin;

                      const res = await axios.get(
                        `${API_URL}/reservas/historial/facultad`,
                        { params }
                      );

                      setHistorialReservas(res.data);

                    } catch (error) {
                      console.error(error);
                      alert("Error al consultar historial");
                    }
                  }}
                >
                  Buscar
                </button>

              </div>
            </div>

            {/* TABLA */}
            <div className="historialTableContainer">

              {historialReservas.length === 0 ? (

                <div className="historialEmpty">
                  <span style={{ fontSize: "32px" }}>🗂️</span>
                  <p>No hay reservas</p>
                </div>

              ) : (

                <table className="historialTable">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Sala</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Estado</th>
                      <th>Usuario</th>
                    </tr>
                  </thead>

                  <tbody>

                    {historialReservas.map((r) => (

                      <tr key={r.id}>

                        <td>{r.id}</td>

                        <td>
                          {
                            salas.find(s => s.id == r.idSala)?.nombre || r.idSala
                          }
                        </td>

                        <td>
                          {new Date(r.fechaInicio).toLocaleString()}
                        </td>

                        <td>
                          {new Date(r.fechaFin).toLocaleString()}
                        </td>

                        <td>
                          <span className={
                            r.estado === "ACTIVA"
                              ? "estadoBadge estadoActiva"
                              : "estadoBadge estadoCancelada"
                          }>
                            {r.estado}
                          </span>
                        </td>

                        <td>
                          {
                            usuarios.find(u => u.id == r.idUsuario)?.correo || r.idUsuario
                          }
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </div>
      )}

      <div className="footergr">
        <Link to="/Secretaria">
          <img src={devolver} alt="devolver" className="devolvergr" />
        </Link>
      </div>
    </div>
  );
}

export default GestionarReservas;