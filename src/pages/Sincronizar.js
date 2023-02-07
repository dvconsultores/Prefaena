/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import axios from "axios";
import crud from "./Crud";

const Sincronizar = ({ navigation }) => {
  const [list, setList] = useState([]);
  const [list4, setList4] = useState([]);
  const [arrayObject, setArrayObject] = useState([]);
  const [load, setLoad] = useState(false);
  const abortController = new AbortController();

  async function SelectTickets() {
    let query = "select id";
        query += ", IdPDA";
        query += ", IdMetodoRecolec";
        query += ", NumTicket";
        query += ", NumOrdenTrans";
        query += ", PlacaVehiculo";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaRecoleccion) FechaRecoleccion";
        query += ", FLEstatus";
        query += ", Conductor";
        query += ", Remolque1";
        query += ", Remolque2";
        query += ", GranjaLote";
        query += ", desGranja";
        query += ", IdCuadrillaProgramado";
        query += ", DesCuadrilla";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaProgramacion) FechaProgramacion";
        query += ", TotalAnimales";
        query += ", CantidadJaulas";
        query += ", AnimalesPJaulas";
        query += ", Observaciones";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaEntradaCuadrilla) FechaEntradaCuadrilla";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaInicioRecepcion) FechaInicioRecepcion";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaFinalRecepcion) FechaFinalRecepcion";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaEntradaTransporte) FechaEntradaTransporte";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaSalidaTransporte) FechaSalidaTransporte";
        query += ", IdCuadrillaReal";
        query += ", NR_GAIOVAZIORDEPESA";
        query += ", MetodoRecolecReal";
        query += ", FLEstatusPda";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaSincronizacionPDA) FechaSincronizacionPDA";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaSincronizacionPDA2) FechaSincronizacionPDA2";
        query += ", IdMotivoCancelacion";
        query += ", DesMotivoCancelacion";
        query += ", ObserMotivoCancelacion";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaCancelacion) FechaCancelacion";
        query += ", IdUsuarioCancelacion";
        query += ", IdOrden";
        query += " from tickets";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    var temp = [];
    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        temp.push(rows.item(i));
      }
      setList(temp);
    } else {
      setList([]);
    }
  }

  async function SelectTicketsDetalle() {
    let query = "select id";
        query += ", ID_GALPORDEPESA";
        query += ", IdOrden";
        query += ", GalponReal";
        query += ", TotalAnimalesReal";
        query += ", CantidadJaulasReal";
        query += ", AnimalesPJaulasReal";
        query += ", STRFTIME('%d/%m/%Y %H:%M', FechaRetiradaAlimento) FechaRetiradaAlimento";
        query += " from TicketsDetalle";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    var temp = [];
    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        temp.push(rows.item(i));
      }
      setList4(temp);
    } else {
      setList4([]);
    }
  }

  const getDataUsingAsyncAwaitGetCall = async () => {
    SelectTickets();
    SelectTicketsDetalle();
    setArrayObject([])
    //send json to back end
    arrayObject.push(list) //Arreglo1 es el json con la lista de tickets
    arrayObject.push(list4) //Arreglo2 es el json con la lista de tickets detalles
    //console.log(list4)
    //console.log(JSON.stringify(arrayObject));
    
    try {
      const response = await axios.post(
        global.baseurl + "/SincroTickets/",
        JSON.stringify(arrayObject)
      );
      if (response.status == 200) {
        //console.log(response.data[0])
        crud.InsertTickets(response.data[0]);
        crud.InsertTicketsDetalle(response.data[1]);
        crud.InsertSincroGalpones(response.data[2])
      }
    } catch (error) {
      // handle error
      navigation.navigate("Login");
      console.log(error);
    }
    
    setTimeout(() => abortController.abort(), 150);
    setLoad(false);
    
  };

  const getDataUsingAsyncAwaitGetCall1 = async () => {
    try {
      const response = await axios.get(
        global.baseurl + "/SincroCuadrilla"
      );
      if (response.status == 200) {
        crud.InsertSincroCuadrilla(response.data);
      }
    } catch (error) {
      // handle error
      navigation.navigate("Login");
      //console.log(error);
    }
    setTimeout(() => abortController.abort(), 150);
  };

  const getDataUsingAsyncAwaitGetCall2 = async () => {
    //send json to back end
    try {
      const response = await axios.get(
        global.baseurl + "/SincroMotivoCancelacion"
      );
      if (response.status == 200) {
        crud.InsertSincroMotivosCancelacion(response.data);
      }
    } catch (error) {
      // handle error
      navigation.navigate("Login");
      //console.log(error);
    }
    setTimeout(() => abortController.abort(), 150);
  };

  const getDataUsingAsyncAwaitGetCall3 = async () => {
    //send json to back end
    setLoad(true);
    try {
      const response = await axios.get(
        global.baseurl + "/SincroMetodoRecoleccion"
      );
      ////console.log(response.status);
      if (response.status == 200) {
        crud.InsertSincroMetodoRecoleccion(response.data);
      }
    } catch (error) {
      // handle error
      navigation.navigate("Login");
      //console.log(error);
    }
    setTimeout(() => abortController.abort(), 150);
  };


  //Hook
  useEffect(() => {
    SelectTickets();
    SelectTicketsDetalle();
  }, []);

  const sincroTickets = () => {
    setTimeout(() => getDataUsingAsyncAwaitGetCall3(), 150);
    setTimeout(() => getDataUsingAsyncAwaitGetCall2(), 150);
    setTimeout(() => getDataUsingAsyncAwaitGetCall1(), 150);
    setTimeout(() => getDataUsingAsyncAwaitGetCall(), 150);
    ////console.log(list.IdPDA);
  };

  async function sincroAll() {
    //console.log("Sincro All");
    //Tickets
    let query = "select * from tickets where FLEstatus = 'AB'";
    let selectQuery = await crud.ExecuteQuery(query, []);
    //console.log(selectQuery.rows.length);
    //if (selectQuery.rows.length > 0) {
    //  Alert.alert(
    //    "Mensaje",
    //    "Todos los tickets deben estar cerrados para poder sincronizar"
    //  );
    //} else {
      sincroTickets();
    //}
  }

  if (!load) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.loginBtn} onPress={() => sincroAll()}>
          <Text>Pulse para Sincronizar datos</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Sincronizando...</Text>
        <Text />
        <ActivityIndicator size="large" color="#FFD100" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#FFD100",
    borderRadius: 10,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    fontFamily: "Ubuntu",
  },
  loginText: {
    color: "white",
  },
});

export default Sincronizar;
