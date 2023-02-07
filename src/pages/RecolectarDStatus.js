/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ListItem, Divider } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import * as yup from "yup";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import crud from "./Crud";
import Icon from "react-native-vector-icons/FontAwesome";
import { Col, Row, Grid } from "react-native-easy-grid";

const RecolectarDStatus = ({ navigation, route }) => {
  const [selectedMotivo, setSelectedMotivo] = useState();
  const [listMotivo, setListMotivo] = useState([]);
  const [estatus, setEstatus] = useState("");
  const [galpones, setGalpones] = useState("");
  const [fechas, setFechas] = useState("");
  const [table, setTable] = useState([]);
  const [currentDate, setCurrentDate] = useState("");


  //Default value for cuadrilla list
  async function SelectSincroMotivosCancelacion() {
    let query =
      "select DesMotivoCancelacion,  IdMotivoCancelacion as val from SincroMotivosCancelacion";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var temp = [];
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setListMotivo(temp);
  }

  //Default value for metodo
  async function SelectMetodo() {
    let query =
      "select  IdMotivoCancelacion ||' - '||DesMotivoCancelacion as val from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    ////console.log(rows.length);
    if (selectQuery.rows.length > 0) {
      setSelectedMotivo(rows.item(0).val);
    }
  }

  //Default value for metodo
  async function SelectGalpones() {
    let query =
      "select *  from  TicketsDetalle" +
      " where IdOrden = ? and TotalAnimalesReal > 0";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.IdOrden
    ]);
    var rows = selectQuery.rows;
    //console.log(rows.length);
    if (selectQuery.rows.length == 0) {
      setGalpones("A");
    }
  }

  //Default value for metodo
  async function SelectFechas() {
    let query =
      "select *  from  Tickets" +
      " where NumTicket = ? and GranjaLote = ? and FechaEntradaCuadrilla is not null and FechaEntradaTransporte is not null";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    ////console.log(rows.length);
    if (selectQuery.rows.length == 0) {
      setFechas("A");
    }
  }

  //Default picker value
  const pickerMetodo = listMotivo.map((data) => {
    return (
      <Picker.Item
        label={data.DesMotivoCancelacion}
        value={data.val}
        key={data.val}
      />
    );
  });

  const list = [
    {
      ticket: "Nro.Ticket",
      ticketVal: route.params.ticket,
      lote: "Lote",
      loteVal: route.params.lote,
    },
  ];

  const inputStyle = {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    color: "black",
    fontFamily: "Ubuntu",
    marginBottom: 5,
  };

  //Default value for metodo
  async function SelectEstatus() {
    let query =
      "select  case FLEstatus when 'CN' then 'Cancelado' when 'AB' then 'Abierto' else 'Cerrado' end FLEstatus from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    ////console.log(rows.length);
    if (selectQuery.rows.length > 0) {
      setEstatus(rows.item(0).FLEstatus);
    }
  }

  //List medoto de recoleccion
  async function SelectTicketsDetalle() {
    let query = "select * from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setTable(temp);
  }

  const abrir = (p1, p2) => {
    crud.UpdateSincroTicketsStatusAbierto(p1, p2);
    SelectMetodo();
    SelectEstatus();
    SelectTicketsDetalle();
  };

  const opsCerrar = (p1, p2, p3, p4) => {
    crud.UpdateSincroTicketsStatusCerrar(p1, p2, p3, p4, route.params.IdOrden);
    SelectMetodo() ;
    SelectEstatus();
    SelectTicketsDetalle();
    //console.log('Estatus: ' + estatus);
    setTimeout(() => {
      navigation.navigate("Impresora", {
        ticket: route.params.ticket,
        lote: route.params.lote,
        jaulas: Number(route.params.jaulas),
        IdOrden: route.params.IdOrden,
      });
    }, 500);
  };

  const cerrar = (p1, p2, p3, p4) => {
    Alert.alert(
      "Mensaje",
      "El proceso del cierre es irreversible, desea continuar?",
      [
        {
          text: "Si",
          onPress: () => opsCerrar(p1, p2, p3, p4),
          style: "cancel",
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const cancelar = (p1, p2, p3, p4, p5) => {
    //console.log(currentDate);
    if (selectedMotivo == null) {
      Alert.alert("Mensaje", "Para cancelar seleccione motivo de cancelación");
    } else {
      crud.UpdateSincroTicketsStatusCancelar(p1, p2, p3, currentDate, p4, p5);
      SelectMetodo();
      SelectEstatus();
      SelectTicketsDetalle();
      setTimeout(() => {
        navigation.navigate("Recolectar");
      }, 500);
    }
  };

  onBackPress = () => {
    return false;
  };

  //Hook
  useEffect(() => {
    SelectSincroMotivosCancelacion();
    SelectMetodo();
    SelectEstatus();
    SelectTicketsDetalle();
    SelectGalpones();
    SelectFechas();
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    //console.log(route.params.jaulas);

    if (month < 10) {
      month = "0" + month;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (date < 10) {
      date = "0" + date;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    setCurrentDate(date + "/" + month + "/" + year + " " + hours + ":" + min);
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      {list.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <Image
            source={require("../assets/img/delete-ticket-32.png")}
            style={styles.logo}
          />
          <ListItem.Content>
            <ListItem.Title>
              <Text style={styles.subtitle}>{item.ticket}: </Text>
              {item.ticketVal}
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>{item.lote}: </Text>
              {item.loteVal.split(" / ")[0]}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text>Nro.Orden: </Text>
              {item.loteVal.split(" / ")[1]}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Text style={styles.text}>---Estatus del ticket: {estatus}---</Text>
      {table.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Observaciones: </Text>
              {item.ObserMotivoCancelacion}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
      <Formik
        enableReinitialize
        initialValues={{
          comentario: "",
          d4: currentDate,
          d2: currentDate,
        }}
        onSubmit={(values) =>
          cancelar(
            selectedMotivo,
            "",
            values.comentario,
            route.params.ticket,
            route.params.lote.split(" / ")[0]
          )
        }
        validationSchema={yup.object().shape({
          comentario: yup.string().required("Campo requerido!"),
          d4: yup.string().required("Campo requerido!"),
          d2: yup.string().required("Campo requerido!"),
        })}
      >
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <View style={styles.formContainer}>
            <Picker
              selectedValue={selectedMotivo}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMotivo(itemValue)
              }
            >
              <Picker.Item label="---Selecionar Motivo de Cancelación--" />
              {pickerMetodo}
            </Picker>
            <Text>Colocar comentario sólo si esta cancelando el ticket</Text>
            <TextInput
              value={values.comentario}
              style={inputStyle}
              onChangeText={handleChange("comentario")}
              onBlur={() => setFieldTouched("comentario")}
              placeholder="Comentario"
            />
            {touched.comentario && errors.comentario && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.comentario}
              </Text>
            )}
            <Divider style={{ backgroundColor: "#FFF", height: 15 }} />
            <Text>Salida de vehiculo (DD/MM/YYYY HH:mm)</Text>
            <TextInputMask
              style={inputStyle}
              type={"datetime"}
              editable={false}
              placeholder="Salida de vehiculo (DD/MM/YYYY HH:mm)"
              options={{
                format: "DD/MM/YYYY HH:mm",
              }}
              value={values.d2}
              onChangeText={handleChange("dt2")}
              onBlur={() => setFieldTouched("dt2")}
            />
            {touched.d2 && errors.d2 && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.d2}
              </Text>
            )}
            <Text>Salida de recolección (DD/MM/YYYY HH:mm)</Text>
            <TextInputMask
              style={inputStyle}
              type={"datetime"}
              editable={false}
              placeholder="Salida de recolección (DD/MM/YYYY HH:mm)"
              options={{
                format: "DD/MM/YYYY HH:mm",
              }}
              value={values.d4}
              onChangeText={handleChange("dt4")}
              onBlur={() => setFieldTouched("dt4")}
            />
            <Divider style={{ backgroundColor: "#FFF", height: 2 }} />
            <TouchableOpacity
              style={styles.loginBtn}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text style={styles.loginText}>CANCELAR TICKET</Text>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
            <Grid>
              <Row size={1}>
                <Col>
                { galpones != 'A' && fechas != 'A' ? 
                  <TouchableOpacity
                    style={styles.BtnEstatus}
                    onPress={() =>
                      cerrar(
                        currentDate,
                        currentDate,
                        route.params.ticket,
                        route.params.lote.split(" / ")[0]
                      )
                    }
                  >
                    <Text style={styles.btnText}>Cerrar Ticket</Text>
                    <Icon color="#00843D" name="ticket" size={25} />
                  </TouchableOpacity>
                  : <TouchableOpacity
                    style={styles.BtnEstatus}
                    onPress={() =>
                      Alert.alert("Mensaje", "Para cerrar el ticket cargue galpones y fechas en detalle de recolección")
                    }
                  >
                    <Text style={styles.btnText}>Cerrar Ticket</Text>
                    <Icon color="#00843D" name="ticket" size={25} />
                  </TouchableOpacity>
                  }
                </Col>
              </Row>
            </Grid>
            <Divider style={{ backgroundColor: "#FFD100", height: 5 }} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  formContainer: {
    backgroundColor: "#fff",
    height: "100%",
    width: "96%",
    marginLeft: "2%",
    fontFamily: "Ubuntu",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Ubuntu",
  },
  subtitle1: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Ubuntu",
  },
  loginBtn: {
    backgroundColor: "#00843D",
    borderRadius: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  BtnDetalle: {
    backgroundColor: "#012169",
    borderRadius: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  loginText: {
    color: "white",
  },
  text: {
    fontFamily: "Ubuntu",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Ubuntu",
    textAlign: "center",
  },
  BtnEstatus: {
    backgroundColor: "#E6E1C5",
    borderRadius: 5,
    width: "99%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  pickerStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    fontFamily: "Ubuntu",
    marginBottom: 5,
  },
  btn: {
    borderColor: "#DA291C",
  },
  nd: {
    display: "none",
  },
});

export default RecolectarDStatus;
