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
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ListItem, Divider } from "react-native-elements";
import * as yup from "yup";
import { Formik } from "formik";
import crud from "./Crud";
import RNTextArea from "@freakycoder/react-native-text-area";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RecolectarDComentario = ({ navigation, route }) => {
  const [table, setTable] = useState([]);

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

  const [sdcomentario, setsdComentario] = useState("N/A");
  const [sdprecinto1, setsdPrecinto1] = useState("0");
  const [sdprecinto2, setsdPrecinto2] = useState("0");
  const [sdprecinto3, setsdPrecinto3] = useState("0");

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };
  

  const getData1 = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      //console.log(value)
      if (value !== null) {
        setsdComentario(value)
      } 
    } catch (e) {
      // error reading value
    }
  };

  const getData2 = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      //console.log(value)
      if (value !== null) {
        setsdPrecinto1(value)
      } 
    } catch (e) {
      // error reading value
    }
  };

  const getData3 = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      //console.log(value)
      if (value !== null) {
        setsdPrecinto2(value)
      } 
    } catch (e) {
      // error reading value
    }
  };

  const getData4 = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      //console.log(value)
      if (value !== null) {
        setsdPrecinto3(value)
      } 
    } catch (e) {
      // error reading value
    }
  };

  const guardar = (p1, p2, p3, p4, p5, p6) => {
    crud.UpdateSincroTicketsStatusObservaciones(p1, p2, p3, p4, p5, p6);
    //storeData("sdcomentario", p1)
    //storeData("sdprecinto1",  p2)
    //storeData("sdprecinto2",  p3)
    //storeData("sdprecinto3",  p4)
    setTimeout(() => {
      SelectTicketsDetalle();
    }, 1000);
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
    setTimeout(() => {
      SelectTicketsDetalle();
    }, 1000);
    getData1("sdcomentario"),
    getData2("sdprecinto1"),
    getData3("sdprecinto2"),
    getData4("sdprecinto3")
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
      <Divider style={{ backgroundColor: "#FFF", height: 3 }} />
      {table.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Observaciones: </Text>
              {item.Observaciones}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
      <Formik
        enableReinitialize
        initialValues={{
          comentario: sdcomentario,
          precinto1: sdprecinto1,
          precinto2: sdprecinto2,
          precinto3: sdprecinto3,
        }}
        onSubmit={(values) =>
          guardar(
            values.comentario,
            values.precinto1,
            values.precinto2,
            values.precinto3,
            route.params.ticket,
            route.params.lote.split(" / ")[0]
          )
        }
        validationSchema={yup.object().shape({
          comentario: yup.string().required("Campo requerido!"),
          precinto1: yup.string().required("Campo requerido!"),
          precinto2: yup.string().required("Campo requerido!"),
          precinto3: yup.string().required("Campo requerido!"),
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
            <Text>Observaciones</Text>
            <RNTextArea
              maxCharLimit={250}
              placeholderTextColor="white"
              exceedCharCountColor="#990606"
              placeholder={"Escriba sus comentarios aqui ..."}
              onChangeText={handleChange("comentario")}
              onBlur={() => setFieldTouched("comentario")}
              style={styles.textArea}
            />
            {touched.comentario && errors.comentario && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.comentario}
              </Text>
            )}
            <Text>Número Precinto1</Text>
            <TextInput
              value={values.precinto1}
              style={inputStyle}
              maxLength={10}
              onChangeText={handleChange("precinto1")}
              onBlur={() => setFieldTouched("precinto1")}
              placeholder="Precinto1"
            />
            {touched.precinto1 && errors.precinto1 && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.precinto1}
              </Text>
            )}
            <Text>Número Precinto1</Text>
            <TextInput
              value={values.precinto2}
              style={inputStyle}
              maxLength={10}
              onChangeText={handleChange("precinto2")}
              onBlur={() => setFieldTouched("precinto2")}
              placeholder="Precinto2"
            />
            {touched.precinto2 && errors.precinto2 && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.precinto2}
              </Text>
            )}
            <Text>Número Precinto3</Text>
            <TextInput
              value={values.precinto3}
              style={inputStyle}
              maxLength={10}
              onChangeText={handleChange("precinto3")}
              onBlur={() => setFieldTouched("precinto3")}
              placeholder="Precinto3"
            />
            {touched.precinto3 && errors.precinto3 && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.precinto3}
              </Text>
            )}
            <Divider style={{ backgroundColor: "#FFF", height: 2 }} />
            <TouchableOpacity
              style={styles.loginBtn}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text style={styles.loginText}>GUARDAR</Text>
            </TouchableOpacity>
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
  textArea: {
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#00843D",
    backgroundColor: "#8d8684",
    color: "red",
    borderRadius: 5,
  },
});

export default RecolectarDComentario;
