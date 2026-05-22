import { useState } from 'react';
import axios from 'axios';
import '../styles/Reportes.css';
import NavbarGestionSalas from '../components/NavbarGestionSalas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import devolver from '../assets/images/devolver.png';
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const Reportes = () => {
  const [tabActiva, setTabActiva] = useState('horas');

  // ===== ESTADO: NÚMERO DE RESERVAS =====
  const [numeroReservas, setNumeroReservas] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // ===== ESTADO: HISTORIAL DE HORAS =====
  const [fechaInicioHistorial, setFechaInicioHistorial] = useState('');
  const [fechaFinHistorial, setFechaFinHistorial] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [ocupacion, setOcupacion] = useState([]);

  // ===== ESTADO: HISTORIAL DE USUARIOS ====
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const usuariosUnicos = [
    ...new Set(
      usuarios.map((u) => u.docente)
      )
     ];
  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  // ===== LÓGICA: NÚMERO DE RESERVAS =====
  const generarReporte = async () => {
    if (!numeroReservas) return alert('Debe ingresar un número');
    if (Number(numeroReservas) < 1) return alert('El número debe ser mayor a cero');
    if (!fechaInicio || !fechaFin) return alert('Debe seleccionar fecha inicio y fecha fin');

    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:3001/api/reservas/reportes/reservas',
        { params: { numeroReservas, fechaInicio, fechaFin } }
      );
      setReporte(response.data);
      setPaginaActual(1);
      setBusquedaRealizada(true);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || 'Error generando reporte');
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = () => {
    if (reporte.length === 0) return alert('No hay datos para descargar');
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Reportes', 14, 20);
    doc.setFontSize(12);
    doc.text(`Número mínimo de reservas: ${numeroReservas}`, 14, 35);
    if (fechaInicio) doc.text(`Desde: ${fechaInicio}`, 14, 43);
    if (fechaFin)    doc.text(`Hasta: ${fechaFin}`,    14, 51);
    autoTable(doc, {
      startY: 60,
      head: [['Sala', 'Número de reservas']],
      body: reporte.map((item) => [`Sala ${item.sala}`, item.numeroReservas]),
    });
    doc.save('reporte-reservas.pdf');
  };

  // Paginación
  const totalPaginas = Math.ceil(reporte.length / ITEMS_PER_PAGE);
  const indiceInicio = (paginaActual - 1) * ITEMS_PER_PAGE;
  const indiceFin    = indiceInicio + ITEMS_PER_PAGE;
  const reportePagina = reporte.slice(indiceInicio, indiceFin);

  const usuariosFiltrados =
  usuarioSeleccionado === 'todos'
    ? usuarios
    : usuarios.filter(
        u => u.docente === usuarioSeleccionado
      );

  const totalPaginasUsuarios = Math.ceil(
  usuariosFiltrados.length / ITEMS_PER_PAGE
      );

  const indiceInicioUsuarios =
  (paginaUsuarios - 1) * ITEMS_PER_PAGE;

  const indiceFinUsuarios =
  indiceInicioUsuarios + ITEMS_PER_PAGE;

  const usuariosPagina = usuariosFiltrados.slice(
  indiceInicioUsuarios,
  indiceFinUsuarios
    );

  // ===== LÓGICA: HISTORIAL DE HORAS =====
  const generarTodoElHistorial = async () => {
    if (!fechaInicioHistorial || !fechaFinHistorial) {
      return alert('Debe seleccionar fecha inicio y fecha fin');
    }

    try {
      setLoadingHistorial(true);

      const params = new URLSearchParams();
      params.append('fechaInicio', fechaInicioHistorial);
      params.append('fechaFin',    fechaFinHistorial);
      const qs = `?${params.toString()}`;

      const [docRes, salaRes, ocRes] = await Promise.all([
        fetch(`http://localhost:3001/api/reservas/reportes/docentes${qs}`),
        fetch(`http://localhost:3001/api/reservas/reportes/salas${qs}`),
        fetch(`http://localhost:3001/api/reservas/reportes/ocupacion${qs}`)
      ]);

      const [docentesData, salasData, ocupacionData] = await Promise.all([
        docRes.json(),
        salaRes.json(),
        ocRes.json()
      ]);

      setDocentes(Array.isArray(docentesData) ? docentesData : []);
      setSalas(Array.isArray(salasData) ? salasData : []);
      setOcupacion(Array.isArray(ocupacionData) ? ocupacionData : []);
    } catch (error) {
      console.log(error);
      alert('Error generando el historial completo');
    } finally {
      setLoadingHistorial(false);
    }
  };

  // ===== LÓGICA: REPORTE POR USUARIOS =====
  const generarReporteUsuarios = async () => {

  if (!fechaInicioHistorial || !fechaFinHistorial) {
    return alert('Debe seleccionar fecha inicio y fecha fin');
  }

  try {

    setLoadingUsuarios(true);

    const params = new URLSearchParams();
    params.append('fechaInicio', fechaInicioHistorial);
    params.append('fechaFin', fechaFinHistorial);

    const response = await fetch(
      `http://localhost:3001/api/reservas/reportes/docentes?${params.toString()}`
    );

    const data = await response.json();

    setUsuarios(Array.isArray(data) ? data : []);

  } catch (error) {

    console.log(error);

    alert('Error generando reporte por usuario');

  } finally {

    setLoadingUsuarios(false);

  }

  };

  const descargarPDFUsuarios = () => {

  if (usuarios.length === 0) {
    return alert("No hay datos para generar el PDF");
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte por Usuario", 14, 20);

  let y = 30;

  doc.setFontSize(14);
  doc.text("Uso por Usuarios", 14, y);

  y += 5;

  autoTable(doc, {

    startY: y,

    head: [["Usuario", "Horas", "Reservas"]],

    body: usuarios.map(u => [
      u.docente,
      u.horas.toFixed(2),
      u.reservas
    ])

  });

  doc.save("reporte-usuarios.pdf");

  };

  const descargarPDFHistorial = () => {
    if (
      docentes.length === 0 &&
      salas.length === 0 &&
      ocupacion.length === 0
    ) {
      return alert("No hay datos para generar el PDF");
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte Completo de Reservas", 14, 20);

    let y = 30;

    if (docentes.length > 0) {
      doc.setFontSize(14);
      doc.text("Uso por Docentes", 14, y);
      y += 5;
      autoTable(doc, {
        startY: y,
        head: [["Docente", "Horas", "Reservas"]],
        body: docentes.map(d => [d.docente, d.horas.toFixed(2), d.reservas])
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (salas.length > 0) {
      doc.setFontSize(14);
      doc.text("Uso por Salas", 14, y);
      y += 5;
      autoTable(doc, {
        startY: y,
        head: [["Sala", "Horas", "Reservas"]],
        body: salas.map(s => [s.sala, s.horas.toFixed(2), s.reservas])
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (ocupacion.length > 0) {
      doc.setFontSize(14);
      doc.text("Ocupación de Salas", 14, y);
      y += 5;
      autoTable(doc, {
        startY: y,
        head: [["Sala", "Horas ocupadas", "Horas disponibles", "%"]],
        body: ocupacion.map(o => [o.sala, o.horasOcupadas.toFixed(2), o.horasDisponibles, o.porcentaje + "%"])
      });
    }

    doc.save("reporte-completo-reservas.pdf");
  };

  // ===== RENDER TABS =====
  const renderTabs = () => (
    <div className="tabsContainer">
      {[
        { id: 'horas',     label: 'Número de Reservas' },
        { id: 'historial', label: 'Uso por Horas Reservadas' },
        { id: 'usuarios', label: 'Reporte de uso por Usuarios' },
      ].map((tab) => (
        <button
          key={tab.id}
          className={tabActiva === tab.id ? 'tab active' : 'tab'}
          onClick={() => setTabActiva(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // ===== RENDER: NÚMERO DE RESERVAS =====
  const renderHoras = () => (
    <div className="reportesCard">
      <div className="reportesFiltros">
        <div className="campoFiltro">
          <label>Número mínimo de reservas</label>
          <input
            type="number"
            min="1"
            value={numeroReservas}
            onChange={(e) => setNumeroReservas(e.target.value)}
          />
        </div>
        <div className="campoFiltro">
          <label>Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="campoFiltro">
          <label>Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <div className="botonesAccion">
        <button className="btnGenerar" onClick={generarReporte}>
          {loading ? 'Generando...' : 'Generar reporte'}
        </button>
        <button className="btnPDF" onClick={descargarPDF}>
          Descargar PDF
        </button>
      </div>

      <div className="tablaContainer">
        {reporte.length > 0 ? (
          <>
            <table className="tablaReportes">
              <thead>
                <tr>
                  <th>Sala</th>
                  <th>Número de reservas</th>
                </tr>
              </thead>
              <tbody>
                {reportePagina.map((item, index) => (
                  <tr key={index}>
                    <td>Sala {item.sala}</td>
                    <td>
                      <span className="badgeHoras">{item.numeroReservas}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPaginas > 1 && (
              <div className="paginacion">
                <button
                  className="btnPagina"
                  onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                  disabled={paginaActual === 1}
                >
                  ‹
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    className={`btnPagina ${paginaActual === num ? 'activo' : ''}`}
                    onClick={() => setPaginaActual(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  className="btnPagina"
                  onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                  disabled={paginaActual === totalPaginas}
                >
                  ›
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="sinDatos">
            {busquedaRealizada
              ? `No hay salas con ${numeroReservas} o más reservas en el período seleccionado`
              : 'Ingrese los filtros y genere un reporte'}
          </div>
        )}
      </div>
    </div>
  );

  // ===== RENDER: HISTORIAL DE HORAS =====
  const renderHistorial = () => (
    <div className="reportesCard">
      <div className="reportesFiltros reportesFiltrosDos">
        <div className="campoFiltro">
          <label>Fecha inicio</label>
          <input
            type="date"
            value={fechaInicioHistorial}
            onChange={(e) => setFechaInicioHistorial(e.target.value)}
          />
        </div>
        <div className="campoFiltro">
          <label>Fecha fin</label>
          <input
            type="date"
            value={fechaFinHistorial}
            onChange={(e) => setFechaFinHistorial(e.target.value)}
          />
        </div>
      </div>

      <div className="botonesAccion">
        <button className="btnGenerar" onClick={generarTodoElHistorial} disabled={loadingHistorial}>
          {loadingHistorial ? 'Generando...' : 'Generar reporte'}
        </button>
        <button className="btnPDF" onClick={descargarPDFHistorial}>
          Descargar PDF completo
        </button>
      </div>

      <div className="tablaContainer">
        {docentes.length === 0 && salas.length === 0 && ocupacion.length === 0 ? (
          <div className="sinDatos">Ingrese los filtros y genere un reporte</div>
        ) : (
          <>
            {docentes.length > 0 && (
              <div className="tablaSeccion">
                <h4 className="tituloTabla">Uso por Docentes</h4>
                <table className="tablaReportes">
                  <thead>
                    <tr>
                      <th>Docente</th>
                      <th>Horas</th>
                      <th>Reservas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docentes.map((d, i) => (
                      <tr key={i}>
                        <td>{d.docente}</td>
                        <td>{d.horas.toFixed(2)}</td>
                        <td>{d.reservas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {salas.length > 0 && (
              <div className="tablaSeccion">
                <h4 className="tituloTabla">Uso por Salas</h4>
                <table className="tablaReportes">
                  <thead>
                    <tr>
                      <th>Sala</th>
                      <th>Horas</th>
                      <th>Reservas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salas.map((s, i) => (
                      <tr key={i}>
                        <td>{s.sala}</td>
                        <td>{s.horas.toFixed(2)}</td>
                        <td>{s.reservas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {ocupacion.length > 0 && (
              <div className="tablaSeccion">
                <h4 className="tituloTabla">Ocupación de Salas</h4>
                <table className="tablaReportes">
                  <thead>
                    <tr>
                      <th>Sala</th>
                      <th>Horas ocupadas</th>
                      <th>Horas disponibles</th>
                      <th>% ocupación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocupacion.map((o, i) => (
                      <tr key={i}>
                        <td>{o.sala}</td>
                        <td>{o.horasOcupadas.toFixed(2)}</td>
                        <td>{o.horasDisponibles}</td>
                        <td>{o.porcentaje}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderUsuarios = () => (
  <div className="reportesCard">
    <div className="reportesFiltros reportesFiltrosTres">
  <div className="campoFiltro">
  <label>Fecha inicio</label>
  <input
    type="date"
    value={fechaInicioHistorial}
    onChange={(e) =>
      setFechaInicioHistorial(e.target.value)
    }
  />
  </div>
  <div className="campoFiltro">
  <label>Fecha fin</label>
  <input
    type="date"
    value={fechaFinHistorial}
    onChange={(e) =>
      setFechaFinHistorial(e.target.value)
    }
  />
   </div>
  <div className="campoFiltro">
   <label>Usuario</label>
    <select
     value={usuarioSeleccionado}
     onChange={(e) => {
       setUsuarioSeleccionado(e.target.value);
        setPaginaUsuarios(1);
     }}
   >
    <option value="" disabled hidden>
      Seleccionar usuario
      </option>
    <option value="todos">
      Todos
      </option>
      {
       usuariosUnicos.map((u, i) => (
          <option
            key={i}
            value={u}
          >
            {u}
         </option>
       ))
     }
    </select>
  </div>
    </div>
    <div className="botonesAccion">
      <button
        className="btnGenerar"
        onClick={generarReporteUsuarios}
        disabled={loadingUsuarios}
      >
        {
          loadingUsuarios
            ? 'Generando...'
            : 'Generar reporte'
        }
      </button>
      <button
        className="btnPDF"
        onClick={descargarPDFUsuarios}
      >
        Descargar PDF
      </button>
    </div>
    <div className="tablaContainer">
      {
        usuarios.length === 0 ? (
          <div className="sinDatos">
            Ingrese los filtros y genere un reporte
          </div>
        ) : (
          <>
            <table className="tablaReportes">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Horas</th>
                  <th>Reservas</th>
                </tr>
              </thead>
              <tbody>
                {
                  usuariosPagina.map((u, i) => (
                    <tr key={i}>
                      <td>{u.docente}</td>
                      <td>
                        {u.horas.toFixed(2)}
                      </td>
                      <td>{u.reservas}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            {
              totalPaginasUsuarios > 1 && (
                <div className="paginacion">
                  <button
                    className="btnPagina"
                    onClick={() =>
                      setPaginaUsuarios((p) =>
                        Math.max(p - 1, 1)
                      )
                    }
                    disabled={paginaUsuarios === 1}
                  >
                    ‹
                  </button>
                  {
                    Array.from(
                      { length: totalPaginasUsuarios },
                      (_, i) => i + 1
                    ).map((num) => (

                      <button
                        key={num}
                        className={`btnPagina ${
                          paginaUsuarios === num
                            ? 'activo'
                            : ''
                        }`}
                        onClick={() =>
                          setPaginaUsuarios(num)
                        }
                      >
                        {num}
                      </button>
                    ))
                  }
                  <button
                    className="btnPagina"
                    onClick={() =>
                      setPaginaUsuarios((p) =>
                        Math.min(
                          p + 1,
                          totalPaginasUsuarios
                        )
                      )
                    }
                    disabled={
                      paginaUsuarios === totalPaginasUsuarios
                    }
                  >
                    ›
                  </button>
                </div>
              )
            }
          </>
        )
      }
    </div>
  </div>
  );

  const renderContent = () => {
    if (tabActiva === 'horas')      return renderHoras();
    if (tabActiva === 'historial')  return renderHistorial();
    if (tabActiva === 'usuarios') return renderUsuarios();
  };

  return (
    <div className="reportesContainer">
      <NavbarGestionSalas />

      <div className="mainContent">
        <div className="welcomeSection">
          <h1 className="titulo">Reportes</h1>
          <div className="linea"></div>
        </div>

        <div className="layoutDosColumnas">
          {renderTabs()}
          {renderContent()}
        </div>
      </div>

      <div className="footergr">
        <Link to="/Secretaria">
          <img src={devolver} alt="devolver" className="devolvergr" />
        </Link>
      </div>
    </div>
  );
};

export default Reportes;