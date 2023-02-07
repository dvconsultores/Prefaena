import { openDatabase } from "react-native-sqlite-storage";
import { Alert } from "react-native";

const db = openDatabase({ name: "prefaena.db" });

class Operations {

  ExecuteQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction((trans) => {
        trans.executeSql(
          sql,
          params,
          (trans, results) => {
            resolve(results);
          },
          (error) => {
            reject(error);
            // console.log("error ------ " + error.code)
            if(error.message == "UNIQUE constraint failed: TicketsDetalle.GalponReal (code 2067 SQLITE_CONSTRAINT_UNIQUE)"){
            return Alert.alert(
              "Mensaje",
              "No puede ingresar el mismo número de galpón intente con otro"
            );
            }
          }
        );
      });
    });
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////TICKETS/////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////

  async InsertTickets(list) {
    //Delete before insert
    this.DeleteTickets();
    if (list.length > 0) {
      let query =
        "insert into tickets(" +
        " IdPDA" +
        " , IdMetodoRecolec" +
        " , NumTicket" +
        " , NumOrdenTrans" +
        " , PlacaVehiculo" +
        " , FechaRecoleccion" +
        " , FLEstatus" +
        " , Conductor" +
        " , Remolque1" +
        " , Remolque2" +
        " , GranjaLote" +
        " , desGranja" +
        " , IdCuadrillaProgramado" +
        " , DesCuadrilla" +
        " , FechaProgramacion" +
        " , TotalAnimales" +
        " , CantidadJaulas" +
        " , AnimalesPJaulas" +
        " , Observaciones" +
        " , FechaEntradaCuadrilla" +
        " , FechaInicioRecepcion" +
        " , FechaFinalRecepcion" +
        " , FechaEntradaTransporte" +
        " , FechaSalidaTransporte" +
        " , IdCuadrillaReal" +
        " , NR_GAIOVAZIORDEPESA" +
        " , MetodoRecolecReal" +
        " , FLEstatusPda" +
        " , FechaSincronizacionPDA" +
        " , FechaSincronizacionPDA2" +
        " , IdMotivoCancelacion" +
        " , DesMotivoCancelacion" +
        " , ObserMotivoCancelacion" +
        " , FechaCancelacion" +
        " , IdUsuarioCancelacion, IdOrden) values";

      for (let i = 0; i < list.length; ++i) {
        query =
          query +
          "('" +
          list[i].IdPDA +
          "','" +
          list[i].IdMetodoRecolec +
          "','" +
          list[i].NumTicket +
          "','" +
          list[i].NumOrdenTrans +
          "','" +
          list[i].PlacaVehiculo +
          "','" +
          list[i].FechaRecoleccion +
          "','" +
          list[i].FLEstatus +
          "','" +
          list[i].Conductor +
          "','" +
          list[i].Remolque1 +
          "','" +
          list[i].Remolque2 +
          "','" +
          list[i].GranjaLote +
          "','" +
          list[i].desGranja +
          "','" +
          list[i].IdCuadrillaProgramado +
          "','" +
          list[i].DesCuadrilla +
          "','" +
          list[i].FechaProgramacion +
          "','" +
          list[i].TotalAnimales +
          "','" +
          list[i].CantidadJaulas +
          "','" +
          list[i].AnimalesPJaulas +
          "','" +
          list[i].Observaciones +
          "','" +
          list[i].FechaEntradaCuadrilla +
          "','" +
          list[i].FechaInicioRecepcion +
          "','" +
          list[i].FechaFinalRecepcion +
          "','" +
          list[i].FechaEntradaTransporte +
          "','" +
          list[i].FechaSalidaTransporte +
          "','" +
          list[i].IdCuadrillaReal +
          "','" +
          list[i].NR_GAIOVAZIORDEPESA +
          "','" +
          list[i].MetodoRecolecReal +
          "','" +
          list[i].FLEstatusPda +
          "','" +
          list[i].FechaSincronizacionPDA +
          "','" +
          list[i].FechaSincronizacionPDA2 +
          "','" +
          list[i].IdMotivoCancelacion +
          "','" +
          list[i].DesMotivoCancelacion +
          "','" +
          list[i].ObserMotivoCancelacion +
          "','" +
          list[i].FechaCancelacion +
          "','" +
          list[i].IdUsuarioCancelacion +
          "','" +
          list[i].IdOrden +
          "')";
        if (i != list.length - 1) {
          query = query + ",";
        }
      }
      query = query + ";";
      ////console.log(query);
      let multipleInsert = await this.ExecuteQuery(query, []);

      //console.log(multipleInsert);
      if (multipleInsert.rowsAffected == 1) {
        setTimeout(() => {
          let query =
            "update tickets" +
            " set FechaCancelacion = null, IdUsuarioCancelacion = null," +
            " NR_GAIOVAZIORDEPESA = null, Observaciones = null, Remolque1 = null," +
            " Remolque2 = null, MetodoRecolecReal = null, FechaSincronizacionPDA2 = null, FLEstatusPda = null," +
            " ObserMotivoCancelacion = null, FechaEntradaTransporte = null, FechaInicioRecepcion = null," +
            " FechaEntradaCuadrilla = null, FechaSalidaTransporte = null, FechaEntradaTransporte = null, FechaFinalRecepcion = null," +
            " IdMotivoCancelacion = null";
          this.ExecuteQuery(query, []);
        }, 300);
      } else {
        return setTimeout(() => {
          return Alert.alert(
            "Mensaje",
            "Problemas sincronizando data, intente de nuevo"
          );
        }, 300);
      }
    }
    setTimeout(() => {
      return Alert.alert("Mensaje", "Sincronización ejecutada");
    }, 500);
  }

  async InsertTicketsDetalle(list) {
    //Delete before insert
    this.DeleteTicketsDetalle();
    if (list.length > 0) {
      let query =
        "insert into TicketsDetalle(" +
        "  ID_GALPORDEPESA" +
        " , IdOrden" +
        " , GalponReal" +
        " , TotalAnimalesReal" +
        " , CantidadJaulasReal" +
        " , AnimalesPJaulasReal" +
        " , FechaRetiradaAlimento) values";

      for (let i = 0; i < list.length; ++i) {
        query =
          query +
          "('" +
          list[i].ID_GALPORDEPESA +
          "','" +
          list[i].IdOrden +
          "','" +
          list[i].GalponReal +
          "','" +
          list[i].TotalAnimalesReal +
          "','" +
          list[i].CantidadJaulasReal +
          "','" +
          list[i].AnimalesPJaulasReal +
          "','" +
          list[i].FechaRetiradaAlimento +
          "')";
        if (i != list.length - 1) {
          query = query + ",";
        }
      }
      query = query + ";";
      // console.log(query);
      let multipleInsert = await this.ExecuteQuery(query, []);
      if (multipleInsert.rowsAffected == 1) {
        setTimeout(() => {
          let query =
            "update TicketsDetalle" +
            " set FechaRetiradaAlimento = null, CantidadJaulasReal = null," +
            " TotalAnimalesReal = null, GalponReal = null, AnimalesPJaulasReal = null";
          this.ExecuteQuery(query, []);
        }, 300);
      }
    }
    //console.log(multipleInsert);
  }

  async InsertTicketsDetallenoSync(p1, p2, p3, p4, p5, p6, p7, p8, p9) {
    let query = "select * from TicketsDetalle where IdOrden = ? and GalponReal = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      p2,
      p3
    ]);
    var rows = selectQuery.rows;
    if (rows.length > 0) {
      Alert.alert(
        "Mensaje",
        "El galpón que intenta registrar ya existe."
      );
    } else if (Number(p6) < 3) {
      Alert.alert(
        "Mensaje",
        "El Valor debe ser mayor a 3 y menor a 16, intente nuevamente."
      );
    } else if (Number(p6) > 16) {
      Alert.alert(
        "Mensaje",
        "El Valor debe ser mayor a 3 y menor a 16, intente nuevamente."
      );
    } else {
      //Delete before insert
      let query =
        "insert into TicketsDetalle(" +
        "  ID_GALPORDEPESA" +
        " , IdOrden" +
        " , GalponReal" +
        " , TotalAnimalesReal" +
        " , CantidadJaulasReal" +
        " , AnimalesPJaulasReal" +
        " , FechaRetiradaAlimento) values";

      query =
        query +
        "('" +
        p1 +
        "','" +
        p2 +
        "','" +
        p3 +
        "','" +
        p4 +
        "','" +
        p5 +
        "','" +
        p6 +
        "','" +
        p7 +
        "')";
      query = query + ";";
      //console.log(query);

      let multipleInsert = await this.ExecuteQuery(query, []);

      // console.log(multipleInsert.rowsAffected);
      if (multipleInsert.rowsAffected == 1) {
        setTimeout(() => {
          let query1 =
            "update tickets" +
            " set  NR_GAIOVAZIORDEPESA = ? where NumTicket = ?";
          //console.log('Jaulas vacias ' + p8)
          this.ExecuteQuery(query1, [p8, p9]);
        }, 300);
        setTimeout(() => {
          return Alert.alert("Mensaje", "Registro guardado");
        }, 300);
      } else {
        return setTimeout(() => {
          return Alert.alert(
            "Mensaje",
            "Problemas ingresando data, intente de nuevo"
          );
        }, 300);
      }
    }
  }

  async InsertPrinter(p1) {
    //Delete before insert
    let query = "insert into Printer(" + "  mac) values";

    query = query + "('" + p1 + "')";
    query = query + ";";
    ////console.log(query);
    let multipleInsert = await this.ExecuteQuery(query, []);
    //console.log(multipleInsert);
    if (multipleInsert.rowsAffected == 1) {
      setTimeout(() => {
        return Alert.alert("Mensaje", "Registro guardado");
      }, 300);
    } else {
      return setTimeout(() => {
        return Alert.alert(
          "Mensaje",
          "Problemas ingresando data, intente de nuevo"
        );
      }, 300);
    }
  }

  async InsertMail(p1) {
    //Delete before insert
    let query = "insert into Mail(" + "  mail) values";

    query = query + "('" + p1 + "')";
    query = query + ";";
    ////console.log(query);
    let multipleInsert = await this.ExecuteQuery(query, []);
    //console.log(multipleInsert);
    if (multipleInsert.rowsAffected == 1) {
      setTimeout(() => {
        return Alert.alert("Mensaje", "Registro guardado");
      }, 300);
    } else {
      return setTimeout(() => {
        return Alert.alert(
          "Mensaje",
          "Problemas ingresando data, intente de nuevo"
        );
      }, 300);
    }
  }

  async InsertSincroCuadrilla(list) {
    //Delete before insert
    this.DeleteSincroCuadrilla();

    let query =
      "insert into SincroCuadrilla(" +
      " IdCuadrilla" +
      " , DesCuadrilla) values";

    for (let i = 0; i < list.length; ++i) {
      query =
        query +
        " ('" +
        list[i].IdCuadrilla +
        "','" +
        list[i].DesCuadrilla +
        "')";
      if (i != list.length - 1) {
        query = query + ",";
      }
    }
    query = query + ";";
    ////console.log(query);
    let multipleInsert = await this.ExecuteQuery(query, []);
    //console.log(multipleInsert);
  }

  async InsertSincroGalpones(list) {
    //Delete before insert
    this.DeleteSincroGalpones();

    let query =
      "insert into SincroGalpones(" +
      " Galpon" +
      " , GranjaLote) values";

    for (let i = 0; i < list.length; ++i) {
      query =
        query +
        " ('" +
        list[i].Galpon +
        "','" +
        list[i].GranjaLote +
        "')";
      if (i != list.length - 1) {
        query = query + ",";
      }
    }
    query = query + ";";
    ////console.log(query);
    let multipleInsert = await this.ExecuteQuery(query, []);
    //console.log(multipleInsert);
  }

  async InsertSincroMotivosCancelacion(list) {
    //Delete before insert
    this.DeleteMotivosCancelacion();

    let query =
      "insert into SincroMotivosCancelacion(" +
      " IdMotivoCancelacion" +
      " , DesMotivoCancelacion) values";

    for (let i = 0; i < list.length; ++i) {
      query =
        query +
        " ('" +
        list[i].IdMotivoCancelacion +
        "','" +
        list[i].DesMotivoCancelacion +
        "')";
      if (i != list.length - 1) {
        query = query + ",";
      }
    }
    query = query + ";";
    ////console.log(query);
    let multipleInsert = await this.ExecuteQuery(query, []);
    //console.log(multipleInsert);
  }

  async InsertSincroMetodoRecoleccion(list) {
    //Delete before insert
    this.DeleteSincroMetodoRecoleccion();

    let query =
      "insert into SincroMetodoRecoleccion(" +
      " IdMetodoRecolec" +
      " , desMetodoRecolec, AbrevMetodoRecolec) values";

    for (let i = 0; i < list.length; ++i) {
      query =
        query +
        " ('" +
        list[i].IdMetodoRecolec +
        "','" +
        list[i].desMetodoRecolec +
        "','" +
        list[i].AbrevMetodoRecolec +
        "')";
      if (i != list.length - 1) {
        query = query + ",";
      }
    }
    query = query + ";";
    ////console.log(query);
    let multipleInsert = await this.ExecuteQuery(query, []);
    //console.log(multipleInsert);
  }

  async DeleteTickets() {
    let query = "delete from tickets";
    let deleteOps = await this.ExecuteQuery(query, []);
    ////console.log(deleteOps);
  }

  async DeleteTicketsDetalle() {
    let query = "delete from TicketsDetalle";
    let deleteOps = await this.ExecuteQuery(query, []);
    ////console.log(deleteOps);
  }

  async DeleteSincroCuadrilla() {
    let query = "delete from SincroCuadrilla";
    let deleteOps = await this.ExecuteQuery(query, []);
    ////console.log(deleteOps);
  }

  async DeleteMotivosCancelacion() {
    let query = "delete from SincroMotivosCancelacion";
    let deleteOps = await this.ExecuteQuery(query, []);
    ////console.log(deleteOps);
  }

  async DeleteSincroGalpones() {
    let query = "delete from SincroGalpones";
    let deleteOps = await this.ExecuteQuery(query, []);
    ////console.log(deleteOps);
  }

  async DeleteSincroMetodoRecoleccion() {
    let query = "delete from SincroMetodoRecoleccion";
    let deleteOps = await this.ExecuteQuery(query, []);
    ////console.log(deleteOps);
  }

  async DeleteTicketsDetallenoSync(p1, p2, p3) {
    //Delete before insert
    let query = "delete from TicketsDetalle where id = ?";
    ////console.log(query);
    let multipleInsert = await this.ExecuteQuery(query, [p1]);
    //console.log(multipleInsert);
    if (multipleInsert.rowsAffected == 1) {
      setTimeout(() => {
        let query =
          "update tickets" +
          " set  NR_GAIOVAZIORDEPESA = ? where NumTicket = ?" +
          this.ExecuteQuery(query, [p2, p3]);
      }, 300);
      setTimeout(() => {
        return Alert.alert("Mensaje", "Registro eliminado");
      }, 300);
    } else {
      return setTimeout(() => {
        return Alert.alert(
          "Mensaje",
          "Problemas eliminando data, intente de nuevo"
        );
      }, 300);
    }
  }

  async UpdateSincroTickets(p1, p2, p4, p5, p6, p7, p8) {
    let query = "";
    let updateOps = "";

    let querySelect =
      "select case FechaInicioRecepcion when 'null' then ''  else FechaInicioRecepcion end FechaInicioRecepcion  from  tickets" +
      " where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(querySelect, [p7, p8]);
    var rows = selectQuery.rows;
    //console.log(p5.split(' - ')[0]);
    if (
      rows.item(0).FechaInicioRecepcion == null ||
      rows.item(0).FechaInicioRecepcion == ""
    ) {
      query =
        "update tickets" +
        " set FechaEntradaCuadrilla = ?" +
        " , FechaEntradaTransporte = ?" +
        " , FechaInicioRecepcion = ?" +
        " , DesCuadrilla = ?" +
        " , IdMetodoRecolec = ? , MetodoRecolecReal = ?, IdCuadrillaReal = ?" +
        " where NumTicket = ? and GranjaLote = ?";
      updateOps = await this.ExecuteQuery(query, [
        p1,
        p2,
        p4,
        p5,
        p6,
        p6,
        p5.split(" - ")[0],
        p7,
        p8,
      ]);
    } else {
      query =
        "update tickets" +
        " set FechaEntradaCuadrilla = ?" +
        " , FechaEntradaTransporte = ?" +
        " , DesCuadrilla = ?" +
        " , IdMetodoRecolec = ? , MetodoRecolecReal = ? , IdCuadrillaReal = ?" +
        " where NumTicket = ? and GranjaLote = ?";
      updateOps = await this.ExecuteQuery(query, [
        p1,
        p2,
        p5,
        p6,
        p6,
        p5.split(" - ")[0],
        p7,
        p8,
      ]);
    }
    //console.log(query);
    console.log(updateOps);
    if (updateOps.rowsAffected == 1) {
      setTimeout(() => {
        return Alert.alert("Mensaje", "Registro almacenado con éxito");
      }, 300);
    } else {
      return setTimeout(() => {
        return Alert.alert("Mensaje", "Error guardando, intente de nuevo");
      }, 300);
    }
  }

  async UpdateSincroTicketsStatusAbierto() {
    let query =
      "update tickets" +
      " set FLEstatus = 'AB'" +
      " , IdMotivoCancelacion = null" +
      " , DesMotivoCancelacion = null" +
      " , ObserMotivoCancelacion = null"
    let updateOps = await this.ExecuteQuery(query, []);
    //console.log(updateOps);
  }

  async UpdateSincroTicketsStatusCerrar(p1, p2, p3, p4, p5) {
    let querySelect =
      "select *  from  TicketsDetalle" +
      " where IdOrden = ? and TotalAnimalesReal > 0";
    let selectQuery = await crud.ExecuteQuery(querySelect, [p5]);
    var rows = selectQuery.rows;

    let querySelect1 =
      "select *  from  Tickets" +
      " where NumTicket = ? and GranjaLote = ? and FechaEntradaCuadrilla is not null and FechaEntradaTransporte is not null";
    let selectQuery1 = await crud.ExecuteQuery(querySelect1, [p3, p4]);
    var rows1 = selectQuery1.rows;

    //console.log(rows);
    if (rows.length == 0) {
      setTimeout(() => {
        return Alert.alert(
          "Mensaje",
          "No puede cerrar ticket sin cargar galpones"
        );
      }, 300);
    } else if (rows1.length == 0) {
      setTimeout(() => {
        return Alert.alert(
          "Mensaje",
          "No puede cerrar ticket sin cargar fechas en el detalle de la recolección"
        );
      }, 300);
    } else {
      let query =
        "update tickets" +
        " set FLEstatus = 'FE'" +
        " , IdMotivoCancelacion = null" +
        " , DesMotivoCancelacion = null" +
        " , ObserMotivoCancelacion = null" +
        " , FechaFinalRecepcion = ?" +
        " , FechaSalidaTransporte = ?" +
        " where NumTicket = ? and GranjaLote = ?";
      let updateOps = await this.ExecuteQuery(query, [p1, p2, p3, p4]);
      //console.log(updateOps);
      if (updateOps.rowsAffected == 1) {
        setTimeout(() => {
          return Alert.alert("Mensaje", "Se cambia estatus de ticket: Cerrado");
        }, 300);
      } else {
        return setTimeout(() => {
          return Alert.alert("Mensaje", "Error guardando, intente de nuevo");
        }, 300);
      }
    }
  }

  async UpdateSincroTicketsStatusCancelar(p1, p2, p3, p4, p5, p6) {
    let query =
      "update tickets" +
      " set FLEstatus = 'CN'" +
      " , IdMotivoCancelacion = ?" +
      " , DesMotivoCancelacion = ?" +
      " , ObserMotivoCancelacion = ?" +
      " , FechaCancelacion = ?" +
      " where NumTicket = ? and GranjaLote = ?";
    let updateOps = await this.ExecuteQuery(query, [p1, p2, p3, p4, p5, p6]);
    //console.log(updateOps);
    if (updateOps.rowsAffected == 1) {
      setTimeout(() => {
        return Alert.alert("Mensaje", "Se cambia estatus de ticket: Cancelado");
      }, 300);
    } else {
      return setTimeout(() => {
        return Alert.alert("Mensaje", "Error guardando, intente de nuevo");
      }, 300);
    }
  }

  async UpdateSincroTicketsStatusObservaciones(p1, p2, p3, p4, p5, p6) {
    if (p1.length > 250){
      return Alert.alert("Mensaje", "La observación no puede tener mas de 250 caractéres");
    } else {
    // console.log(p1 + p2)
    let query =
      "update tickets" +
      " set Observaciones = '" + p1 + '\nP1: ' + p2 + '\nP2: ' + p3 + '.\nP3: ' + p4 + "'" +
      " where NumTicket = ? and GranjaLote = ?";
    // console.log(query)
    let updateOps = await this.ExecuteQuery(query, [p5, p6]);
    //console.log(updateOps);
    if (updateOps.rowsAffected == 1) {
      setTimeout(() => {
        return Alert.alert("Mensaje", "Observación cargada");
      }, 300);
    } else {
      return setTimeout(() => {
        return Alert.alert("Mensaje", "Error guardando, intente de nuevo");
      }, 300);
    }
   }
  }

  async updateParcheTicket() {
    let query =
      "update tickets" +
      " set FechaCancelacion = null, IdUsuarioCancelacion = null," +
      " NR_GAIOVAZIORDEPESA = null, Observaciones = null, Remolque1 = null," +
      " Remolque2 = null, MetodoRecolecReal = null, FechaSincronizacionPDA2 = null, FLEstatusPda = null," +
      " ObserMotivoCancelacion = null, FechaEntradaTransporte = null, FechaInicioRecepcion = null," +
      " FechaEntradaCuadrilla = null, FechaSalidaTransporte = null, FechaEntradaTransporte = null, FechaFinalRecepcion = null," +
      " IdMotivoCancelacion = null, FLEstatus = 'AB'";
    let updateOps = await this.ExecuteQuery(query, []);
    //console.log(updateOps);
  }

  async updateParcheTicketDetalle() {
    let query =
      "update TicketsDetalle" +
      " set FechaRetiradaAlimento = null, CantidadJaulasReal = null," +
      " TotalAnimalesReal = null, GalponReal = null, AnimalesPJaulasReal = null";
    let updateOps = await this.ExecuteQuery(query, []);
    //console.log(updateOps);
  }

  validator(param){
    var dia = parseInt(param.substring(0, 2));
    var mes = parseInt(param.substring(3, 5));
    var anio = parseInt(param.substring(6, 10));
    var hora = parseInt(param.substring(11, 13));
    var minuto = parseInt(param.substring(14, 16));
    var year = parseInt(new Date().getFullYear());
    if(mes==parseInt('01') && dia>parseInt('31')){
       return true;
    } else if (mes ==parseInt('03') && dia>parseInt('31')){
       return true;
    } else if (mes==parseInt('05')  && dia>parseInt('31')){
       return true;
    } else if (mes==parseInt('07')  && dia>parseInt('31')){
       return true;
    } else if (mes==parseInt('08')  && dia>parseInt('31')){
       return true;
    } else if (mes==parseInt('10')  && dia>parseInt('31')){
       return true;
    } else if (mes==parseInt('12')  && dia>parseInt('31')){
       return true;
    } else if (mes==parseInt('12')  && dia>parseInt('31')){
       return true;
    } else if (hora>parseInt('24')){
       return true;
    } else if (mes>parseInt('12')){
       return true;   
    } else if (anio>year){
       return true; 
    } else if (anio<year){
        return true;      
    } else if (minuto>parseInt('59')){
       return true;
    } else if (dia<=parseInt('00')){
       return true; 
    } else if (mes<=parseInt('00')){
       return true; 
     } else if (anio<=parseInt('0000')){
       return true;                                                                          
    } else {
      return false;
    }
  }

  //End class
}

const crud = new Operations();

export default crud;
