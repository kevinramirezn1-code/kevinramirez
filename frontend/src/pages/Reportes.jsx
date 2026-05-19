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

    const generarReporte = async () => {

        if (
            !numeroReservas
        ) {

            return alert(
            'Debe ingresar un número'
            );

        }

        if (
            Number(numeroReservas) < 1
        ) {

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

        {

          tabActiva === 'historial' && (

            <div className="reportesCard">

              <div className="placeholderTab">

                Próximamente:
                historial de reservas

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