/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ListItem, Divider } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import * as yup from "yup";
import { Formik } from "formik";
import { TextInputMask } from "react-native-masked-text";
import crud from "./Crud";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/FontAwesome";

const RecolectarD = ({ navigation, route }) => {
  const list = [
    {
      ticket: "Nro.Ticket",
      ticketVal: route.params.ticket,
      lote: "Lote",
      loteVal: route.params.lote.split(" / ")[0],
      orden: "Lote",
      ordenVal: route.params.lote.split(" / ")[1],
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

  const inputStyle1 = {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#FFF6",
    padding: 12,
    color: "black",
    fontFamily: "Ubuntu",
    marginBottom: 5,
  };
  const [selectedCuadrilla, setSelectedCuadrilla] = useState(
    route.params.DesCuadrilla
  );
  const [selectedIdCuadrillaReal, setIDSelectedCuadrillaReal] = useState(
    route.params.DesCuadrilla
  );
  const [selectedMetodo, setSelectedMetodo] = useState();

  //
  const [listCuadrilla, setListCuadrilla] = useState([]);
  const [listMetodoRecoleccion, setListMetodoRecoleccion] = useState([]);
  const [table, setTable] = useState([]);
  //
  const [currentDate, setCurrentDate] = useState("");

  //Asignar lista sincro cuadrilla
  async function SelectSincroCuadrilla() {
    let query = "select * from SincroCuadrilla";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var temp = [];
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setListCuadrilla(temp);
  }

  //Render picker sicnrocuadrilla using map
  const pickerCuadrillla = listCuadrilla.map((data) => {
    return (
      <Picker.Item
        label={data.DesCuadrilla}
        value={data.IdCuadrilla}
        key={data.IdCuadrilla}
      />
    );
  });

  //List medoto de recoleccion
  async function SelectSincroMetodoRecoleccion() {
    let query = "select * from SincroMetodoRecoleccion";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setListMetodoRecoleccion(temp);
  }

  //Default value for metodo
  async function SelectMetodo() {
    let query =
      "select IdMetodoRecolec from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    ////console.log(rows.length);
    if (selectQuery.rows.length > 0) {
      setSelectedMetodo(rows.item(0).IdMetodoRecolec);
    }
  }

  //Default picker value
  const pickerMetodo = listMetodoRecoleccion.map((data) => {
    return (
      <Picker.Item
        label={data.desMetodoRecolec}
        value={data.IdMetodoRecolec}
        key={data.IdMetodoRecolec}
      />
    );
  });

  const update = (p1, p2, p4, p5, p6, p7, p8, p9) => {
    if (crud.validator(p1)) {
      Alert.alert(
        "Mensaje",
        "El formato de fecha de llegada de cuadrilla es inválido"
      );
    } else if (crud.validator(p2)) {
      Alert.alert(
        "Mensaje",
        "El formato de fecha de entrada de vehiculo es inválido"
      );
    } else {
      crud.UpdateSincroTickets(p1, p2, p4, p5, p6, p7, p8, p9);
      setTimeout(() => {
        SelectTicketsDetalle();
      }, 1000);
      
    }
  };

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


  //Hook
  useEffect(() => {
    SelectSincroCuadrilla();
    SelectSincroMetodoRecoleccion();
    SelectMetodo();
    setTimeout(() => {
      SelectTicketsDetalle();
    }, 300);
    setSelectedCuadrilla(route.params.DesCuadrilla);
    //console.log(route.params.jaulas);

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
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
              {item.loteVal}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text>Nro.Orden: </Text>
              {item.ordenVal}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Divider style={{ backgroundColor: "#FFD100", height: 2 }} />
      {table.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Cuadrilla: </Text>
              {item.DesCuadrilla}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Llegada de cuadrilla: </Text>
              {item.FechaEntradaCuadrilla}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>LLegada de vehiculo: </Text>
              {item.FechaEntradaTransporte}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Salida de vehiculo: </Text>
              {item.FechaSalidaTransporte}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Inicio de recolección: </Text>
              {item.FechaInicioRecepcion}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Salida de recolección: </Text>
              {item.FechaFinalRecepcion}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
      <Formik
        enableReinitialize
        initialValues={{
          dt: "",
          dt1: "",
          dt3: currentDate,
        }}
        onSubmit={(values) =>
          update(
            values.dt,
            values.dt1,
            values.dt3,
            selectedCuadrilla,
            selectedMetodo,
            route.params.ticket,
            route.params.lote.split(" / ")[0]
          )
        }
        validationSchema={yup.object().shape({
          dt: yup.string().required("Campo requerido!"),
          dt1: yup.string().required("Campo requerido!"),
          dt3: yup.string().required("Campo requerido!"),
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
              selectedValue={selectedCuadrilla.split(" - ")[0]}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCuadrilla(itemValue)
              }
            >
              {pickerCuadrillla}
            </Picker>
            <Picker
              selectedValue={selectedMetodo}
              style={styles.pickerStyle}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMetodo(itemValue)
              }
            >
              <Picker.Item label="Selecionar Método de Recolección" />
              {pickerMetodo}
            </Picker>
            <Text>Llegada de cuadrilla (DD/MM/YYYY HH:mm 24 horas)</Text>
            <TextInputMask
              style={inputStyle}
              type={"datetime"}
              placeholder="Llegada de cuadrilla (DD/MM/YYYY HH:mm)"
              options={{
                format: "DD/MM/YYYY HH:mm",
              }}
              value={values.dt}
              onChangeText={handleChange("dt")}
              onBlur={() => setFieldTouched("dt")}
            />
            {touched.dt && errors.dt && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.dt}
              </Text>
            )}
            <Text>Llegada de vehiculo (DD/MM/YYYY HH:mm 24 horas)</Text>
            <TextInputMask
              style={inputStyle}
              type={"datetime"}
              placeholder="Llegada de vehiculo (DD/MM/YYYY HH:mm)"
              options={{
                format: "DD/MM/YYYY HH:mm",
              }}
              value={values.dt1}
              onChangeText={handleChange("dt1")}
              onBlur={() => setFieldTouched("dt1")}
            />
            {touched.dt1 && errors.dt1 && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.dt1}
              </Text>
            )}
            <Text>Inicio de recolección (DD/MM/YYYY HH:mm 24 horas)</Text>
            <TextInputMask
              style={inputStyle1}
              editable={false}
              type={"datetime"}
              placeholder="Inicio de recolección (DD/MM/YYYY HH:mm)"
              options={{
                format: "DD/MM/YYYY HH:mm",
              }}
              value={values.dt3}
              onChangeText={handleChange("dt3")}
              onBlur={() => setFieldTouched("dt3")}
            />
            {touched.dt3 && errors.dt3 && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.dt3}
              </Text>
            )}
            <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
            <TouchableOpacity
              style={styles.loginBtn}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text style={styles.loginText}>GUARDAR</Text>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
            <Grid>
              <Row size={2}>
                <Col>
                  <TouchableOpacity
                    style={styles.BtnEstatus}
                    onPress={() =>
                      navigation.navigate("RecolectarDTable", {
                        ticket: route.params.ticket,
                        lote: route.params.lote,
                        orden: route.params.orden,
                        jaulas: route.params.jaulas,
                        animalesjaulas: route.params.animalesjaulas,
                        IdOrden: route.params.IdOrden,
                      })
                    }
                  >
                    <Text style={styles.btnText}>Detalle</Text>
                    <Icon color="#00843D" name="table" size={25} />
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity
                    style={styles.BtnEstatus}
                    onPress={() =>
                      navigation.navigate("RecolectarDStatus", {
                        ticket: route.params.ticket,
                        lote: route.params.lote,
                        IdOrden: route.params.IdOrden,
                        jaulas: route.params.jaulas,
                      })
                    }
                  >
                    <Text style={styles.btnText}>Estatus</Text>
                    <Icon color="#00843D" name="check-square" size={25} />
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity
                    style={styles.BtnEstatus}
                    onPress={() =>
                      navigation.navigate("RecolectarDComentario", {
                        ticket: route.params.ticket,
                        lote: route.params.lote,
                      })
                    }
                  >
                    <Text style={styles.btnText}>Comentario</Text>
                    <Icon color="#00843D" name="comments" size={25} />
                  </TouchableOpacity>
                </Col>
              </Row>
            </Grid>
            <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
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
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
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
  BtnDetalle: {
    backgroundColor: "#012169",
    borderRadius: 5,
    height: 60,
    width: "99%",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  loginText: {
    color: "white",
  },
  btnText: {
    color: "black",
  },
  pickerStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    fontFamily: "Ubuntu",
    marginBottom: 5,
  },
});

export default RecolectarD;
