import { useState } from 'react';
import axios from 'axios';
import '../styles/Reportes.css';
import NavbarGestionSalas from '../components/NavbarGestionSalas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reportes = () => {
    const [tabActiva,setTabActiva] = useState('horas');
    const [numeroReservas,setNumeroReservas] = useState('');
    const [reporte,setReporte] = useState([]);
    const [loading,setLoading] = useState(false);

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const [docentes, setDocentes] = useState([]);
    const [salas, setSalas] = useState([]);
    const [ocupacion, setOcupacion] = useState([]);
    const [mostrarReportes, setMostrarReportes] = useState(false);

    const generarTodoElHistorial = async () => {
        try {
            const [docRes, salaRes, ocRes] = await Promise.all([
            fetch(`/api/reservas/reportes/docentes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
            fetch(`/api/reservas/reportes/salas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
            fetch(`/api/reservas/reportes/ocupacion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
            ]);

            const docentesData = await docRes.json();
            const salasData = await salaRes.json();
            const ocupacionData = await ocRes.json();

            setDocentes(docentesData);
            setSalas(salasData);
            setOcupacion(ocupacionData);

        } catch (error) {
            console.log(error);
            alert("Error generando el historial completo");
        }
    };

    const generarReporte = async () => {
        if (!numeroReservas){
            return alert(
            'Debe ingresar un número'
            );
        }

        if (Number(numeroReservas) < 1){
            return alert(
            'El número debe ser mayor a cero'
            );
        }

        try {
            setLoading(true);
            const response =
            await axios.get(
                'http://localhost:3001/api/reservas/reportes/reservas',
                {
                params: {
                    numeroReservas
                }
                }
            );
            setReporte(
            response.data
            );

        } catch(error) {
            console.log(error);
            alert(
            error.response?.data?.error ||
            'Error generando reporte'
            );

        } finally {
            setLoading(false);
        }
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

  // =========================
  // 🔹 DOCENTES
  // =========================
  if (docentes.length > 0) {
    doc.setFontSize(14);
    doc.text("Uso por Docentes", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Docente", "Horas", "Reservas"]],
      body: docentes.map(d => [
        d.docente,
        d.horas.toFixed(2),
        d.reservas
      ])
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  // =========================
  // 🔹 SALAS
  // =========================
  if (salas.length > 0) {
    doc.setFontSize(14);
    doc.text("Uso por Salas", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Sala", "Horas", "Reservas"]],
      body: salas.map(s => [
        s.sala,
        s.horas.toFixed(2),
        s.reservas
      ])
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  // =========================
  // 🔹 OCUPACIÓN
  // =========================
  if (ocupacion.length > 0) {
    doc.setFontSize(14);
    doc.text("Ocupación de Salas", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Sala", "Horas ocupadas", "Horas disponibles", "%"]],
      body: ocupacion.map(o => [
        o.sala,
        o.horasOcupadas.toFixed(2),
        o.horasDisponibles,
        o.porcentaje + "%"
      ])
    });
  }

  doc.save("reporte-completo-reservas.pdf");
};
    
 const descargarPDF = () => {
    if (
        reporte.length === 0
    ) {
        return alert(
            'No hay datos para descargar'
        );
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(
        'Reporte de Reservas',
        14,
        20
    );

    doc.setFontSize(12);
    doc.text(
        `Número mínimo de reservas: ${numeroReservas}`, 14,35 );
    autoTable(doc, {
        startY: 55,
        head: [[
        'Sala',
        'Número de reservas'
        ]],
        body:
        reporte.map(item => [
            `Sala ${item.sala}`,
            item.numeroReservas
        ])
    });

    doc.save(
        'reporte-reservas.pdf'
    );

 };

  return (

    <div className="reportesContainer">

      <NavbarGestionSalas />

      <div className="mainContent">

        <div className="welcomeSection">

          <h1 className="titulo">

            Reporte de Reservas

          </h1>

          <p className="subtitulo">

            Consulta el número de reservas por sala

          </p>

          <div className="linea"></div>

        </div>

        <div className="tabsContainer">

          <button
            className={
              tabActiva === 'horas'
              ? 'tab active'
              : 'tab'
            }
            onClick={()=>
              setTabActiva('horas')
            }
          >

            Número de Reservas

          </button>

          <button
            className={
              tabActiva === 'historial'
              ? 'tab active'
              : 'tab'
            }
            onClick={()=>
              setTabActiva('historial')
            }
          >

            Historial

          </button>

          <button
            className={
              tabActiva === 'canceladas'
              ? 'tab active'
              : 'tab'
            }
            onClick={()=>
              setTabActiva('canceladas')
            }
          >

            Canceladas

          </button>

        </div>

        {
          tabActiva === 'horas' && (
            <div className="reportesCard">
              <div className="reportesFiltros">
                <div className="campoFiltro">
                    <label>
                        Número mínimo de reservas
                    </label>
                    <input
                    type="number"
                    min="1"
                    value={numeroReservas}
                    onChange={(e)=>
                        setNumeroReservas(
                        e.target.value
                        )
                    }
                    />
                    </div>
                </div>
              <button
                className="btnGenerar"
                onClick={generarReporte}
              >
                {
                  loading
                  ? 'Generando...'
                  : 'Generar reporte'
                }
              </button>
              <button
                className="btnPDF"
                onClick={descargarPDF}
              >
                Descargar PDF
              </button>
              <div className="tablaContainer">
                {
                  reporte.length > 0 ? (
                    <table className="tablaReportes">
                      <thead>
                        <tr>
                          <th>
                            Sala
                          </th>
                          <th>
                            Número de reservas
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          reporte.map((item,index)=>(
                            <tr key={index}>
                              <td>
                                Sala {
                                  item.sala
                                }
                              </td>
                              <td>
                                <span className="badgeHoras">
                                  {
                                    item.numeroReservas
                                  }
                                </span>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  ) : (
                    <div className="sinDatos">
                      No hay datos
                      para mostrar
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
            {tabActiva === 'historial' && (
                <div className="reportesCard">

                <div className="placeholderTab">

                    <div className="historialContainer">

                    <h3 className="tituloHistorial">
                        Reportes de Reservas
                    </h3>

                    {/* FILTROS */}
                    <div className="filtrosHistorial">

                        <div className="campoFecha">
                        <label>Fecha inicio</label>

                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) =>
                            setFechaInicio(e.target.value)
                            }
                        />
                        </div>

                        <div className="campoFecha">
                        <label>Fecha fin</label>

                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) =>
                            setFechaFin(e.target.value)
                            }
                        />
                        </div>

                    </div>

                    {/* BOTONES */}
                    <div className="botonesHistorial">

                        <button
                        className="btnGenerarHistorial"
                        onClick={generarTodoElHistorial}
                        >
                        Generar reporte
                        </button>

                        <button
                        className="btnPDFHistorial"
                        onClick={descargarPDFHistorial}
                        >
                        Descargar PDF completo
                        </button>

                    </div>

                    {/* DOCENTES */}
                    {
                        docentes.length > 0 && (
                        <div className="tablaSeccion">

                            <h4 className="tituloTabla">
                            Uso por Docentes
                            </h4>

                            <table className="tablaReportes">

                            <thead>
                                <tr>
                                <th>Docente</th>
                                <th>Horas</th>
                                <th>Reservas</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                docentes.map((d, i) => (
                                    <tr key={i}>
                                    <td>{d.docente}</td>
                                    <td>{d.horas.toFixed(2)}</td>
                                    <td>{d.reservas}</td>
                                    </tr>
                                ))
                                }
                            </tbody>

                            </table>

                        </div>
                        )
                    }

                    {/* SALAS */}
                    {
                        salas.length > 0 && (
                        <div className="tablaSeccion">

                            <h4 className="tituloTabla">
                            Uso por Salas
                            </h4>

                            <table className="tablaReportes">

                            <thead>
                                <tr>
                                <th>Sala</th>
                                <th>Horas</th>
                                <th>Reservas</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                salas.map((s, i) => (
                                    <tr key={i}>
                                    <td>{s.sala}</td>
                                    <td>{s.horas.toFixed(2)}</td>
                                    <td>{s.reservas}</td>
                                    </tr>
                                ))
                                }
                            </tbody>

                            </table>

                        </div>
                        )
                    }

                    {/* OCUPACIÓN */}
                    {
                        ocupacion.length > 0 && (
                        <div className="tablaSeccion">

                            <h4 className="tituloTabla">
                            Ocupación de Salas
                            </h4>

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
                                {
                                ocupacion.map((o, i) => (
                                    <tr key={i}>
                                    <td>{o.sala}</td>
                                    <td>{o.horasOcupadas.toFixed(2)}</td>
                                    <td>{o.horasDisponibles}</td>
                                    <td>{o.porcentaje}%</td>
                                    </tr>
                                ))
                                }
                            </tbody>

                            </table>

                        </div>
                        )
                    }

                    {
                        docentes.length === 0 &&
                        salas.length === 0 &&
                        ocupacion.length === 0 && (
                        <div className="sinDatosHistorial">
                            No hay reportes generados
                        </div>
                        )
                    }

                    </div>

                </div>

                </div>
            )
            }
        {
          tabActiva === 'canceladas' && (
            <div className="reportesCard">
              <div className="placeholderTab">
                Próximamente:
                reservas canceladas
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Reportes;